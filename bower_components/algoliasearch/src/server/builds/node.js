'use strict';

// This is the Node.JS entry point
module.exports = algoliasearch;

var debug = require('debug')('algoliasearch:nodejs');
var crypto = require('crypto');
var zlib = require('zlib');

var inherits = require('inherits');
var Promise = global.Promise || require('es6-promise').Promise;
var semver = require('semver');
var isNotSupported = semver.satisfies(process.version, '<0.10');
var isNode010 = semver.satisfies(process.version, '=0.10');
var places = require('../../places.js');

var AlgoliaSearchServer = require('./AlgoliaSearchServer');
var errors = require('../../errors');

// does not work on node <= 0.8
if (isNotSupported) {
  throw new errors.AlgoliaSearchError('Node.js version ' + process.version + ' is not supported');
}

if (process.env.APP_ENV === 'development') {
  require('debug').enable('algoliasearch*');
}

debug('loaded the Node.js client');

function algoliasearch(applicationID, apiKey, opts) {
  var cloneDeep = require('../../clone.js');
  var reduce = require('reduce');

  if (!opts) {
    opts = {};
  }

  var httpAgent = opts.httpAgent;

  opts = cloneDeep(reduce(opts, allButHttpAgent, {}));

  // as an httpAgent is an object with methods etc, we take a reference to
  // it rather than cloning it like other values
  function allButHttpAgent(filteredOpts, val, keyName) {
    if (keyName !== 'httpAgent') {
      filteredOpts[keyName] = val;
    }

    return filteredOpts;
  }

  opts.httpAgent = httpAgent;

  // this is a global timeout, even if the socket has some
  // activity, we will kill it
  // There's no easy way to detect socket activity in nodejs it seems
  if (opts.timeout === undefined) {
    opts.timeout = 30 * 1000;
  }

  if (opts.protocol === undefined) {
    opts.protocol = 'https:';
  }

  opts._ua = opts._ua || algoliasearch.ua;
  opts._useCache = false;

  return new AlgoliaSearchNodeJS(applicationID, apiKey, opts);
}

algoliasearch.version = require('../../version.js');
algoliasearch.ua = 'Algolia for Node.js ' + algoliasearch.version;
algoliasearch.initPlaces = places(algoliasearch);

function AlgoliaSearchNodeJS(applicationID, apiKey, opts) {
  var getAgent = require('./get-agent');

  // call AlgoliaSearchServer constructor
  AlgoliaSearchServer.apply(this, arguments);

  this._Agent = opts.httpAgent || getAgent(opts.protocol);
}

inherits(AlgoliaSearchNodeJS, AlgoliaSearchServer);

AlgoliaSearchNodeJS.prototype._request = function request(rawUrl, opts) {
  var http = require('http');
  var https = require('https');
  var url = require('url');

  var client = this;

  return new Promise(function doReq(resolve, reject) {
    opts.debug('url: %s, method: %s, timeout: %d', rawUrl, opts.method, opts.timeout);

    var body = opts.body;

    var parsedUrl = url.parse(rawUrl);
    var requestOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      method: opts.method,
      path: parsedUrl.path,
      agent: client._Agent
    };

    var timedOut = false;
    var timeoutId;
    var req;

    if (parsedUrl.protocol === 'https:') {
      // we do not rely on any "smart" port computing by either node.js
      // or a custom http agent, because:
      // https://github.com/TooTallNate/node-https-proxy-agent/issues/7#issuecomment-119539690
      if (requestOptions.port === null) {
        requestOptions.port = 443;
      }
      req = https.request(requestOptions);
    } else {
      // same reason to set the port as `https:`
      if (requestOptions.port === null) {
        requestOptions.port = 80;
      }
      req = http.request(requestOptions);
    }

    req.setHeader('connection', 'keep-alive');
    req.setHeader('accept', 'application/json');

    Object.keys(opts.headers).forEach(function setRequestHeader(headerName) {
      req.setHeader(headerName, opts.headers[headerName]);
    });

    req.setHeader('accept-encoding', 'gzip,deflate');

    // we do not use req.setTimeout because it's either an inactivity timeout
    // or a global timeout given the nodejs version
    timeoutId = setTimeout(timeout, opts.timeout);

    req.once('error', error);
    req.once('response', response);
    if (body) {
      req.setHeader('content-type', 'application/json');
      req.setHeader('content-length', Buffer.byteLength(body, 'utf8'));
      req.write(body);
    } else if (req.method === 'DELETE') {
      // Node.js was setting transfer-encoding: chunked on all DELETE requests
      // which is not good since there's no body to be sent, resulting in nginx
      // sending 400 on socket reuse (waiting for previous socket data)
      // https://github.com/nodejs/node-v0.x-archive/issues/6164
      // https://github.com/nodejs/node-v0.x-archive/commit/aef0960
      req.setHeader('content-length', 0);
    }

    req.end();

    function response(res) {
      var chunks = [];

      // Algolia answers should be gzip when asked for it,
      // but a proxy might uncompress Algolia response
      // So we handle both compressed and uncompressed
      if (res.headers['content-encoding'] === 'gzip' ||
          res.headers['content-encoding'] === 'deflate') {
        res = res.pipe(zlib.createUnzip());
      }

      res
        .on('data', onData)
        .once('end', onEnd);

      function onData(chunk) {
        chunks.push(chunk);
      }

      function onEnd() {
        clearTimeout(timeoutId);

        var data = Buffer.concat(chunks).toString();
        var out;

        try {
          out = {
            body: JSON.parse(data),
            statusCode: res.statusCode,
            headers: res.headers
          };
        } catch (e) {
          out = new errors.UnparsableJSON({
            more: data
          });
        }

        if (out instanceof errors.UnparsableJSON) {
          reject(out);
        } else {
          resolve(out);
        }
      }
    }

    function error(err) {
      opts.debug('error: %j  - %s', err, rawUrl);

      if (timedOut) {
        opts.debug('request had already timedout');
        return;
      }

      abort();
      clearTimeout(timeoutId);
      reject(new errors.Network(err.message, err));
    }

    function timeout() {
      timedOut = true;
      opts.debug('timeout %s', rawUrl);
      abort();
      reject(new errors.RequestTimeout());
    }

    function abort() {
      if (isNode010 && req.socket && req.socket.socket) {
        req.socket.socket.destroy();
      }

      req.abort();
    }
  });
};

AlgoliaSearchNodeJS.prototype._promise = {
  reject: function reject(val) {
    return Promise.reject(val);
  },
  resolve: function resolve(val) {
    return Promise.resolve(val);
  },
  delay: function delayPromise(ms) {
    return new Promise(function resolveOnTimeout(resolve/* , reject */) {
      setTimeout(resolve, ms);
    });
  }
};

AlgoliaSearchNodeJS.prototype.destroy = function destroy() {
  if (typeof this._Agent.destroy === 'function') {
    this._Agent.destroy();
  }
};

/*
 * Generate a secured and public API Key from an apiKey and queryParameters
 * optional user token identifying the current user
 *
 * @param apiKey - The api key to encode as secure
 * @param {Object} [queryParameters] - Any search query parameter
 */
AlgoliaSearchNodeJS.prototype.generateSecuredApiKey = function generateSecuredApiKey(privateApiKey, queryParametersOrTagFilters, userToken) {
  var searchParams;

  if (Array.isArray(queryParametersOrTagFilters)) {
    // generateSecuredApiKey(apiKey, ['user_42'], userToken);

    searchParams = {
      tagFilters: queryParametersOrTagFilters
    };

    if (userToken) {
      searchParams.userToken = userToken;
    }

    searchParams = this._getSearchParams(searchParams, '');
  } else if (typeof queryParametersOrTagFilters === 'string') {
    if (queryParametersOrTagFilters.indexOf('=') === -1) {
      // generateSecuredApiKey(apiKey, 'user_42', userToken);
      searchParams = 'tagFilters=' + queryParametersOrTagFilters;
    } else {
      // generateSecuredApiKey(apiKey, 'tagFilters=user_42', userToken);
      searchParams = queryParametersOrTagFilters;
    }


    if (userToken) {
      searchParams += '&userToken=' + encodeURIComponent(userToken);
    }
  } else {
    searchParams = this._getSearchParams(queryParametersOrTagFilters, '');
  }

  var securedKey = crypto
    .createHmac('sha256', privateApiKey)
    .update(searchParams)
    .digest('hex');

  return new Buffer(securedKey + searchParams).toString('base64');
};
