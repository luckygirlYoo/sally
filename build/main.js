require('source-map-support/register')
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 22);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _pino = __webpack_require__(33);

var _pino2 = _interopRequireDefault(_pino);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const l = (0, _pino2.default)({
  name: process.env.APP_ID,
  level: process.env.LOG_LEVEL
});

exports.default = l;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * memory.js: Simple memory storage engine for nconf configuration(s)
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var common = __webpack_require__(5);

//
// ### function Memory (options)
// #### @options {Object} Options for this instance
// Constructor function for the Memory nconf store which maintains
// a nested json structure based on key delimiters `:`.
//
// e.g. `my:nested:key` ==> `{ my: { nested: { key: } } }`
//
var Memory = exports.Memory = function (options) {
  options       = options || {};
  this.type     = 'memory';
  this.store    = {};
  this.mtimes   = {};
  this.readOnly = false;
  this.loadFrom = options.loadFrom || null;
  this.logicalSeparator = options.logicalSeparator || ':';
  this.parseValues = options.parseValues || false;

  if (this.loadFrom) {
    this.store = common.loadFilesSync(this.loadFrom);
  }
};

//
// ### function get (key)
// #### @key {string} Key to retrieve for this instance.
// Retrieves the value for the specified key (if any).
//
Memory.prototype.get = function (key) {
  var target = this.store,
      path   = common.path(key, this.logicalSeparator);

  //
  // Scope into the object to get the appropriate nested context
  //
  while (path.length > 0) {
    key = path.shift();
    if (target && target.hasOwnProperty(key)) {
      target = target[key];
      continue;
    }
    return undefined;
  }

  return target;
};

//
// ### function set (key, value)
// #### @key {string} Key to set in this instance
// #### @value {literal|Object} Value for the specified key
// Sets the `value` for the specified `key` in this instance.
//
Memory.prototype.set = function (key, value) {
  if (this.readOnly) {
    return false;
  }

  var target = this.store,
      path   = common.path(key, this.logicalSeparator);

  if (path.length === 0) {
    //
    // Root must be an object
    //
    if (!value || typeof value !== 'object') {
      return false;
    }
    else {
      this.reset();
      this.store = value;
      return true;
    }
  }

  //
  // Update the `mtime` (modified time) of the key
  //
  this.mtimes[key] = Date.now();

  //
  // Scope into the object to get the appropriate nested context
  //
  while (path.length > 1) {
    key = path.shift();
    if (!target[key] || typeof target[key] !== 'object') {
      target[key] = {};
    }

    target = target[key];
  }

  // Set the specified value in the nested JSON structure
  key = path.shift();
  if (this.parseValues) {
    value = common.parseValues.call(common, value);
  }
  target[key] = value;
  return true;
};

//
// ### function clear (key)
// #### @key {string} Key to remove from this instance
// Removes the value for the specified `key` from this instance.
//
Memory.prototype.clear = function (key) {
  if (this.readOnly) {
    return false;
  }

  var target = this.store,
      value  = target,
      path   = common.path(key, this.logicalSeparator);

  //
  // Remove the key from the set of `mtimes` (modified times)
  //
  delete this.mtimes[key];

  //
  // Scope into the object to get the appropriate nested context
  //
  for (var i = 0; i < path.length - 1; i++) {
    key = path[i];
    value = target[key];
    if (typeof value !== 'function' && typeof value !== 'object') {
      return false;
    }
    target = value;
  }

  // Delete the key from the nested JSON structure
  key = path[i];
  delete target[key];
  return true;
};

//
// ### function merge (key, value)
// #### @key {string} Key to merge the value into
// #### @value {literal|Object} Value to merge into the key
// Merges the properties in `value` into the existing object value
// at `key`. If the existing value `key` is not an Object, it will be
// completely overwritten.
//
Memory.prototype.merge = function (key, value) {
  if (this.readOnly) {
    return false;
  }

  //
  // If the key is not an `Object` or is an `Array`,
  // then simply set it. Merging is for Objects.
  //
  if (typeof value !== 'object' || Array.isArray(value) || value === null) {
    return this.set(key, value);
  }

  var self    = this,
      target  = this.store,
      path    = common.path(key, this.logicalSeparator),
      fullKey = key;

  //
  // Update the `mtime` (modified time) of the key
  //
  this.mtimes[key] = Date.now();

  //
  // Scope into the object to get the appropriate nested context
  //
  while (path.length > 1) {
    key = path.shift();
    if (!target[key]) {
      target[key] = {};
    }

    target = target[key];
  }

  // Set the specified value in the nested JSON structure
  key = path.shift();

  //
  // If the current value at the key target is not an `Object`,
  // or is an `Array` then simply override it because the new value
  // is an Object.
  //
  if (typeof target[key] !== 'object' || Array.isArray(target[key])) {
    target[key] = value;
    return true;
  }

  return Object.keys(value).every(function (nested) {
    return self.merge(common.keyed(self.logicalSeparator, fullKey, nested), value[nested]);
  });
};

//
// ### function reset (callback)
// Clears all keys associated with this instance.
//
Memory.prototype.reset = function () {
  if (this.readOnly) {
    return false;
  }

  this.mtimes = {};
  this.store  = {};
  return true;
};

//
// ### function loadSync
// Returns the store managed by this instance
//
Memory.prototype.loadSync = function () {
  return this.store || {};
};


/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * utils.js: Utility functions for the nconf module.
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var fs = __webpack_require__(4),
    async = __webpack_require__(14),
    formats = __webpack_require__(8),
    Memory = __webpack_require__(2).Memory;

var common = exports;

//
// ### function path (key)
// #### @key {string} The ':' delimited key to split
// Returns a fully-qualified path to a nested nconf key.
// If given null or undefined it should return an empty path.
// '' should still be respected as a path.
//
common.path = function (key, separator) {
  separator = separator || ':';
  return key == null ? [] : key.split(separator);
};

//
// ### function key (arguments)
// Returns a `:` joined string from the `arguments`.
//
common.key = function () {
  return Array.prototype.slice.call(arguments).join(':');
};

//
// ### function key (arguments)
// Returns a joined string from the `arguments`,
// first argument is the join delimiter.
//
common.keyed = function () {
  return Array.prototype.slice.call(arguments, 1).join(arguments[0]);
};

//
// ### function loadFiles (files, callback)
// #### @files {Object|Array} List of files (or settings object) to load.
// #### @callback {function} Continuation to respond to when complete.
// Loads all the data in the specified `files`.
//
common.loadFiles = function (files, callback) {
  if (!files) {
    return callback(null, {});
  }

  var options = Array.isArray(files) ? { files: files } : files;

  //
  // Set the default JSON format if not already
  // specified
  //
  options.format = options.format || formats.json;

  function parseFile (file, next) {
    fs.readFile(file, function (err, data) {
      return !err
        ? next(null, options.format.parse(data.toString()))
        : next(err);
    });
  }

  async.map(options.files, parseFile, function (err, objs) {
    return err ? callback(err) : callback(null, common.merge(objs));
  });
};

//
// ### function loadFilesSync (files)
// #### @files {Object|Array} List of files (or settings object) to load.
// Loads all the data in the specified `files` synchronously.
//
common.loadFilesSync = function (files) {
  if (!files) {
    return;
  }

  //
  // Set the default JSON format if not already
  // specified
  //
  var options = Array.isArray(files) ? { files: files } : files;
  options.format = options.format || formats.json;

  return common.merge(options.files.map(function (file) {
    return options.format.parse(fs.readFileSync(file, 'utf8'));
  }));
};

//
// ### function merge (objs)
// #### @objs {Array} Array of object literals to merge
// Merges the specified `objs` using a temporary instance
// of `stores.Memory`.
//
common.merge = function (objs) {
  var store = new Memory();

  objs.forEach(function (obj) {
    Object.keys(obj).forEach(function (key) {
      store.merge(key, obj[key]);
    });
  });

  return store.store;
};

//
// ### function capitalize (str)
// #### @str {string} String to capitalize
// Capitalizes the specified `str`.
//
common.capitalize = function (str) {
  return str && str[0].toUpperCase() + str.slice(1);
};

//
// ### function parseValues (any)
// #### @any {string} String to parse as native data-type or return as is
// try to parse `any` as a native data-type
//
common.parseValues = function (value) {
  var val = value;
  
  try {
    val = JSON.parse(value);
  } catch (ignore) {
    // Check for any other well-known strings that should be "parsed"
    if (value === 'undefined'){
      val = void 0;
    }
  }

  return val;
};

//
// ### function transform(map, fn)
// #### @map {object} Object of key/value pairs to apply `fn` to
// #### @fn {function} Transformation function that will be applied to every key/value pair
// transform a set of key/value pairs and return the transformed result
common.transform = function(map, fn) {
  var pairs = Object.keys(map).map(function(key) {
    var obj = { key: key, value: map[key]};
    var result = fn.call(null, obj);

    if (!result) {
      return null;
    } else if (result.key) {
      return result;
    }

    var error = new Error('Transform function passed to store returned an invalid format: ' + JSON.stringify(result));
    error.name = 'RuntimeError';
    throw error;
  });


  return pairs
    .filter(function(pair) {
      return pair !== null;
    })
    .reduce(function(accumulator, pair) {
      accumulator[pair.key] = pair.value;
      return accumulator;
    }, {});
}


/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * nconf.js: Top-level include for the nconf module
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var common = __webpack_require__(5),
    Provider = __webpack_require__(37).Provider;

//
// `nconf` is by default an instance of `nconf.Provider`.
//
var nconf = module.exports = new Provider();

//
// Expose the version from the package.json
//
nconf.version = __webpack_require__(38).version;

//
// Setup all stores as lazy-loaded getters.
//
['argv', 'env', 'file', 'literal', 'memory'].forEach(function (store) {
    var name = common.capitalize(store);

    nconf.__defineGetter__(name, function () {
        return __webpack_require__(39)("./" + store)[name];
    });
});

//
// Expose the various components included with nconf
//
nconf.key           = common.key;
nconf.path          = common.path;
nconf.loadFiles     = common.loadFiles;
nconf.loadFilesSync = common.loadFilesSync;
nconf.formats       = __webpack_require__(8);
nconf.Provider      = Provider;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * formats.js: Default formats supported by nconf
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var ini = __webpack_require__(36);

var formats = exports;

//
// ### @json
// Standard JSON format which pretty prints `.stringify()`.
//
formats.json = {
  stringify: function (obj, replacer, spacing) {
    return JSON.stringify(obj, replacer || null, spacing || 2)
  },
  parse: JSON.parse
};

//
// ### @ini
// Standard INI format supplied from the `ini` module
// http://en.wikipedia.org/wiki/INI_file
//
formats.ini = ini;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var stripAnsi = __webpack_require__(10);
var codePointAt = __webpack_require__(49);
var isFullwidthCodePoint = __webpack_require__(50);

// https://github.com/nodejs/io.js/blob/cff7300a578be1b10001f2d967aaedc88aee6402/lib/readline.js#L1345
module.exports = function (str) {
	if (typeof str !== 'string' || str.length === 0) {
		return 0;
	}

	var width = 0;

	str = stripAnsi(str);

	for (var i = 0; i < str.length; i++) {
		var code = codePointAt(str, i);

		// ignore control characters
		if (code <= 0x1f || (code >= 0x7f && code <= 0x9f)) {
			continue;
		}

		// surrogates
		if (code >= 0x10000) {
			i++;
		}

		if (isFullwidthCodePoint(code)) {
			width += 2;
		} else {
			width++;
		}
	}

	return width;
};


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(48)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const path = __webpack_require__(0);
const fs = __webpack_require__(13);

const CopService = __webpack_require__(64);
const User = __webpack_require__(65);

const tlsOptions = {
  trustedRoots: [],
  verify: false
};

function register(caUrl, caName, registrar, userName, affiliation, role, enrollmentSecret) {
  // enrollmentID, enrollmentSecret, role, affiliation, maxEnrollments, attr
  //   log.debug(`register() => ${userName}`);

  const cop = new CopService(caUrl, tlsOptions, caName);

  return cop.register({
    enrollmentID: userName,
    enrollmentSecret: enrollmentSecret || undefined,
    role: role || 'client',
    affiliation: affiliation || 'org1.department1'
  }, registrar);
}
module.exports.register = register;

function enroll(client, caUrl, caName, userName, password, mspId) {
  _logger2.default.debug(`enroll() => ${userName}`);

  const member = new User(userName);

  const cryptoSuite = client.getCryptoSuite();
  member.setCryptoSuite(cryptoSuite);

  const cop = new CopService(caUrl, tlsOptions, caName, cryptoSuite);

  return cop.enroll({
    enrollmentID: userName,
    enrollmentSecret: password
  }).then(enrollment => {
    _logger2.default.info(`Successfully enrolled user '${userName}'`);
    return member.setEnrollment(enrollment.key, enrollment.certificate, mspId);
  }).then(() => client.setUserContext(member, false)).catch(err => {
    _logger2.default.error(`Failed to enroll and persist user. Error: ${err.stack ? err.stack : err}`);
    return Promise.reject(err);
  });
}
module.exports.enroll = enroll;

function getCurrentContextMember(client) {
  const currentContextMember = client.getUserContext();
  if (currentContextMember) {
    return currentContextMember;
  }
  throw new Error('현재 Client Context에 지정된 Member가 없습니다.');
}
module.exports.getCurrentContextMember = getCurrentContextMember;

function getMember(client, userName) {
  _logger2.default.debug(`getMember() => ${userName}`);

  if (!client) return Promise.reject(new Error('해당 명령을 처리할 클라이언트 멤버가 존재하지 않습니다.'));

  return client.getUserContext(userName, true).then(user => new Promise((resolve, reject) => {
    if (user && user.isEnrolled()) {
      // log.info('Successfully loaded member from persistence');
      resolve(user);
    } else {
      reject('Failed to get Member');
    }
  }));
}
module.exports.getMember = getMember;

function createMember(client, params) {
  return client.getUserContext(params.memberId, true).then(user => new Promise((resolve, reject) => {
    if (user && user.isEnrolled()) {
      _logger2.default.info('Successfully loaded member from persistence');
      return resolve(user);
    }
    const keyPath = path.join(params.adminKeyPath);
    const keyPEM = Buffer.from(readAllFiles(`server/blockchain/${keyPath}`)[0]).toString();
    const certPath = path.join(params.adminCertPath);
    const certPEM = readAllFiles(`server/blockchain/${certPath}`)[0];

    return resolve(client.createUser({
      username: params.memberId,
      mspid: params.mspId,
      cryptoContent: {
        privateKeyPEM: keyPEM.toString(),
        signedCertPEM: certPEM.toString()
      }
    }));
  })).catch(err => Promise.reject(new Error(`Failed to create member form cert : ${err}`)));
}
module.exports.createMember = createMember;

function readAllFiles(dir) {
  const files = fs.readdirSync(dir);
  const certs = [];
  files.forEach(file_name => {
    const file_path = path.join(dir, file_name);
    // log.debug(` looking at file ::${file_path}`);
    const data = fs.readFileSync(file_path);
    certs.push(data);
  });
  return certs;
}

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const HFC = __webpack_require__(34); /* eslint-disable prefer-destructuring */

const fs = __webpack_require__(4);
const path = __webpack_require__(0);
const env = __webpack_require__(35);

const member = __webpack_require__(11);
const channel = __webpack_require__(21);
const transaction = __webpack_require__(67);

class BcClient {
  constructor() {
    // HFC
    this._hfc = null;

    // Connected Peers
    this._connectedPeers = null;
    this._eventPeers = null;

    // Loaded Config Files
    this._clientConfig = null;
    this._channelConfig = null;

    // Client Setting
    this._clientOrgId = null;
    this._channelConfigDirPath = null;
  }

  channelSetUp(chConfigDirPath) {
    try {
      this._hfc = new HFC();

      /* eslint-disable global-require */
      /*
      * 각 ORG 별 Admin Certification
      * crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore
      * crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts
      */
      this._clientConfig = __webpack_require__(68);

      /*
       * Hyperledger Fabric Network Topology
       */
      this._channelConfig = __webpack_require__(69);
      /* eslint-enable global-require */

      this._channelConfigDirPath = chConfigDirPath;

      // Client type 설정 (Admin, User)
      this._isAdmin = this._clientConfig.default.adminClient;

      // 타임아웃 설정
      HFC.setConfigSetting('request-timeout', 180000);
    } catch (err) {
      return Promise.reject(new Error(`설정 파일 로드 오류 : ${err.stack ? err.stack : err}`));
    }

    return this.setChannelNetwork(this._hfc).then(() => this.setClientOrg(this._clientConfig.default.org)).then(() => this.setClientType()).then(() => this.setConnectedPeers()).then(() => this.setClientMember(this._clientConfig.default.member)).catch(err => Promise.reject(err));
  }

  setChannelNetwork(hfc) {
    try {
      const mychannel = hfc.newChannel(this._channelConfig.channelName);
      const orderers = this._channelConfig.orderer;

      for (const ordererId in orderers) {
        const pemData = fs.readFileSync(`server/blockchain/${path.join(this._channelConfigDirPath, orderers[ordererId].tls_cacerts)}`);
        const opts = {
          pem: Buffer.from(pemData).toString(),
          'ssl-target-name-override': orderers[ordererId]['server-hostname']
        };

        const orderer = hfc.newOrderer(orderers[ordererId].url, opts);
        mychannel.addOrderer(orderer);

        _logger2.default.info(`chain addOrderer : ${ordererId} - ${orderers[ordererId].mspid} added`);
      }

      const orgs = this._channelConfig.orgs;
      for (const orgId in orgs) {
        if (orgs.hasOwnProperty(orgId)) {
          _logger2.default.info(`chain addPeer : ${orgId} - ${orgs[orgId].name} added`);
          const peers = orgs[orgId].peers;
          for (const peerId in peers) {
            if (peers.hasOwnProperty(peerId)) {
              const pemData = fs.readFileSync(`server/blockchain/${path.join(this._channelConfigDirPath, peers[peerId].tls_cacerts)}`);
              const opts = {
                pem: Buffer.from(pemData).toString(),
                'ssl-target-name-override': peers[peerId]['server-hostname']
              };
              const peer = hfc.newPeer(peers[peerId].requests, opts);
              _logger2.default.info(`${'chain addPeer : ' + '  '}${peer} added`);
              mychannel.addPeer(peer);
            }
          }
        }
      }
      return Promise.resolve(hfc);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  setClientOrg(orgId, hfc) {
    if (!this._channelConfig.orgs[orgId]) return Promise.reject(new Error(`Channel Client Org가 존재하지 않습니다. clientOrgId: ${orgId}`));

    if (!hfc) {
      hfc = this._hfc;
      this._clientOrgId = orgId;
    }
    const orgName = this._channelConfig.orgs[orgId].name;

    return HFC.newDefaultKeyValueStore({
      path: env.getKeyValStorePathForOrg(this._channelConfigDirPath, orgName)
    }).then(store => {
      _logger2.default.info(`keyValStore Path : ${store._dir}`);
      hfc.setStateStore(store);
      return HFC.newCryptoKeyStore({
        path: env.getCryptoKeyStorePathForOrg(this._channelConfigDirPath, orgName)
      });
    }).then(cryptoKeyStore => {
      const cryptoSuite = HFC.newCryptoSuite();
      cryptoSuite.setCryptoKeyStore(cryptoKeyStore);
      hfc.setCryptoSuite(cryptoSuite);
      return Promise.resolve();
    });
  }

  setClientType() {
    if (this._isAdmin) {
      return this.createMemberFromCert(this._clientConfig.adminCertPath ? this._clientConfig.adminCertPath[this._clientOrgId] : undefined, this._channelConfig.orgs[this._clientOrgId].mspid).catch(err => Promise.reject(new Error(`Admin Mode인 경우 지정된 Org에 대한 Admin 계정이 등록되어야 합니다 - ${err}`))).then(() => this.devCreateOtherOrgAdmins()).then(() => this.devCreatePreDefinedRegistrarMembers());
    }
    return Promise.resolve();
  }

  createMemberFromCert(memberInfo, mspId, client) {
    try {
      if (!memberInfo) throw new Error('해당 멤버에 대한 계정정보(인증서, 키)가 존재하지 않습니다.');
      const params = {
        memberId: memberInfo.member,
        adminKeyPath: path.join(this._channelConfigDirPath, memberInfo.key),
        adminCertPath: path.join(this._channelConfigDirPath, memberInfo.cert),
        mspId
      };
      if (!client) client = this._hfc;
      return member.createMember(client, params);
    } catch (err) {
      return Promise.reject(new Error(`Failed to create member form cert : ${err}`));
    }
  }

  // only in dev mode
  devCreateOtherOrgAdmins() {
    this.devOtherAdminClients = {};
    const adminCertPath = this._clientConfig.adminCertPath;

    if (adminCertPath && Object.keys(adminCertPath).length > 0) {
      return this.devCreateNextAdminMember(0, adminCertPath).catch(err => {
        _logger2.default.info(`다른 Admin Member 등록 중 오류가 발생하였습니다. ${err}`);
      });
    }
    return Promise.resolve('Admin Member 정보가 없습니다.');
  }

  // only in dev mode
  devCreateNextAdminMember(idx, list) {
    if (idx > Object.keys(list).length - 1) {
      return Promise.resolve();
    }
    const orgId = Object.keys(list)[idx];

    if (orgId == this._clientOrgId) {
      return this.devCreateNextAdminMember(idx + 1, list);
    }

    const otherAdminClient = new HFC();

    return this.setChannelNetwork(otherAdminClient).then(() => this.setClientOrg(orgId, otherAdminClient)).then(() => {
      _logger2.default.debug(`mspid : ${this._channelConfig.orgs[orgId].mspid}`);
      return this.createMemberFromCert(list[orgId], this._channelConfig.orgs[orgId].mspid, otherAdminClient);
    }).then(() => {
      this.devOtherAdminClients[orgId] = otherAdminClient;
      return this.devCreateNextAdminMember(idx + 1, list);
    });
  }

  // only in dev mode
  devCreatePreDefinedRegistrarMembers() {
    this.devRegistrarClients = {};
    const registrarList = this._clientConfig.registrar;

    if (registrarList && Object.keys(registrarList).length > 0) {
      return this.devCreateNextRegistrarMember(0, registrarList).catch(err => {
        _logger2.default.info(`registrar 등록 중 오류가 발생하였습니다. ${err}`);
      });
    }
    return Promise.resolve('registrar 정보가 없습니다.');
  }

  // only in dev mode
  devCreateNextRegistrarMember(idx, list) {
    if (idx > Object.keys(list).length - 1) {
      return Promise.resolve();
    }
    const orgId = Object.keys(list)[idx];

    const client = new HFC();
    const ca = this._channelConfig.orgs[orgId].ca;
    const mspId = this._channelConfig.orgs[orgId].mspid;

    return this.setClientOrg(orgId, client).then(() => member.enroll(client, ca.url, ca.name, list[orgId].name, list[orgId].password, mspId)).then(user => {
      _logger2.default.info(`${orgId} registrar '${user.getName()}' 등록 완료.`);
      this.devRegistrarClients[orgId] = client;
      return this.devCreateNextRegistrarMember(idx + 1, list);
    });
  }

  getTargetPeers(targetPeers) {
    let targets = [];

    if (targetPeers) {
      for (const orgId in targetPeers) {
        const peerList = this._connectedPeers[orgId];
        for (const idx in targetPeers[orgId]) {
          targets.push(peerList[targetPeers[orgId][idx]]);
        }
      }
    } else {
      targets = targetPeers;
    }

    return targets;
  }

  eventPeerDisconnection() {
    if (this._eventPeers) {
      this._eventPeers.forEach(eh => {
        if (eh.isconnected()) eh.disconnect();
      });
    }
    this._eventPeers = [];
  }

  setConnectedPeers() {
    try {
      this._connectedPeers = {};

      const orgs = this._channelConfig.orgs;
      for (const orgId in orgs) {
        const targets = {};
        const peers = orgs[orgId].peers;
        for (const peerId in peers) {
          const pemData = fs.readFileSync(`server/blockchain/${path.join(this._channelConfigDirPath, peers[peerId].tls_cacerts)}`);
          const opts = {
            pem: Buffer.from(pemData).toString(),
            'ssl-target-name-override': peers[peerId]['server-hostname']
          };
          const peer = this._hfc.newPeer(peers[peerId].requests, opts);
          targets[peerId] = peer;
        }
        if (targets) {
          this._connectedPeers[orgId] = targets;
        }
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  setEventPeer() {
    try {
      this.eventPeerDisconnection();

      const peers = this._channelConfig.orgs[this._clientOrgId].peers;
      for (const peerId in peers) {
        const pemData = fs.readFileSync(`server/blockchain/${path.join(this._channelConfigDirPath, peers[peerId].tls_cacerts)}`);
        const opts = {
          pem: Buffer.from(pemData).toString(),
          'ssl-target-name-override': peers[peerId]['server-hostname']
        };

        const eh = this._hfc.newEventHub();
        eh.setPeerAddr(peers[peerId].events, opts);
        eh.connect();
        eh.peerId = peerId;
        this._eventPeers.push(eh);
      }
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  loadChannelConfig() {
    const channelName = this._channelConfig.channelName;
    return channel.loadChannelConfig(this._hfc.getChannel(channelName)).then(result => {
      const curOrderer = this._hfc.getChannel(channelName).getOrderers()[0];
      this.devSetNewOrdererToAllOtherAdminClients(curOrderer, channelName);
      return Promise.resolve(result);
    });
  }

  devSetNewOrdererToAllOtherAdminClients(curOrderer, channelName) {
    for (const orgId in this._devOtherAdminClients) {
      const ch = this._devOtherAdminClients[orgId].getChannel(channelName);
      const orderers = ch.getOrderers();
      for (let i = 0; i < orderers.length; i++) {
        if (orderers[0].getUrl() === curOrderer.getUrl()) {
          if (i > 0) {
            log.info(`${orgId}의 Admin 클라이언트의 디폴트 orderer를 ${curOrderer.getUrl()}으로 변경합니다.`);
          }
          break;
        } else {
          orderers.push(orderers.shift());
        }
      }
    }
  }

  setClientMember(name, fabricClient) {
    const client = fabricClient || this._hfc;
    return member.getMember(client, name).then(user => {
      _logger2.default.info('====================================================');
      _logger2.default.info(`${user.getName()} 멤버를 Client Context에 설정하였습니다.`);
      _logger2.default.info('====================================================');

      if (fabricClient) {
        return Promise.resolve();
      }
      return this.setEventPeer().then(() => this.loadChannelConfig().catch(err => {
        _logger2.default.error(`${err} Channel Config Load 실패! Load Channel Config를 다시 실행해야 합니다.`);
      }));
    }).catch(err => {
      if (this._eventPeers) {
        this._eventPeers.forEach(eh => {
          if (eh.isconnected()) eh.disconnect();
        });
      }
      this._eventPeers = [];
      this._hfc._userContext = null;
      _logger2.default.error(err);
      return Promise.reject(err);
    });
  }

  queryChaincode(id, fcn, args, targetPeers) {
    const channelName = this._channelConfig.channelName;
    const req = {
      chaincodeId: id,
      fcn,
      args
    };
    return transaction.queryChaincode(this._hfc, channelName, req, this.getTargetPeers(targetPeers));
  }

  invokeChaincode(id, fcn, args, targetPeers) {
    const channelName = this._channelConfig.channelName;
    const req = {
      chaincodeId: id,
      fcn,
      args
    };
    return transaction.invokeChaincode(this._hfc, channelName, req, this.getTargetPeers(targetPeers), this._eventPeers);
  }
}

const bcClient = new BcClient();
module.exports = bcClient;

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("fs-extra");

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
(function () {

    var async = {};
    function noop() {}
    function identity(v) {
        return v;
    }
    function toBool(v) {
        return !!v;
    }
    function notId(v) {
        return !v;
    }

    // global on the server, window in the browser
    var previous_async;

    // Establish the root object, `window` (`self`) in the browser, `global`
    // on the server, or `this` in some virtual machines. We use `self`
    // instead of `window` for `WebWorker` support.
    var root = typeof self === 'object' && self.self === self && self ||
            typeof global === 'object' && global.global === global && global ||
            this;

    if (root != null) {
        previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        return function() {
            if (fn === null) throw new Error("Callback was already called.");
            fn.apply(this, arguments);
            fn = null;
        };
    }

    function _once(fn) {
        return function() {
            if (fn === null) return;
            fn.apply(this, arguments);
            fn = null;
        };
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    // Ported from underscore.js isObject
    var _isObject = function(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function _isArrayLike(arr) {
        return _isArray(arr) || (
            // has a positive integer length property
            typeof arr.length === "number" &&
            arr.length >= 0 &&
            arr.length % 1 === 0
        );
    }

    function _arrayEach(arr, iterator) {
        var index = -1,
            length = arr.length;

        while (++index < length) {
            iterator(arr[index], index, arr);
        }
    }

    function _map(arr, iterator) {
        var index = -1,
            length = arr.length,
            result = Array(length);

        while (++index < length) {
            result[index] = iterator(arr[index], index, arr);
        }
        return result;
    }

    function _range(count) {
        return _map(Array(count), function (v, i) { return i; });
    }

    function _reduce(arr, iterator, memo) {
        _arrayEach(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    }

    function _forEachOf(object, iterator) {
        _arrayEach(_keys(object), function (key) {
            iterator(object[key], key);
        });
    }

    function _indexOf(arr, item) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i] === item) return i;
        }
        return -1;
    }

    var _keys = Object.keys || function (obj) {
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    function _keyIterator(coll) {
        var i = -1;
        var len;
        var keys;
        if (_isArrayLike(coll)) {
            len = coll.length;
            return function next() {
                i++;
                return i < len ? i : null;
            };
        } else {
            keys = _keys(coll);
            len = keys.length;
            return function next() {
                i++;
                return i < len ? keys[i] : null;
            };
        }
    }

    // Similar to ES6's rest param (http://ariya.ofilabs.com/2013/03/es6-and-rest-parameter.html)
    // This accumulates the arguments passed into an array, after a given index.
    // From underscore.js (https://github.com/jashkenas/underscore/pull/2140).
    function _restParam(func, startIndex) {
        startIndex = startIndex == null ? func.length - 1 : +startIndex;
        return function() {
            var length = Math.max(arguments.length - startIndex, 0);
            var rest = Array(length);
            for (var index = 0; index < length; index++) {
                rest[index] = arguments[index + startIndex];
            }
            switch (startIndex) {
                case 0: return func.call(this, rest);
                case 1: return func.call(this, arguments[0], rest);
            }
            // Currently unused but handle cases outside of the switch statement:
            // var args = Array(startIndex + 1);
            // for (index = 0; index < startIndex; index++) {
            //     args[index] = arguments[index];
            // }
            // args[startIndex] = rest;
            // return func.apply(this, args);
        };
    }

    function _withoutIndex(iterator) {
        return function (value, index, callback) {
            return iterator(value, callback);
        };
    }

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////

    // capture the global reference to guard against fakeTimer mocks
    var _setImmediate = typeof setImmediate === 'function' && setImmediate;

    var _delay = _setImmediate ? function(fn) {
        // not a direct alias for IE10 compatibility
        _setImmediate(fn);
    } : function(fn) {
        setTimeout(fn, 0);
    };

    if (typeof process === 'object' && typeof process.nextTick === 'function') {
        async.nextTick = process.nextTick;
    } else {
        async.nextTick = _delay;
    }
    async.setImmediate = _setImmediate ? _delay : async.nextTick;


    async.forEach =
    async.each = function (arr, iterator, callback) {
        return async.eachOf(arr, _withoutIndex(iterator), callback);
    };

    async.forEachSeries =
    async.eachSeries = function (arr, iterator, callback) {
        return async.eachOfSeries(arr, _withoutIndex(iterator), callback);
    };


    async.forEachLimit =
    async.eachLimit = function (arr, limit, iterator, callback) {
        return _eachOfLimit(limit)(arr, _withoutIndex(iterator), callback);
    };

    async.forEachOf =
    async.eachOf = function (object, iterator, callback) {
        callback = _once(callback || noop);
        object = object || [];

        var iter = _keyIterator(object);
        var key, completed = 0;

        while ((key = iter()) != null) {
            completed += 1;
            iterator(object[key], key, only_once(done));
        }

        if (completed === 0) callback(null);

        function done(err) {
            completed--;
            if (err) {
                callback(err);
            }
            // Check key is null in case iterator isn't exhausted
            // and done resolved synchronously.
            else if (key === null && completed <= 0) {
                callback(null);
            }
        }
    };

    async.forEachOfSeries =
    async.eachOfSeries = function (obj, iterator, callback) {
        callback = _once(callback || noop);
        obj = obj || [];
        var nextKey = _keyIterator(obj);
        var key = nextKey();
        function iterate() {
            var sync = true;
            if (key === null) {
                return callback(null);
            }
            iterator(obj[key], key, only_once(function (err) {
                if (err) {
                    callback(err);
                }
                else {
                    key = nextKey();
                    if (key === null) {
                        return callback(null);
                    } else {
                        if (sync) {
                            async.setImmediate(iterate);
                        } else {
                            iterate();
                        }
                    }
                }
            }));
            sync = false;
        }
        iterate();
    };



    async.forEachOfLimit =
    async.eachOfLimit = function (obj, limit, iterator, callback) {
        _eachOfLimit(limit)(obj, iterator, callback);
    };

    function _eachOfLimit(limit) {

        return function (obj, iterator, callback) {
            callback = _once(callback || noop);
            obj = obj || [];
            var nextKey = _keyIterator(obj);
            if (limit <= 0) {
                return callback(null);
            }
            var done = false;
            var running = 0;
            var errored = false;

            (function replenish () {
                if (done && running <= 0) {
                    return callback(null);
                }

                while (running < limit && !errored) {
                    var key = nextKey();
                    if (key === null) {
                        done = true;
                        if (running <= 0) {
                            callback(null);
                        }
                        return;
                    }
                    running += 1;
                    iterator(obj[key], key, only_once(function (err) {
                        running -= 1;
                        if (err) {
                            callback(err);
                            errored = true;
                        }
                        else {
                            replenish();
                        }
                    }));
                }
            })();
        };
    }


    function doParallel(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOf, obj, iterator, callback);
        };
    }
    function doParallelLimit(fn) {
        return function (obj, limit, iterator, callback) {
            return fn(_eachOfLimit(limit), obj, iterator, callback);
        };
    }
    function doSeries(fn) {
        return function (obj, iterator, callback) {
            return fn(async.eachOfSeries, obj, iterator, callback);
        };
    }

    function _asyncMap(eachfn, arr, iterator, callback) {
        callback = _once(callback || noop);
        arr = arr || [];
        var results = _isArrayLike(arr) ? [] : {};
        eachfn(arr, function (value, index, callback) {
            iterator(value, function (err, v) {
                results[index] = v;
                callback(err);
            });
        }, function (err) {
            callback(err, results);
        });
    }

    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = doParallelLimit(_asyncMap);

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.inject =
    async.foldl =
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachOfSeries(arr, function (x, i, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };

    async.foldr =
    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, identity).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };

    async.transform = function (arr, memo, iterator, callback) {
        if (arguments.length === 3) {
            callback = iterator;
            iterator = memo;
            memo = _isArray(arr) ? [] : {};
        }

        async.eachOf(arr, function(v, k, cb) {
            iterator(memo, v, k, cb);
        }, function(err) {
            callback(err, memo);
        });
    };

    function _filter(eachfn, arr, iterator, callback) {
        var results = [];
        eachfn(arr, function (x, index, callback) {
            iterator(x, function (v) {
                if (v) {
                    results.push({index: index, value: x});
                }
                callback();
            });
        }, function () {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    }

    async.select =
    async.filter = doParallel(_filter);

    async.selectLimit =
    async.filterLimit = doParallelLimit(_filter);

    async.selectSeries =
    async.filterSeries = doSeries(_filter);

    function _reject(eachfn, arr, iterator, callback) {
        _filter(eachfn, arr, function(value, cb) {
            iterator(value, function(v) {
                cb(!v);
            });
        }, callback);
    }
    async.reject = doParallel(_reject);
    async.rejectLimit = doParallelLimit(_reject);
    async.rejectSeries = doSeries(_reject);

    function _createTester(eachfn, check, getResult) {
        return function(arr, limit, iterator, cb) {
            function done() {
                if (cb) cb(getResult(false, void 0));
            }
            function iteratee(x, _, callback) {
                if (!cb) return callback();
                iterator(x, function (v) {
                    if (cb && check(v)) {
                        cb(getResult(true, x));
                        cb = iterator = false;
                    }
                    callback();
                });
            }
            if (arguments.length > 3) {
                eachfn(arr, limit, iteratee, done);
            } else {
                cb = iterator;
                iterator = limit;
                eachfn(arr, iteratee, done);
            }
        };
    }

    async.any =
    async.some = _createTester(async.eachOf, toBool, identity);

    async.someLimit = _createTester(async.eachOfLimit, toBool, identity);

    async.all =
    async.every = _createTester(async.eachOf, notId, notId);

    async.everyLimit = _createTester(async.eachOfLimit, notId, notId);

    function _findGetResult(v, x) {
        return x;
    }
    async.detect = _createTester(async.eachOf, identity, _findGetResult);
    async.detectSeries = _createTester(async.eachOfSeries, identity, _findGetResult);
    async.detectLimit = _createTester(async.eachOfLimit, identity, _findGetResult);

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                callback(null, _map(results.sort(comparator), function (x) {
                    return x.value;
                }));
            }

        });

        function comparator(left, right) {
            var a = left.criteria, b = right.criteria;
            return a < b ? -1 : a > b ? 1 : 0;
        }
    };

    async.auto = function (tasks, concurrency, callback) {
        if (typeof arguments[1] === 'function') {
            // concurrency is optional, shift the args.
            callback = concurrency;
            concurrency = null;
        }
        callback = _once(callback || noop);
        var keys = _keys(tasks);
        var remainingTasks = keys.length;
        if (!remainingTasks) {
            return callback(null);
        }
        if (!concurrency) {
            concurrency = remainingTasks;
        }

        var results = {};
        var runningTasks = 0;

        var hasError = false;

        var listeners = [];
        function addListener(fn) {
            listeners.unshift(fn);
        }
        function removeListener(fn) {
            var idx = _indexOf(listeners, fn);
            if (idx >= 0) listeners.splice(idx, 1);
        }
        function taskComplete() {
            remainingTasks--;
            _arrayEach(listeners.slice(0), function (fn) {
                fn();
            });
        }

        addListener(function () {
            if (!remainingTasks) {
                callback(null, results);
            }
        });

        _arrayEach(keys, function (k) {
            if (hasError) return;
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = _restParam(function(err, args) {
                runningTasks--;
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _forEachOf(results, function(val, rkey) {
                        safeResults[rkey] = val;
                    });
                    safeResults[k] = args;
                    hasError = true;

                    callback(err, safeResults);
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            });
            var requires = task.slice(0, task.length - 1);
            // prevent dead-locks
            var len = requires.length;
            var dep;
            while (len--) {
                if (!(dep = tasks[requires[len]])) {
                    throw new Error('Has nonexistent dependency in ' + requires.join(', '));
                }
                if (_isArray(dep) && _indexOf(dep, k) >= 0) {
                    throw new Error('Has cyclic dependencies');
                }
            }
            function ready() {
                return runningTasks < concurrency && _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            }
            if (ready()) {
                runningTasks++;
                task[task.length - 1](taskCallback, results);
            }
            else {
                addListener(listener);
            }
            function listener() {
                if (ready()) {
                    runningTasks++;
                    removeListener(listener);
                    task[task.length - 1](taskCallback, results);
                }
            }
        });
    };



    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var DEFAULT_INTERVAL = 0;

        var attempts = [];

        var opts = {
            times: DEFAULT_TIMES,
            interval: DEFAULT_INTERVAL
        };

        function parseTimes(acc, t){
            if(typeof t === 'number'){
                acc.times = parseInt(t, 10) || DEFAULT_TIMES;
            } else if(typeof t === 'object'){
                acc.times = parseInt(t.times, 10) || DEFAULT_TIMES;
                acc.interval = parseInt(t.interval, 10) || DEFAULT_INTERVAL;
            } else {
                throw new Error('Unsupported argument type for \'times\': ' + typeof t);
            }
        }

        var length = arguments.length;
        if (length < 1 || length > 3) {
            throw new Error('Invalid arguments - must be either (task), (task, callback), (times, task) or (times, task, callback)');
        } else if (length <= 2 && typeof times === 'function') {
            callback = task;
            task = times;
        }
        if (typeof times !== 'function') {
            parseTimes(opts, times);
        }
        opts.callback = callback;
        opts.task = task;

        function wrappedTask(wrappedCallback, wrappedResults) {
            function retryAttempt(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            }

            function retryInterval(interval){
                return function(seriesCallback){
                    setTimeout(function(){
                        seriesCallback(null);
                    }, interval);
                };
            }

            while (opts.times) {

                var finalAttempt = !(opts.times-=1);
                attempts.push(retryAttempt(opts.task, finalAttempt));
                if(!finalAttempt && opts.interval > 0){
                    attempts.push(retryInterval(opts.interval));
                }
            }

            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || opts.callback)(data.err, data.result);
            });
        }

        // If a callback is passed, run this as a controll flow
        return opts.callback ? wrappedTask() : wrappedTask;
    };

    async.waterfall = function (tasks, callback) {
        callback = _once(callback || noop);
        if (!_isArray(tasks)) {
            var err = new Error('First argument to waterfall must be an array of functions');
            return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        function wrapIterator(iterator) {
            return _restParam(function (err, args) {
                if (err) {
                    callback.apply(null, [err].concat(args));
                }
                else {
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    ensureAsync(iterator).apply(null, args);
                }
            });
        }
        wrapIterator(async.iterator(tasks))();
    };

    function _parallel(eachfn, tasks, callback) {
        callback = callback || noop;
        var results = _isArrayLike(tasks) ? [] : {};

        eachfn(tasks, function (task, key, callback) {
            task(_restParam(function (err, args) {
                if (args.length <= 1) {
                    args = args[0];
                }
                results[key] = args;
                callback(err);
            }));
        }, function (err) {
            callback(err, results);
        });
    }

    async.parallel = function (tasks, callback) {
        _parallel(async.eachOf, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel(_eachOfLimit(limit), tasks, callback);
    };

    async.series = function(tasks, callback) {
        _parallel(async.eachOfSeries, tasks, callback);
    };

    async.iterator = function (tasks) {
        function makeCallback(index) {
            function fn() {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            }
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        }
        return makeCallback(0);
    };

    async.apply = _restParam(function (fn, args) {
        return _restParam(function (callArgs) {
            return fn.apply(
                null, args.concat(callArgs)
            );
        });
    });

    function _concat(eachfn, arr, fn, callback) {
        var result = [];
        eachfn(arr, function (x, index, cb) {
            fn(x, function (err, y) {
                result = result.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, result);
        });
    }
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        callback = callback || noop;
        if (test()) {
            var next = _restParam(function(err, args) {
                if (err) {
                    callback(err);
                } else if (test.apply(this, args)) {
                    iterator(next);
                } else {
                    callback.apply(null, [null].concat(args));
                }
            });
            iterator(next);
        } else {
            callback(null);
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        var calls = 0;
        return async.whilst(function() {
            return ++calls <= 1 || test.apply(this, arguments);
        }, iterator, callback);
    };

    async.until = function (test, iterator, callback) {
        return async.whilst(function() {
            return !test.apply(this, arguments);
        }, iterator, callback);
    };

    async.doUntil = function (iterator, test, callback) {
        return async.doWhilst(iterator, function() {
            return !test.apply(this, arguments);
        }, callback);
    };

    async.during = function (test, iterator, callback) {
        callback = callback || noop;

        var next = _restParam(function(err, args) {
            if (err) {
                callback(err);
            } else {
                args.push(check);
                test.apply(this, args);
            }
        });

        var check = function(err, truth) {
            if (err) {
                callback(err);
            } else if (truth) {
                iterator(next);
            } else {
                callback(null);
            }
        };

        test(check);
    };

    async.doDuring = function (iterator, test, callback) {
        var calls = 0;
        async.during(function(next) {
            if (calls++ < 1) {
                next(null, true);
            } else {
                test.apply(this, arguments);
            }
        }, iterator, callback);
    };

    function _queue(worker, concurrency, payload) {
        if (concurrency == null) {
            concurrency = 1;
        }
        else if(concurrency === 0) {
            throw new Error('Concurrency must not be zero');
        }
        function _insert(q, data, pos, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0 && q.idle()) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    callback: callback || noop
                };

                if (pos) {
                    q.tasks.unshift(item);
                } else {
                    q.tasks.push(item);
                }

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
            });
            async.setImmediate(q.process);
        }
        function _next(q, tasks) {
            return function(){
                workers -= 1;

                var removed = false;
                var args = arguments;
                _arrayEach(tasks, function (task) {
                    _arrayEach(workersList, function (worker, index) {
                        if (worker === task && !removed) {
                            workersList.splice(index, 1);
                            removed = true;
                        }
                    });

                    task.callback.apply(task, args);
                });
                if (q.tasks.length + workers === 0) {
                    q.drain();
                }
                q.process();
            };
        }

        var workers = 0;
        var workersList = [];
        var q = {
            tasks: [],
            concurrency: concurrency,
            payload: payload,
            saturated: noop,
            empty: noop,
            drain: noop,
            started: false,
            paused: false,
            push: function (data, callback) {
                _insert(q, data, false, callback);
            },
            kill: function () {
                q.drain = noop;
                q.tasks = [];
            },
            unshift: function (data, callback) {
                _insert(q, data, true, callback);
            },
            process: function () {
                while(!q.paused && workers < q.concurrency && q.tasks.length){

                    var tasks = q.payload ?
                        q.tasks.splice(0, q.payload) :
                        q.tasks.splice(0, q.tasks.length);

                    var data = _map(tasks, function (task) {
                        return task.data;
                    });

                    if (q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    workersList.push(tasks[0]);
                    var cb = only_once(_next(q, tasks));
                    worker(data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            workersList: function () {
                return workersList;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                q.paused = true;
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                var resumeCount = Math.min(q.concurrency, q.tasks.length);
                // Need to call q.process once per concurrent
                // worker to preserve full concurrency after pause
                for (var w = 1; w <= resumeCount; w++) {
                    async.setImmediate(q.process);
                }
            }
        };
        return q;
    }

    async.queue = function (worker, concurrency) {
        var q = _queue(function (items, cb) {
            worker(items[0], cb);
        }, concurrency, 1);

        return q;
    };

    async.priorityQueue = function (worker, concurrency) {

        function _compareTasks(a, b){
            return a.priority - b.priority;
        }

        function _binarySearch(sequence, item, compare) {
            var beg = -1,
                end = sequence.length - 1;
            while (beg < end) {
                var mid = beg + ((end - beg + 1) >>> 1);
                if (compare(item, sequence[mid]) >= 0) {
                    beg = mid;
                } else {
                    end = mid - 1;
                }
            }
            return beg;
        }

        function _insert(q, data, priority, callback) {
            if (callback != null && typeof callback !== "function") {
                throw new Error("task callback must be a function");
            }
            q.started = true;
            if (!_isArray(data)) {
                data = [data];
            }
            if(data.length === 0) {
                // call drain immediately if there are no tasks
                return async.setImmediate(function() {
                    q.drain();
                });
            }
            _arrayEach(data, function(task) {
                var item = {
                    data: task,
                    priority: priority,
                    callback: typeof callback === 'function' ? callback : noop
                };

                q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

                if (q.tasks.length === q.concurrency) {
                    q.saturated();
                }
                async.setImmediate(q.process);
            });
        }

        // Start with a normal queue
        var q = async.queue(worker, concurrency);

        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
            _insert(q, data, priority, callback);
        };

        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        return _queue(worker, 1, payload);
    };

    function _console_fn(name) {
        return _restParam(function (fn, args) {
            fn.apply(null, args.concat([_restParam(function (err, args) {
                if (typeof console === 'object') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _arrayEach(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            })]));
        });
    }
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        var has = Object.prototype.hasOwnProperty;
        hasher = hasher || identity;
        var memoized = _restParam(function memoized(args) {
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (has.call(memo, key)) {   
                async.setImmediate(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (has.call(queues, key)) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([_restParam(function (args) {
                    memo[key] = args;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                        q[i].apply(null, args);
                    }
                })]));
            }
        });
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
        return function () {
            return (fn.unmemoized || fn).apply(null, arguments);
        };
    };

    function _times(mapper) {
        return function (count, iterator, callback) {
            mapper(_range(count), iterator, callback);
        };
    }

    async.times = _times(async.map);
    async.timesSeries = _times(async.mapSeries);
    async.timesLimit = function (count, limit, iterator, callback) {
        return async.mapLimit(_range(count), limit, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return _restParam(function (args) {
            var that = this;

            var callback = args[args.length - 1];
            if (typeof callback == 'function') {
                args.pop();
            } else {
                callback = noop;
            }

            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([_restParam(function (err, nextargs) {
                    cb(err, nextargs);
                })]));
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        });
    };

    async.compose = function (/* functions... */) {
        return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };


    function _applyEach(eachfn) {
        return _restParam(function(fns, args) {
            var go = _restParam(function(args) {
                var that = this;
                var callback = args.pop();
                return eachfn(fns, function (fn, _, cb) {
                    fn.apply(that, args.concat([cb]));
                },
                callback);
            });
            if (args.length) {
                return go.apply(this, args);
            }
            else {
                return go;
            }
        });
    }

    async.applyEach = _applyEach(async.eachOf);
    async.applyEachSeries = _applyEach(async.eachOfSeries);


    async.forever = function (fn, callback) {
        var done = only_once(callback || noop);
        var task = ensureAsync(fn);
        function next(err) {
            if (err) {
                return done(err);
            }
            task(next);
        }
        next();
    };

    function ensureAsync(fn) {
        return _restParam(function (args) {
            var callback = args.pop();
            args.push(function () {
                var innerArgs = arguments;
                if (sync) {
                    async.setImmediate(function () {
                        callback.apply(null, innerArgs);
                    });
                } else {
                    callback.apply(null, innerArgs);
                }
            });
            var sync = true;
            fn.apply(this, args);
            sync = false;
        });
    }

    async.ensureAsync = ensureAsync;

    async.constant = _restParam(function(values) {
        var args = [null].concat(values);
        return function (callback) {
            return callback.apply(this, args);
        };
    });

    async.wrapSync =
    async.asyncify = function asyncify(func) {
        return _restParam(function (args) {
            var callback = args.pop();
            var result;
            try {
                result = func.apply(this, args);
            } catch (e) {
                return callback(e);
            }
            // if result is Promise object
            if (_isObject(result) && typeof result.then === "function") {
                result.then(function(value) {
                    callback(null, value);
                })["catch"](function(err) {
                    callback(err.message ? err : new Error(err));
                });
            } else {
                callback(null, result);
            }
        });
    };

    // Node.js
    if (typeof module === 'object' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (true) {
        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = (function () {
            return async;
        }).apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * argv.js: Simple memory-based store for command-line arguments.
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var util = __webpack_require__(3),
    common = __webpack_require__(5),
    Memory = __webpack_require__(2).Memory;

//
// ### function Argv (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Argv nconf store, a simple abstraction
// around the Memory store that can read command-line arguments.
//
var Argv = exports.Argv = function (options, usage) {
  Memory.call(this, options);

  options        = options || {};
  this.type     = 'argv';
  this.readOnly = true;
  this.options  = options;
  this.usage    = usage;
  if(typeof options.parseValues === 'boolean') {
      this.parseValues = options.parseValues;
      delete options.parseValues;
  } else {
      this.parseValues = false;
  }
  if (typeof options.transform === 'function') {
      this.transform = options.transform;
      delete options.transform;
  } else {
      this.transform = false;
  }
  if (typeof options.separator === 'string' || options.separator instanceof RegExp) {
    this.separator = options.separator;
    delete options.separator;
  } else {
    this.separator = '';
  }
};

// Inherit from the Memory store
util.inherits(Argv, Memory);

//
// ### function loadSync ()
// Loads the data passed in from `process.argv` into this instance.
//
Argv.prototype.loadSync = function () {
  this.loadArgv();
  return this.store;
};

//
// ### function loadArgv ()
// Loads the data passed in from the command-line arguments
// into this instance.
//
Argv.prototype.loadArgv = function () {
  var self = this,
      yargs, argv;

  yargs = isYargs(this.options) ?
    this.options :
    typeof this.options === 'object' ?
      __webpack_require__(16)(process.argv.slice(2)).options(this.options) :
      __webpack_require__(16)(process.argv.slice(2));

  if (typeof this.usage === 'string') { yargs.usage(this.usage) }

  argv = yargs.argv

  if (!argv) {
    return;
  }

  if (this.transform) {
    argv = common.transform(argv, this.transform);
  }

  this.readOnly = false;
  Object.keys(argv).forEach(function (key) {
    var val = argv[key];

    if (typeof val !== 'undefined') {
      if (self.parseValues) {
        val = common.parseValues(val);
      }

      if (self.separator) {
        self.set(common.key.apply(common, key.split(self.separator)), val);
      }
      else {
        self.set(key, val);
      }
    }
  });

  this.showHelp = yargs.showHelp
  this.help     = yargs.help

  this.readOnly = true;
  return this.store;
};

function isYargs(obj) {
  return (typeof obj === 'function' || typeof obj === 'object') && ('argv' in obj);
}


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var assert = __webpack_require__(40)
var Completion = __webpack_require__(41)
var Parser = __webpack_require__(42)
var path = __webpack_require__(0)
var tokenizeArgString = __webpack_require__(45)
var Usage = __webpack_require__(46)
var Validation = __webpack_require__(55)
var Y18n = __webpack_require__(56)

Argv(process.argv.slice(2))

var exports = module.exports = Argv
function Argv (processArgs, cwd) {
  processArgs = processArgs || [] // handle calling yargs().

  var self = {}
  var completion = null
  var usage = null
  var validation = null
  var y18n = Y18n({
    directory: path.resolve(__dirname, './locales'),
    updateFiles: false
  })

  if (!cwd) cwd = process.cwd()

  self.$0 = process.argv
    .slice(0, 2)
    .map(function (x, i) {
      // ignore the node bin, specify this in your
      // bin file with #!/usr/bin/env node
      if (i === 0 && /\b(node|iojs)$/.test(x)) return
      var b = rebase(cwd, x)
      return x.match(/^\//) && b.length < x.length ? b : x
    })
    .join(' ').trim()

  if (process.env._ !== undefined && process.argv[1] === process.env._) {
    self.$0 = process.env._.replace(
      path.dirname(process.execPath) + '/', ''
    )
  }

  var options
  self.resetOptions = self.reset = function () {
    // put yargs back into its initial
    // state, this is useful for creating a
    // nested CLI.
    options = {
      array: [],
      boolean: [],
      string: [],
      narg: {},
      key: {},
      alias: {},
      default: {},
      defaultDescription: {},
      choices: {},
      requiresArg: [],
      count: [],
      normalize: [],
      config: {},
      envPrefix: undefined
    }

    usage = Usage(self, y18n) // handle usage output.
    validation = Validation(self, usage, y18n) // handle arg validation.
    completion = Completion(self, usage)

    demanded = {}
    groups = {}

    exitProcess = true
    strict = false
    helpOpt = null
    versionOpt = null
    commandHandlers = {}
    self.parsed = false

    return self
  }
  self.resetOptions()

  self.boolean = function (bools) {
    options.boolean.push.apply(options.boolean, [].concat(bools))
    return self
  }

  self.array = function (arrays) {
    options.array.push.apply(options.array, [].concat(arrays))
    return self
  }

  self.nargs = function (key, n) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(function (k) {
        self.nargs(k, key[k])
      })
    } else {
      options.narg[key] = n
    }
    return self
  }

  self.choices = function (key, values) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(function (k) {
        self.choices(k, key[k])
      })
    } else {
      options.choices[key] = (options.choices[key] || []).concat(values)
    }
    return self
  }

  self.normalize = function (strings) {
    options.normalize.push.apply(options.normalize, [].concat(strings))
    return self
  }

  self.config = function (key, msg, parseFn) {
    if (typeof msg === 'function') {
      parseFn = msg
      msg = null
    }
    self.describe(key, msg || usage.deferY18nLookup('Path to JSON config file'))
    ;(Array.isArray(key) ? key : [key]).forEach(function (k) {
      options.config[k] = parseFn || true
    })
    return self
  }

  self.example = function (cmd, description) {
    usage.example(cmd, description)
    return self
  }

  self.command = function (cmd, description, fn) {
    if (description !== false) {
      usage.command(cmd, description)
    }
    if (fn) commandHandlers[cmd] = fn
    return self
  }

  var commandHandlers = {}
  self.getCommandHandlers = function () {
    return commandHandlers
  }

  self.string = function (strings) {
    options.string.push.apply(options.string, [].concat(strings))
    return self
  }

  self.default = function (key, value, defaultDescription) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(function (k) {
        self.default(k, key[k])
      })
    } else {
      if (defaultDescription) options.defaultDescription[key] = defaultDescription
      if (typeof value === 'function') {
        if (!options.defaultDescription[key]) options.defaultDescription[key] = usage.functionDescription(value)
        value = value.call()
      }
      options.default[key] = value
    }
    return self
  }

  self.alias = function (x, y) {
    if (typeof x === 'object') {
      Object.keys(x).forEach(function (key) {
        self.alias(key, x[key])
      })
    } else {
      // perhaps 'x' is already an alias in another list?
      // if so we should append to x's list.
      var aliases = null
      Object.keys(options.alias).forEach(function (key) {
        if (~options.alias[key].indexOf(x)) aliases = options.alias[key]
      })

      if (aliases) { // x was an alias itself.
        aliases.push(y)
      } else { // x is a new alias key.
        options.alias[x] = (options.alias[x] || []).concat(y)
      }

      // wait! perhaps we've created two lists of aliases
      // that reference each other?
      if (options.alias[y]) {
        Array.prototype.push.apply((options.alias[x] || aliases), options.alias[y])
        delete options.alias[y]
      }
    }
    return self
  }

  self.count = function (counts) {
    options.count.push.apply(options.count, [].concat(counts))
    return self
  }

  var demanded = {}
  self.demand = self.required = self.require = function (keys, max, msg) {
    // you can optionally provide a 'max' key,
    // which will raise an exception if too many '_'
    // options are provided.
    if (typeof max !== 'number') {
      msg = max
      max = Infinity
    }

    if (typeof keys === 'number') {
      if (!demanded._) demanded._ = { count: 0, msg: null, max: max }
      demanded._.count = keys
      demanded._.msg = msg
    } else if (Array.isArray(keys)) {
      keys.forEach(function (key) {
        self.demand(key, msg)
      })
    } else {
      if (typeof msg === 'string') {
        demanded[keys] = { msg: msg }
      } else if (msg === true || typeof msg === 'undefined') {
        demanded[keys] = { msg: undefined }
      }
    }

    return self
  }
  self.getDemanded = function () {
    return demanded
  }

  self.requiresArg = function (requiresArgs) {
    options.requiresArg.push.apply(options.requiresArg, [].concat(requiresArgs))
    return self
  }

  self.implies = function (key, value) {
    validation.implies(key, value)
    return self
  }

  self.usage = function (msg, opts) {
    if (!opts && typeof msg === 'object') {
      opts = msg
      msg = null
    }

    usage.usage(msg)

    if (opts) self.options(opts)

    return self
  }

  self.epilogue = self.epilog = function (msg) {
    usage.epilog(msg)
    return self
  }

  self.fail = function (f) {
    usage.failFn(f)
    return self
  }

  self.check = function (f) {
    validation.check(f)
    return self
  }

  self.defaults = self.default

  self.describe = function (key, desc) {
    options.key[key] = true
    usage.describe(key, desc)
    return self
  }

  self.parse = function (args) {
    return parseArgs(args)
  }

  self.option = self.options = function (key, opt) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(function (k) {
        self.options(k, key[k])
      })
    } else {
      assert(typeof opt === 'object', 'second argument to option must be an object')

      options.key[key] = true // track manually set keys.

      if (opt.alias) self.alias(key, opt.alias)

      var demand = opt.demand || opt.required || opt.require

      if (demand) {
        self.demand(key, demand)
      } if ('config' in opt) {
        self.config(key, opt.configParser)
      } if ('default' in opt) {
        self.default(key, opt.default)
      } if ('nargs' in opt) {
        self.nargs(key, opt.nargs)
      } if ('choices' in opt) {
        self.choices(key, opt.choices)
      } if ('group' in opt) {
        self.group(key, opt.group)
      } if (opt.boolean || opt.type === 'boolean') {
        self.boolean(key)
        if (opt.alias) self.boolean(opt.alias)
      } if (opt.array || opt.type === 'array') {
        self.array(key)
        if (opt.alias) self.array(opt.alias)
      } if (opt.string || opt.type === 'string') {
        self.string(key)
        if (opt.alias) self.string(opt.alias)
      } if (opt.count || opt.type === 'count') {
        self.count(key)
      } if (opt.defaultDescription) {
        options.defaultDescription[key] = opt.defaultDescription
      }

      var desc = opt.describe || opt.description || opt.desc
      if (desc) {
        self.describe(key, desc)
      }

      if (opt.requiresArg) {
        self.requiresArg(key)
      }
    }

    return self
  }
  self.getOptions = function () {
    return options
  }

  var groups = {}
  self.group = function (opts, groupName) {
    var seen = {}
    groups[groupName] = (groups[groupName] || []).concat(opts).filter(function (key) {
      if (seen[key]) return false
      return (seen[key] = true)
    })
    return self
  }
  self.getGroups = function () {
    return groups
  }

  // as long as options.envPrefix is not undefined,
  // parser will apply env vars matching prefix to argv
  self.env = function (prefix) {
    if (prefix === false) options.envPrefix = undefined
    else options.envPrefix = prefix || ''
    return self
  }

  self.wrap = function (cols) {
    usage.wrap(cols)
    return self
  }

  var strict = false
  self.strict = function () {
    strict = true
    return self
  }
  self.getStrict = function () {
    return strict
  }

  self.showHelp = function (level) {
    if (!self.parsed) parseArgs(processArgs) // run parser, if it has not already been executed.
    usage.showHelp(level)
    return self
  }

  var versionOpt = null
  self.version = function (ver, opt, msg) {
    versionOpt = opt || 'version'
    usage.version(ver)
    self.boolean(versionOpt)
    self.describe(versionOpt, msg || usage.deferY18nLookup('Show version number'))
    return self
  }

  var helpOpt = null
  self.addHelpOpt = function (opt, msg) {
    helpOpt = opt
    self.boolean(opt)
    self.describe(opt, msg || usage.deferY18nLookup('Show help'))
    return self
  }

  self.showHelpOnFail = function (enabled, message) {
    usage.showHelpOnFail(enabled, message)
    return self
  }

  var exitProcess = true
  self.exitProcess = function (enabled) {
    if (typeof enabled !== 'boolean') {
      enabled = true
    }
    exitProcess = enabled
    return self
  }
  self.getExitProcess = function () {
    return exitProcess
  }

  self.help = function () {
    if (arguments.length > 0) return self.addHelpOpt.apply(self, arguments)

    if (!self.parsed) parseArgs(processArgs) // run parser, if it has not already been executed.

    return usage.help()
  }

  var completionCommand = null
  self.completion = function (cmd, desc, fn) {
    // a function to execute when generating
    // completions can be provided as the second
    // or third argument to completion.
    if (typeof desc === 'function') {
      fn = desc
      desc = null
    }

    // register the completion command.
    completionCommand = cmd || 'completion'
    if (!desc && desc !== false) {
      desc = 'generate bash completion script'
    }
    self.command(completionCommand, desc)

    // a function can be provided
    if (fn) completion.registerFunction(fn)

    return self
  }

  self.showCompletionScript = function ($0) {
    $0 = $0 || self.$0
    console.log(completion.generateCompletionScript($0))
    return self
  }

  self.locale = function (locale) {
    if (arguments.length === 0) {
      guessLocale()
      return y18n.getLocale()
    }
    detectLocale = false
    y18n.setLocale(locale)
    return self
  }

  self.updateStrings = self.updateLocale = function (obj) {
    detectLocale = false
    y18n.updateLocale(obj)
    return self
  }

  var detectLocale = true
  self.detectLocale = function (detect) {
    detectLocale = detect
    return self
  }
  self.getDetectLocale = function () {
    return detectLocale
  }

  self.getUsageInstance = function () {
    return usage
  }

  self.getValidationInstance = function () {
    return validation
  }

  self.terminalWidth = function () {
    return __webpack_require__(17).width
  }

  Object.defineProperty(self, 'argv', {
    get: function () {
      var args = null

      try {
        args = parseArgs(processArgs)
      } catch (err) {
        usage.fail(err.message)
      }

      return args
    },
    enumerable: true
  })

  function parseArgs (args) {
    args = normalizeArgs(args)

    var parsed = Parser(args, options, y18n)
    var argv = parsed.argv
    var aliases = parsed.aliases

    argv.$0 = self.$0

    self.parsed = parsed

    guessLocale() // guess locale lazily, so that it can be turned off in chain.

    // while building up the argv object, there
    // are two passes through the parser. If completion
    // is being performed short-circuit on the first pass.
    if (completionCommand &&
      (process.argv.join(' ')).indexOf(completion.completionKey) !== -1 &&
      !argv[completion.completionKey]) {
      return argv
    }

    // if there's a handler associated with a
    // command defer processing to it.
    var handlerKeys = Object.keys(self.getCommandHandlers())
    for (var i = 0, command; (command = handlerKeys[i]) !== undefined; i++) {
      if (~argv._.indexOf(command)) {
        runCommand(command, self, argv)
        return self.argv
      }
    }

    // generate a completion script for adding to ~/.bashrc.
    if (completionCommand && ~argv._.indexOf(completionCommand) && !argv[completion.completionKey]) {
      self.showCompletionScript()
      if (exitProcess) {
        process.exit(0)
      }
    }

    // we must run completions first, a user might
    // want to complete the --help or --version option.
    if (completion.completionKey in argv) {
      // we allow for asynchronous completions,
      // e.g., loading in a list of commands from an API.
      completion.getCompletion(function (completions) {
        ;(completions || []).forEach(function (completion) {
          console.log(completion)
        })

        if (exitProcess) {
          process.exit(0)
        }
      })
      return
    }

    var helpOrVersion = false
    Object.keys(argv).forEach(function (key) {
      if (key === helpOpt && argv[key]) {
        helpOrVersion = true
        self.showHelp('log')
        if (exitProcess) {
          process.exit(0)
        }
      } else if (key === versionOpt && argv[key]) {
        helpOrVersion = true
        usage.showVersion()
        if (exitProcess) {
          process.exit(0)
        }
      }
    })

    // If the help or version options where used and exitProcess is false,
    // we won't run validations
    if (!helpOrVersion) {
      if (parsed.error) throw parsed.error

      // if we're executed via bash completion, don't
      // bother with validation.
      if (!argv[completion.completionKey]) {
        validation.nonOptionCount(argv)
        validation.missingArgumentValue(argv)
        validation.requiredArguments(argv)
        if (strict) validation.unknownArguments(argv, aliases)
        validation.customChecks(argv, aliases)
        validation.limitedChoices(argv)
        validation.implications(argv)
      }
    }

    setPlaceholderKeys(argv)

    return argv
  }

  function guessLocale () {
    if (!detectLocale) return

    try {
      var osLocale = __webpack_require__(57)
      self.locale(osLocale.sync({ spawn: false }))
    } catch (err) {
      // if we explode looking up locale just noop
      // we'll keep using the default language 'en'.
    }
  }

  function runCommand (command, yargs, argv) {
    setPlaceholderKeys(argv)
    yargs.getCommandHandlers()[command](yargs.reset(), argv)
  }

  function setPlaceholderKeys (argv) {
    Object.keys(options.key).forEach(function (key) {
      // don't set placeholder keys for dot
      // notation options 'foo.bar'.
      if (~key.indexOf('.')) return
      if (typeof argv[key] === 'undefined') argv[key] = undefined
    })
  }

  function normalizeArgs (args) {
    if (typeof args === 'string') {
      return tokenizeArgString(args)
    }
    return args
  }

  singletonify(self)
  return self
}

// rebase an absolute path to a relative one with respect to a base directory
// exported for tests
exports.rebase = rebase
function rebase (base, dir) {
  return path.relative(base, dir)
}

/*  Hack an instance of Argv with process.argv into Argv
    so people can do
    require('yargs')(['--beeble=1','-z','zizzle']).argv
    to parse a list of args and
    require('yargs').argv
    to get a parsed version of process.argv.
*/
function singletonify (inst) {
  Object.keys(inst).forEach(function (key) {
    if (key === 'argv') {
      Argv.__defineGetter__(key, inst.__lookupGetter__(key))
    } else {
      Argv[key] = typeof inst[key] === 'function' ? inst[key].bind(inst) : inst[key]
    }
  })
}

/* WEBPACK VAR INJECTION */}.call(exports, "node_modules\\yargs"))

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*!
 * window-size <https://github.com/jonschlinkert/window-size>
 *
 * Copyright (c) 2014-2015 Jon Schlinkert
 * Licensed under the MIT license.
 */

var tty = __webpack_require__(54);

module.exports = (function () {
  var width;
  var height;

  if (tty.isatty(1) && tty.isatty(2)) {
    if (process.stdout.getWindowSize) {
      width = process.stdout.getWindowSize(1)[0];
      height = process.stdout.getWindowSize(1)[1];
    } else if (tty.getWindowSize) {
      width = tty.getWindowSize()[1];
      height = tty.getWindowSize()[0];
    } else if (process.stdout.columns && process.stdout.rows) {
      height = process.stdout.columns;
      width = process.stdout.rows;
    }
  } else {
    Error('window-size could not get size with tty or process.stdout.');
  }

  return {height: height, width: width};
})();


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * env.js: Simple memory-based store for environment variables
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var util = __webpack_require__(3),
    common = __webpack_require__(5),
    Memory = __webpack_require__(2).Memory;

//
// ### function Env (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Env nconf store, a simple abstraction
// around the Memory store that can read process environment variables.
//
var Env = exports.Env = function (options) {
  Memory.call(this, options);

  options        = options || {};
  this.type      = 'env';
  this.readOnly  = true;
  this.whitelist = options.whitelist || [];
  this.separator = options.separator || '';
  this.lowerCase = options.lowerCase || false;
  this.parseValues = options.parseValues || false;
  this.transform = options.transform || false;

  if (({}).toString.call(options.match) === '[object RegExp]'
      && typeof options !== 'string') {
    this.match = options.match;
  }

  if (options instanceof Array) {
    this.whitelist = options;
  }
  if (typeof(options) === 'string' || options instanceof RegExp) {
    this.separator = options;
  }
};

// Inherit from the Memory store
util.inherits(Env, Memory);

//
// ### function loadSync ()
// Loads the data passed in from `process.env` into this instance.
//
Env.prototype.loadSync = function () {
  this.loadEnv();
  return this.store;
};

//
// ### function loadEnv ()
// Loads the data passed in from `process.env` into this instance.
//
Env.prototype.loadEnv = function () {
  var self = this;

  var env = process.env;

  if (this.lowerCase) {
    env = {};
    Object.keys(process.env).forEach(function (key) {
      env[key.toLowerCase()] = process.env[key];
    });
  }

  if (this.transform) {
    env = common.transform(env, this.transform);
  }

  this.readOnly = false;
  Object.keys(env).filter(function (key) {
    if (self.match && self.whitelist.length) {
      return key.match(self.match) || self.whitelist.indexOf(key) !== -1
    }
    else if (self.match) {
      return key.match(self.match);
    }
    else {
      return !self.whitelist.length || self.whitelist.indexOf(key) !== -1
    }
  }).forEach(function (key) {
    
    var val = env[key];

    if (self.parseValues) {
      val = common.parseValues(val);
    }

    if (self.separator) {
      self.set(common.key.apply(common, key.split(self.separator)), val);
    }
    else {
      self.set(key, val);
    }
  });

  this.readOnly = true;
  return this.store;
};



/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * file.js: Simple file storage engine for nconf files
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var fs = __webpack_require__(4),
    path = __webpack_require__(0),
    util = __webpack_require__(3),
    Secure = __webpack_require__(62),
    formats = __webpack_require__(8),
    Memory = __webpack_require__(2).Memory;

var exists = fs.exists || path.exists,
    existsSync = fs.existsSync || path.existsSync;

//
// ### function File (options)
// #### @options {Object} Options for this instance
// Constructor function for the File nconf store, a simple abstraction
// around the Memory store that can persist configuration to disk.
//
var File = exports.File = function (options) {
  if (!options || !options.file) {
    throw new Error('Missing required option `file`');
  }

  Memory.call(this, options);

  this.type    = 'file';
  this.file    = options.file;
  this.dir     = options.dir    || process.cwd();
  this.format  = options.format || formats.json;
  this.secure  = options.secure;
  this.spacing = options.json_spacing
    || options.spacing
    || 2;

  if (this.secure) {
    this.secure = Buffer.isBuffer(this.secure) || typeof this.secure === 'string'
      ? { secret: this.secure.toString() }
      : this.secure;

    this.secure.alg = this.secure.alg || 'aes-256-ctr';
    if (this.secure.secretPath) {
      this.secure.secret = fs.readFileSync(this.secure.secretPath, 'utf8');
    }

    if (!this.secure.secret) {
      throw new Error('secure.secret option is required');
    }

    this.keys = new Secure({
      secret: this.secure.secret,
      alg: this.secure.alg,
      format: this.format
    });
  }

  if (options.search) {
    this.search(this.dir);
  }
};

// Inherit from the Memory store
util.inherits(File, Memory);

//
// ### function save (value, callback)
// #### @value {Object} _Ignored_ Left here for consistency
// #### @callback {function} Continuation to respond to when complete.
// Saves the current configuration object to disk at `this.file`
// using the format specified by `this.format`.
//
File.prototype.save = function (value, callback) {
  this.saveToFile(this.file, value, callback);
};

//
// ### function saveToFile (path, value, callback)
// #### @path {string} The path to the file where we save the configuration to  
// #### @format {Object} Optional formatter, default behing the one of the store
// #### @callback {function} Continuation to respond to when complete.
// Saves the current configuration object to disk at `this.file`
// using the format specified by `this.format`.
//
File.prototype.saveToFile = function (path, format, callback) {
  if (!callback) {
    callback = format;
    format = this.format;
  }

  fs.writeFile(path, this.stringify(format), callback);
};

//
// ### function saveSync (value, callback)
// Saves the current configuration object to disk at `this.file`
// using the format specified by `this.format` synchronously.
//
File.prototype.saveSync = function () {
  fs.writeFileSync(this.file, this.stringify());
  return this.store;
};

//
// ### function load (callback)
// #### @callback {function} Continuation to respond to when complete.
// Responds with an Object representing all keys associated in this instance.
//
File.prototype.load = function (callback) {
  var self = this;

  exists(self.file, function (exists) {
    if (!exists) {
      return callback(null, {});
    }

    //
    // Else, the path exists, read it from disk
    //
    fs.readFile(self.file, function (err, data) {
      if (err) {
        return callback(err);
      }

      try {
        // Deals with string that include BOM
        var stringData = data.toString();
        if (stringData.charAt(0) === '\uFEFF') {
          stringData = stringData.substr(1);
        }

        self.store = self.parse(stringData);
      }
      catch (ex) {
        return callback(new Error("Error parsing your configuration file: [" + self.file + ']: ' + ex.message));
      }

      callback(null, self.store);
    });
  });
};

//
// ### function loadSync (callback)
// Attempts to load the data stored in `this.file` synchronously
// and responds appropriately.
//
File.prototype.loadSync = function () {
  if (!existsSync(this.file)) {
    this.store = {};
    return this.store;
  }

  //
  // Else, the path exists, read it from disk
  //
  try {
    // Deals with file that include BOM
    var fileData = fs.readFileSync(this.file, 'utf8');
    if (fileData.charAt(0) === '\uFEFF') {
      fileData = fileData.substr(1);
    }

    this.store = this.parse(fileData);
  }
  catch (ex) {
    throw new Error("Error parsing your configuration file: [" + this.file + ']: ' + ex.message);
  }

  return this.store;
};

//
// ### function stringify ()
// Returns an encrypted version of the contents IIF
// `this.secure` is enabled
//
File.prototype.stringify = function (format) {
  var data = this.store;
  if (!format) {
      format = this.format
  }

  if (this.secure) {
    data = this.keys.encrypt(data);
  }

  return format.stringify(data, null, this.spacing);
};

//
// ### function parse (contents)
// Returns a decrypted version of the contents IFF
// `this.secure` is enabled.
//
File.prototype.parse = function (contents) {
  var parsed = this.format.parse(contents);

  if (!this.secure) {
    return parsed;
  }

  return this.keys.decrypt(parsed);

};


//
// ### function search (base)
// #### @base {string} Base directory (or file) to begin searching for the target file.
// Attempts to find `this.file` by iteratively searching up the
// directory structure
//
File.prototype.search = function (base) {
  var looking = true,
      fullpath,
      previous,
      stats;

  base = base || process.cwd();

  if (this.file[0] === '/') {
    //
    // If filename for this instance is a fully qualified path
    // (i.e. it starts with a `'/'`) then check if it exists
    //
    try {
      stats = fs.statSync(fs.realpathSync(this.file));
      if (stats.isFile()) {
        fullpath = this.file;
        looking = false;
      }
    }
    catch (ex) {
      //
      // Ignore errors
      //
    }
  }

  if (looking && base) {
    //
    // Attempt to stat the realpath located at `base`
    // if the directory does not exist then return false.
    //
    try {
      var stat = fs.statSync(fs.realpathSync(base));
      looking = stat.isDirectory();
    }
    catch (ex) {
      return false;
    }
  }

  while (looking) {
    //
    // Iteratively look up the directory structure from `base`
    //
    try {
      stats = fs.statSync(fs.realpathSync(fullpath = path.join(base, this.file)));
      looking = stats.isDirectory();
    }
    catch (ex) {
      previous = base;
      base = path.dirname(base);

      if (previous === base) {
        //
        // If we've reached the top of the directory structure then simply use
        // the default file path.
        //
        try {
          stats = fs.statSync(fs.realpathSync(fullpath = path.join(this.dir, this.file)));
          if (stats.isDirectory()) {
            fullpath = undefined;
          }
        }
        catch (ex) {
          //
          // Ignore errors
          //
        }

        looking = false;
      }
    }
  }

  //
  // Set the file for this instance to the fullpath
  // that we have found during the search. In the event that
  // the search was unsuccessful use the original value for `this.file`.
  //
  this.file = fullpath || this.file;

  return fullpath;
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * literal.js: Simple literal Object store for nconf.
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var util = __webpack_require__(3),
    Memory = __webpack_require__(2).Memory

var Literal = exports.Literal = function Literal (options) {
  Memory.call(this, options);

  options       = options || {}
  this.type     = 'literal';
  this.readOnly = true;
  this.store    = options.store || options;
};

// Inherit from Memory store.
util.inherits(Literal, Memory);

//
// ### function loadSync (callback)
// Returns the data stored in `this.store` synchronously.
//
Literal.prototype.loadSync = function () {
  return this.store;
};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const utils = __webpack_require__(66);
const util = __webpack_require__(3);
const path = __webpack_require__(0);
const fs = __webpack_require__(4);
const member = __webpack_require__(11);

let isLoadingConfig = false;

function createChannel(client, channelName, txFilePath) {
  _logger2.default.debug('createChannel()');

  return new Promise((resolve, reject) => {
    const orderer = client.getChannel(channelName).getOrderers()[0];
    const invoker = member.getCurrentContextMember(client);
    _logger2.default.info(`Member '${invoker.getName()}' try to create channel ~`);

    const envelope_bytes = fs.readFileSync(txFilePath);
    const config = client.extractChannelConfig(envelope_bytes);

    const signatures = [];
    const signature = client.signChannelConfig(config);
    signatures.push(signature);

    const tx_id = client.newTransactionID();

    const request = {
      config,
      signatures,
      name: channelName,
      orderer,
      txId: tx_id
    };

    // send to create request to orderer
    return client.createChannel(request).then(result => {
      resolve(result);
    }).catch(err => {
      if (err instanceof Error) {
        _logger2.default.error(`Failed to create channel. ${err.stack ? err.stack : err}`);
        reject(err);
      } else {
        _logger2.default.error(`Failed to create channel - ${err || 'No Error Info'}`);
        reject(new Error(`Failed to create channel - ${err || 'No Error Info'}`));
      }
    });
  });
}

module.exports.createChannel = createChannel;

function joinChannel(client, channelName, targets) {
  _logger2.default.debug('joinChannel()');

  return new Promise((resolve, reject) => {
    const invoker = member.getCurrentContextMember(client);
    _logger2.default.info(`Member '${invoker.getName()}' try to get the genesis block ~`);

    const channel = client.getChannel(channelName);
    let tx_id = client.newTransactionID();

    const request = {
      txId: tx_id
    };

    return channel.getGenesisBlock(request).then(genesis_block => {
      _logger2.default.info('Successfully got the genesis block');

      tx_id = client.newTransactionID();
      const request = {
        targets,
        block: genesis_block,
        txId: tx_id
      };
      return channel.joinChannel(request);
    }).then(results => {
      let errorResponse;

      for (const i in results) {
        if (!results[i].response || results[i].response.status !== 200) {
          if (results[i] instanceof Error) {
            errorResponse = results[i]; // save the last error object in responses
          } else {
            errorResponse = new Error('wrong result');
          }
          break;
        }
      }
      if (errorResponse) {
        _logger2.default.error(` Failed to join channel. ${errorResponse}`);
        reject(errorResponse);
      } else {
        _logger2.default.info(`Successfully joined peers in organization ${invoker._mspId}`);
        resolve(`Successfully joined peers in organization ${invoker._mspId}`);
      }
    }).catch(err => {
      if (err instanceof Error) {
        _logger2.default.error(`Failed to join channel. ${err.stack ? err.stack : err}`);
        reject(err);
      } else {
        _logger2.default.error(`Failed to join channel - ${err || 'No Error Info'}`);
        reject(new Error(`Failed to join channel - ${err || 'No Error Info'}`));
      }
    });
  });
}

module.exports.joinChannel = joinChannel;

function loadChannelConfig(curChannel) {
  if (!isLoadingConfig) {
    isLoadingConfig = true;
    return _loadChannelConfig(curChannel, 0).then(result => {
      isLoadingConfig = false;
      _logger2.default.info(JSON.stringify(result));
      return Promise.resolve(result);
    }).catch(err => {
      isLoadingConfig = false;
      return Promise.reject(err);
    });
  }
  return Promise.reject(new Error('이전 loadChannelConfig 요청이 아직 실행 중 입니다.'));
}

module.exports.loadChannelConfig = loadChannelConfig;

function _loadChannelConfig(curChannel, index) {
  _logger2.default.info(`Loading Channel Config... Orderer URL : ${curChannel.getOrderers()[0].getUrl()}`);

  return curChannel.initialize().then(result => {
    _logger2.default.info(`Orderer(${curChannel.getOrderers()[0].getUrl()})의 Channel Config 정보를 로드하였습니다.`);
    return Promise.resolve(result);
  }).catch(err => {
    if (err.toString().endsWith('NOT_FOUND')) {
      return Promise.reject(new Error("'Create Channel'을 수행한 후에 Channel initialize를 수행하십시오."));
    } else if (err.toString().endsWith('FORBIDDEN')) {
      return Promise.reject(new Error('접근 권한을 확인하십시오.'));
    }
    _logger2.default.error(`Orderer(${curChannel.getOrderers()[0].getUrl()})에 연결이 불가능 합니다.`);
    if (index + 1 >= curChannel.getOrderers().length) {
      return Promise.reject(new Error('Orderer Service Unavailable!!'));
    }
    const orderers = curChannel.getOrderers();
    orderers.push(orderers.shift());
    _logger2.default.info(`다른 Orderer(${curChannel.getOrderers()[0].getUrl()})에 연결 시도합니다...`);
    return _loadChannelConfig(curChannel, index + 1);
  });
}

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(23);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

__webpack_require__(24);

var _server = __webpack_require__(26);

var _server2 = _interopRequireDefault(_server);

var _routes = __webpack_require__(74);

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = new _server2.default().router(_routes2.default).listen(process.env.PORT);

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _dotenv = __webpack_require__(25);

var _dotenv2 = _interopRequireDefault(_dotenv);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();

/***/ }),
/* 25 */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(6);

var _express2 = _interopRequireDefault(_express);

var _path = __webpack_require__(0);

var path = _interopRequireWildcard(_path);

var _bodyParser = __webpack_require__(27);

var bodyParser = _interopRequireWildcard(_bodyParser);

var _http = __webpack_require__(28);

var http = _interopRequireWildcard(_http);

var _os = __webpack_require__(29);

var os = _interopRequireWildcard(_os);

var _cookieParser = __webpack_require__(30);

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _swagger = __webpack_require__(31);

var _swagger2 = _interopRequireDefault(_swagger);

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright 2018 (주)KT All Rights Reserved.
 *
 *
 */

const bc = __webpack_require__(12);
const couch = __webpack_require__(70);
const config = __webpack_require__(73);

const app = new _express2.default();

class ExpressServer {
  constructor() {
    const root = path.normalize(`${__dirname}/../..`);
    app.set('appPath', `${root}client`);
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use((0, _cookieParser2.default)(process.env.SESSION_SECRET));
    app.use(_express2.default.static(`${root}/public`));

    if (config.startChannelNetwork) {
      bc.channelSetUp(path.join('configuration', config.startChannelNetwork)).then(() => {
        couch.dbSetUp();
      }).catch(err => {
        _logger2.default.error(err.stack ? err.stack : err);
      });
    }
  }

  router(routes) {
    (0, _swagger2.default)(app, routes);
    return this;
  }

  listen(port = process.env.PORT) {
    const welcome = p => () => _logger2.default.info(`up and running in ${"development" || 'development'} @: ${os.hostname()} on port: ${p}}`);
    http.createServer(app).listen(port, welcome(port));
    return app;
  }
}
exports.default = ExpressServer;
/* WEBPACK VAR INJECTION */}.call(exports, "server\\common"))

/***/ }),
/* 27 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 28 */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = require("cookie-parser");

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (app, routes) {
  (0, _swaggerExpressMiddleware2.default)(path.join(__dirname, 'Api.yaml'), app, (err, mw) => {
    // Enable Express' case-sensitive and strict options
    // (so "/entities", "/Entities", and "/Entities/" are all different)
    app.enable('case sensitive routing');
    app.enable('strict routing');

    app.use(mw.metadata());
    app.use(mw.files({
      // Override the Express App's case-sensitive 
      // and strict-routing settings for the Files middleware.
      caseSensitive: false,
      strict: false
    }, {
      useBasePath: true,
      apiPath: process.env.SWAGGER_API_SPEC
      // Disable serving the "Api.yaml" file
      // rawFilesPath: false
    }));

    app.use(mw.parseRequest({
      // Configure the cookie parser to use secure cookies
      cookie: {
        secret: process.env.SESSION_SECRET
      },
      // Don't allow JSON content over 100kb (default is 1mb)
      json: {
        limit: process.env.REQUEST_LIMIT
      }
    }));

    // These two middleware don't have any options (yet)
    app.use(mw.CORS(), mw.validateRequest());

    // Error handler to display the validation error as HTML
    app.use((err, req, res, next) => {
      // eslint-disable-line no-unused-vars, no-shadow
      res.status(err.status || 500);
      res.send(`<h1>${err.status || 500} Error</h1>` + `<pre>${err.message}</pre>`);
    });

    routes(app);
  });
};

var _swaggerExpressMiddleware = __webpack_require__(32);

var _swaggerExpressMiddleware2 = _interopRequireDefault(_swaggerExpressMiddleware);

var _path = __webpack_require__(0);

var path = _interopRequireWildcard(_path);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/* WEBPACK VAR INJECTION */}.call(exports, "server\\common\\swagger"))

/***/ }),
/* 32 */
/***/ (function(module, exports) {

module.exports = require("swagger-express-middleware");

/***/ }),
/* 33 */
/***/ (function(module, exports) {

module.exports = require("pino");

/***/ }),
/* 34 */
/***/ (function(module, exports) {

module.exports = require("fabric-client");

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const path = __webpack_require__(0);
const fs = __webpack_require__(13);

// directory for file based KeyValueStore
exports.getKeyValStorePathForOrg = function (channelPath, org) {
  return path.join(channelPath, 'key', `${'keyValStore' + '_'}${org}`);
};

exports.getCryptoKeyStorePathForOrg = function (channelPath, org) {
  return path.join(channelPath, 'key', `${'cryptoKeyStore' + '_'}${org}`);
};

exports.getAdminMemberIdForOrg = function (org) {
  return `${org}Admin`;
};

// temporarily set $GOPATH to the test fixture folder
exports.setGoPath = function (gopath) {
  process.env.GOPATH = path.join(gopath);
};

exports.getGoPath = function () {
  return path.join(process.env.GOPATH, 'src');
};

// targetPeers format => {org1 : [peer1, peer2, ...], org2 : [peer1, ...], ...}
exports.setTargets = function (allPeers, targetPeers) {
  const targets = [];
  for (const orgId in targetPeers) {
    const peerList = allPeers[orgId];
    for (const idx in targetPeers[orgId]) {
      targets.push(peerList[targetPeers[orgId][idx]][0]);
    }
  }
};

// targetPeers format => {org1 : [peer1, peer2, ...], org2 : [peer1, ...], ...}
exports.setEventhubs = function (allPeers, targetPeers, clientOrg) {
  const eventhubs = [];
  const ehPeerList = allPeers[clientOrgId];
  for (const idx in ehPeerList) {
    const eh = client.newEventHub();
    eh.setPeerAddr(ehPeerList[idx][1], ehPeerList[idx][2]);
    eh.connect();
    eventhubs.push(eh);
  }

  return eventhubs;
};

// specifically set the values to defaults because they may have been overridden when
// running in the overall test bucket ('gulp test')
exports.resetDefaults = function () {
  global.hfc.config = undefined;
  __webpack_require__(7).reset();
};

exports.cleanupDir = function (keyValStorePath) {
  const absPath = path.join(process.cwd(), keyValStorePath);
  const exists = exports.existsSync(absPath);

  if (exists) {
    fs.removeSync(absPath);
  }
};

exports.getUniqueVersion = function (prefix) {
  if (!prefix) prefix = 'v';
  return prefix + Date.now();
};

// utility function to check if directory or file exists
// uses entire / absolute path from root
exports.existsSync = function (absolutePath /* string */) {
  try {
    const stat = fs.statSync(absolutePath);
    if (stat.isDirectory() || stat.isFile()) {
      return true;
    }return false;
  } catch (e) {
    return false;
  }
};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

exports.parse = exports.decode = decode

exports.stringify = exports.encode = encode

exports.safe = safe
exports.unsafe = unsafe

var eol = typeof process !== 'undefined' &&
  process.platform === 'win32' ? '\r\n' : '\n'

function encode (obj, opt) {
  var children = []
  var out = ''

  if (typeof opt === 'string') {
    opt = {
      section: opt,
      whitespace: false
    }
  } else {
    opt = opt || {}
    opt.whitespace = opt.whitespace === true
  }

  var separator = opt.whitespace ? ' = ' : '='

  Object.keys(obj).forEach(function (k, _, __) {
    var val = obj[k]
    if (val && Array.isArray(val)) {
      val.forEach(function (item) {
        out += safe(k + '[]') + separator + safe(item) + '\n'
      })
    } else if (val && typeof val === 'object') {
      children.push(k)
    } else {
      out += safe(k) + separator + safe(val) + eol
    }
  })

  if (opt.section && out.length) {
    out = '[' + safe(opt.section) + ']' + eol + out
  }

  children.forEach(function (k, _, __) {
    var nk = dotSplit(k).join('\\.')
    var section = (opt.section ? opt.section + '.' : '') + nk
    var child = encode(obj[k], {
      section: section,
      whitespace: opt.whitespace
    })
    if (out.length && child.length) {
      out += eol
    }
    out += child
  })

  return out
}

function dotSplit (str) {
  return str.replace(/\1/g, '\u0002LITERAL\\1LITERAL\u0002')
    .replace(/\\\./g, '\u0001')
    .split(/\./).map(function (part) {
      return part.replace(/\1/g, '\\.')
      .replace(/\2LITERAL\\1LITERAL\2/g, '\u0001')
    })
}

function decode (str) {
  var out = {}
  var p = out
  var section = null
  //          section     |key      = value
  var re = /^\[([^\]]*)\]$|^([^=]+)(=(.*))?$/i
  var lines = str.split(/[\r\n]+/g)

  lines.forEach(function (line, _, __) {
    if (!line || line.match(/^\s*[;#]/)) return
    var match = line.match(re)
    if (!match) return
    if (match[1] !== undefined) {
      section = unsafe(match[1])
      p = out[section] = out[section] || {}
      return
    }
    var key = unsafe(match[2])
    var value = match[3] ? unsafe(match[4]) : true
    switch (value) {
      case 'true':
      case 'false':
      case 'null': value = JSON.parse(value)
    }

    // Convert keys with '[]' suffix to an array
    if (key.length > 2 && key.slice(-2) === '[]') {
      key = key.substring(0, key.length - 2)
      if (!p[key]) {
        p[key] = []
      } else if (!Array.isArray(p[key])) {
        p[key] = [p[key]]
      }
    }

    // safeguard against resetting a previously defined
    // array by accidentally forgetting the brackets
    if (Array.isArray(p[key])) {
      p[key].push(value)
    } else {
      p[key] = value
    }
  })

  // {a:{y:1},"a.b":{x:2}} --> {a:{y:1,b:{x:2}}}
  // use a filter to return the keys that have to be deleted.
  Object.keys(out).filter(function (k, _, __) {
    if (!out[k] ||
      typeof out[k] !== 'object' ||
      Array.isArray(out[k])) {
      return false
    }
    // see if the parent section is also an object.
    // if so, add it to that, and mark this one for deletion
    var parts = dotSplit(k)
    var p = out
    var l = parts.pop()
    var nl = l.replace(/\\\./g, '.')
    parts.forEach(function (part, _, __) {
      if (!p[part] || typeof p[part] !== 'object') p[part] = {}
      p = p[part]
    })
    if (p === out && nl === l) {
      return false
    }
    p[nl] = out[k]
    return true
  }).forEach(function (del, _, __) {
    delete out[del]
  })

  return out
}

function isQuoted (val) {
  return (val.charAt(0) === '"' && val.slice(-1) === '"') ||
    (val.charAt(0) === "'" && val.slice(-1) === "'")
}

function safe (val) {
  return (typeof val !== 'string' ||
    val.match(/[=\r\n]/) ||
    val.match(/^\[/) ||
    (val.length > 1 &&
     isQuoted(val)) ||
    val !== val.trim())
      ? JSON.stringify(val)
      : val.replace(/;/g, '\\;').replace(/#/g, '\\#')
}

function unsafe (val, doUnesc) {
  val = (val || '').trim()
  if (isQuoted(val)) {
    // remove the single quotes before calling JSON.parse
    if (val.charAt(0) === "'") {
      val = val.substr(1, val.length - 2)
    }
    try { val = JSON.parse(val) } catch (_) {}
  } else {
    // walk the val to find the first not-escaped ; character
    var esc = false
    var unesc = ''
    for (var i = 0, l = val.length; i < l; i++) {
      var c = val.charAt(i)
      if (esc) {
        if ('\\;#'.indexOf(c) !== -1) {
          unesc += c
        } else {
          unesc += '\\' + c
        }
        esc = false
      } else if (';#'.indexOf(c) !== -1) {
        break
      } else if (c === '\\') {
        esc = true
      } else {
        unesc += c
      }
    }
    if (esc) {
      unesc += '\\'
    }
    return unesc.trim()
  }
  return val
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

/*
 * provider.js: Abstraction providing an interface into pluggable configuration storage.
 *
 * (C) 2011, Charlie Robbins and the Contributors.
 *
 */

var async = __webpack_require__(14),
    common = __webpack_require__(5);

//
// ### function Provider (options)
// #### @options {Object} Options for this instance.
// Constructor function for the Provider object responsible
// for exposing the pluggable storage features of `nconf`.
//
var Provider = exports.Provider = function (options) {
  //
  // Setup default options for working with `stores`,
  // `overrides`, `process.env` and `process.argv`.
  //
  options       = options || {};
  this.stores  = {};
  this.sources = [];
  this.init(options);
};

//
// Define wrapper functions for using basic stores
// in this instance
//

['argv', 'env'].forEach(function (type) {
  Provider.prototype[type] = function () {
    var args = [type].concat(Array.prototype.slice.call(arguments));
    return this.add.apply(this, args);
  };
});

//
// ### function file (key, options)
// #### @key {string|Object} Fully qualified options, name of file store, or path.
// #### @path {string|Object} **Optional** Full qualified options, or path.
// Adds a new `File` store to this instance. Accepts the following options
//
//    nconf.file({ file: '.jitsuconf', dir: process.env.HOME, search: true });
//    nconf.file('path/to/config/file');
//    nconf.file('userconfig', 'path/to/config/file');
//    nconf.file('userconfig', { file: '.jitsuconf', search: true });
//
Provider.prototype.file = function (key, options) {
  if (arguments.length == 1) {
    options = typeof key === 'string' ? { file: key } : key;
    key = 'file';
  }
  else {
    options = typeof options === 'string'
      ? { file: options }
      : options;
  }

  options.type = 'file';
  return this.add(key, options);
};

//
// Define wrapper functions for using
// overrides and defaults
//
['defaults', 'overrides'].forEach(function (type) {
  Provider.prototype[type] = function (options) {
    options = options || {};
    if (!options.type) {
      options.type = 'literal';
    }

    return this.add(type, options);
  };
});

//
// ### function use (name, options)
// #### @type {string} Type of the nconf store to use.
// #### @options {Object} Options for the store instance.
// Adds (or replaces) a new store with the specified `name`
// and `options`. If `options.type` is not set, then `name`
// will be used instead:
//
//    provider.use('file');
//    provider.use('file', { type: 'file', filename: '/path/to/userconf' })
//
Provider.prototype.use = function (name, options) {
  options  = options      || {};

  function sameOptions (store) {
    return Object.keys(options).every(function (key) {
      return options[key] === store[key];
    });
  }

  var store = this.stores[name],
      update = store && !sameOptions(store);

  if (!store || update) {
    if (update) {
      this.remove(name);
    }

    this.add(name, options);
  }

  return this;
};

//
// ### function add (name, options)
// #### @name {string} Name of the store to add to this instance
// #### @options {Object} Options for the store to create
// Adds a new store with the specified `name` and `options`. If `options.type`
// is not set, then `name` will be used instead:
//
//    provider.add('memory');
//    provider.add('userconf', { type: 'file', filename: '/path/to/userconf' })
//
Provider.prototype.add = function (name, options, usage) {
  options  = options      || {};
  var type = options.type || name;

  if (!__webpack_require__(7)[common.capitalize(type)]) {
    throw new Error('Cannot add store with unknown type: ' + type);
  }

  this.stores[name] = this.create(type, options, usage);

  if (this.stores[name].loadSync) {
    this.stores[name].loadSync();
  }

  return this;
};

//
// ### function remove (name)
// #### @name {string} Name of the store to remove from this instance
// Removes a store with the specified `name` from this instance. Users
// are allowed to pass in a type argument (e.g. `memory`) as name if
// this was used in the call to `.add()`.
//
Provider.prototype.remove = function (name) {
  delete this.stores[name];
  return this;
};

//
// ### function create (type, options)
// #### @type {string} Type of the nconf store to use.
// #### @options {Object} Options for the store instance.
// Creates a store of the specified `type` using the
// specified `options`.
//
Provider.prototype.create = function (type, options, usage) {
  return new (__webpack_require__(7)[common.capitalize(type.toLowerCase())])(options, usage);
};

//
// ### function init (options)
// #### @options {Object} Options to initialize this instance with.
// Initializes this instance with additional `stores` or `sources` in the
// `options` supplied.
//
Provider.prototype.init = function (options) {
  var self = this;

  //
  // Add any stores passed in through the options
  // to this instance.
  //
  if (options.type) {
    this.add(options.type, options);
  }
  else if (options.store) {
    this.add(options.store.name || options.store.type, options.store);
  }
  else if (options.stores) {
    Object.keys(options.stores).forEach(function (name) {
      var store = options.stores[name];
      self.add(store.name || name || store.type, store);
    });
  }

  //
  // Add any read-only sources to this instance
  //
  if (options.source) {
    this.sources.push(this.create(options.source.type || options.source.name, options.source));
  }
  else if (options.sources) {
    Object.keys(options.sources).forEach(function (name) {
      var source = options.sources[name];
      self.sources.push(self.create(source.type || source.name || name, source));
    });
  }
};

//
// ### function get (key, callback)
// #### @key {string} Key to retrieve for this instance.
// #### @callback {function} **Optional** Continuation to respond to when complete.
// Retrieves the value for the specified key (if any).
//
Provider.prototype.get = function (key, callback) {
  if (typeof key === 'function') {
    // Allow a * key call to be made
    callback = key;
    key = null;
  }

  //
  // If there is no callback we can short-circuit into the default
  // logic for traversing stores.
  //
  if (!callback) {
    return this._execute('get', 1, key, callback);
  }

  //
  // Otherwise the asynchronous, hierarchical `get` is
  // slightly more complicated because we do not need to traverse
  // the entire set of stores, but up until there is a defined value.
  //
  var current = 0,
      names = Object.keys(this.stores),
      self = this,
      response,
      mergeObjs = [];

  async.whilst(function () {
    return typeof response === 'undefined' && current < names.length;
  }, function (next) {
    var store = self.stores[names[current]];
    current++;

    if (store.get.length >= 2) {
      return store.get(key, function (err, value) {
        if (err) {
          return next(err);
        }

        response = value;

        // Merge objects if necessary
        if (response && typeof response === 'object' && !Array.isArray(response)) {
          mergeObjs.push(response);
          response = undefined;
        }

        next();
      });
    }

    response = store.get(key);

    // Merge objects if necessary
    if (response && typeof response === 'object' && !Array.isArray(response)) {
      mergeObjs.push(response);
      response = undefined;
    }

    next();
  }, function (err) {
    if (!err && mergeObjs.length) {
      response = common.merge(mergeObjs.reverse());
    }
    return err ? callback(err) : callback(null, response);
  });
};


//
// ### function any (keys, callback)
// #### @keys {array|string...} Array of keys to query, or a variable list of strings
// #### @callback {function} **Optional** Continuation to respond to when complete.
// Retrieves the first truthy value (if any) for the specified list of keys.
//
Provider.prototype.any = function (keys, callback) {

  if (!Array.isArray(keys)) {
    keys = Array.prototype.slice.call(arguments);
    if (keys.length > 0 && typeof keys[keys.length - 1] === 'function') {
      callback = keys.pop();
    } else {
      callback = null;
    }
  }

  //
  // If there is no callback, use the short-circuited "get"
  // on each key in turn.
  //
  if (!callback) {
    var val;
    for (var i = 0; i < keys.length; ++i) {
      val = this._execute('get', 1, keys[i], callback);
      if (val) {
        return val;
      }
    }
    return null;
  }

  var keyIndex = 0,
      result,
      self = this;
  
  async.whilst(function() {
    return !result && keyIndex < keys.length;
  }, function(next) {
    var key = keys[keyIndex];
    keyIndex++;

    self.get(key, function(err, v) {
      if (err) {
        next(err);
      } else {
        result = v;
        next();
      }
    });
  }, function(err) {
    return err ? callback(err) : callback(null, result);
  });
};


//
// ### function set (key, value, callback)
// #### @key {string} Key to set in this instance
// #### @value {literal|Object} Value for the specified key
// #### @callback {function} **Optional** Continuation to respond to when complete.
// Sets the `value` for the specified `key` in this instance.
//
Provider.prototype.set = function (key, value, callback) {
  return this._execute('set', 2, key, value, callback);
};


//
// ### function required (keys)
// #### @keys {array} List of keys
// Throws an error if any of `keys` has no value, otherwise returns `true`
Provider.prototype.required = function (keys) {
  if (!Array.isArray(keys)) {
    throw new Error('Incorrect parameter, array expected');
  }

  var missing = [];
  keys.forEach(function(key) {
    if (typeof this.get(key) === 'undefined') {
      missing.push(key);
    }
  }, this);

  if (missing.length) {
    throw new Error('Missing required keys: ' + missing.join(', '));
  } else {
    return true;
  }

};

//
// ### function reset (callback)
// #### @callback {function} **Optional** Continuation to respond to when complete.
// Clears all keys associated with this instance.
//
Provider.prototype.reset = function (callback) {
  return this._execute('reset', 0, callback);
};

//
// ### function clear (key, callback)
// #### @key {string} Key to remove from this instance
// #### @callback {function} **Optional** Continuation to respond to when complete.
// Removes the value for the specified `key` from this instance.
//
Provider.prototype.clear = function (key, callback) {
  return this._execute('clear', 1, key, callback);
};

//
// ### function merge ([key,] value [, callback])
// #### @key {string} Key to merge the value into
// #### @value {literal|Object} Value to merge into the key
// #### @callback {function} **Optional** Continuation to respond to when complete.
// Merges the properties in `value` into the existing object value at `key`.
//
// 1. If the existing value `key` is not an Object, it will be completely overwritten.
// 2. If `key` is not supplied, then the `value` will be merged into the root.
//
Provider.prototype.merge = function () {
  var self = this,
      args = Array.prototype.slice.call(arguments),
      callback = typeof args[args.length - 1] === 'function' && args.pop(),
      value = args.pop(),
      key = args.pop();

  function mergeProperty (prop, next) {
    return self._execute('merge', 2, prop, value[prop], next);
  }

  if (!key) {
    if (Array.isArray(value) || typeof value !== 'object') {
      return onError(new Error('Cannot merge non-Object into top-level.'), callback);
    }

    return async.forEach(Object.keys(value), mergeProperty, callback || function () { })
  }

  return this._execute('merge', 2, key, value, callback);
};

//
// ### function load (callback)
// #### @callback {function} Continuation to respond to when complete.
// Responds with an Object representing all keys associated in this instance.
//
Provider.prototype.load = function (callback) {
  var self = this;

  function getStores () {
    var stores = Object.keys(self.stores);
    stores.reverse();
    return stores.map(function (name) {
      return self.stores[name];
    });
  }

  function loadStoreSync(store) {
    if (!store.loadSync) {
      throw new Error('nconf store ' + store.type + ' has no loadSync() method');
    }

    return store.loadSync();
  }

  function loadStore(store, next) {
    if (!store.load && !store.loadSync) {
      return next(new Error('nconf store ' + store.type + ' has no load() method'));
    }

    return store.loadSync
      ? next(null, store.loadSync())
      : store.load(next);
  }

  function loadBatch (targets, done) {
    if (!done) {
      return common.merge(targets.map(loadStoreSync));
    }

    async.map(targets, loadStore, function (err, objs) {
      return err ? done(err) : done(null, common.merge(objs));
    });
  }

  function mergeSources (data) {
    //
    // If `data` was returned then merge it into
    // the system store.
    //
    if (data && typeof data === 'object') {
      self.use('sources', {
        type: 'literal',
        store: data
      });
    }
  }

  function loadSources () {
    var sourceHierarchy = self.sources.splice(0);
    sourceHierarchy.reverse();

    //
    // If we don't have a callback and the current
    // store is capable of loading synchronously
    // then do so.
    //
    if (!callback) {
      mergeSources(loadBatch(sourceHierarchy));
      return loadBatch(getStores());
    }

    loadBatch(sourceHierarchy, function (err, data) {
      if (err) {
        return callback(err);
      }

      mergeSources(data);
      return loadBatch(getStores(), callback);
    });
  }

  return self.sources.length
    ? loadSources()
    : loadBatch(getStores(), callback);
};

//
// ### function save (callback)
// #### @callback {function} **optional**  Continuation to respond to when
// complete.
// Instructs each provider to save.  If a callback is provided, we will attempt
// asynchronous saves on the providers, falling back to synchronous saves if
// this isn't possible.  If a provider does not know how to save, it will be
// ignored.  Returns an object consisting of all of the data which was
// actually saved.
//
Provider.prototype.save = function (value, callback) {
  if (!callback && typeof value === 'function') {
    callback = value;
    value = null;
  }

  var self = this,
      names = Object.keys(this.stores);

  function saveStoreSync(memo, name) {
    var store = self.stores[name];

    //
    // If the `store` doesn't have a `saveSync` method,
    // just ignore it and continue.
    //
    if (store.saveSync) {
      var ret = store.saveSync();
      if (typeof ret == 'object' && ret !== null) {
        memo.push(ret);
      }
    }
    return memo;
  }

  function saveStore(memo, name, next) {
    var store = self.stores[name];

    //
    // If the `store` doesn't have a `save` or saveSync`
    // method(s), just ignore it and continue.
    //

    if (store.save) {
      return store.save(value, function (err, data) {
        if (err) {
          return next(err);
        }

        if (typeof data == 'object' && data !== null) {
          memo.push(data);
        }

        next(null, memo);
      });
    }
    else if (store.saveSync) {
      memo.push(store.saveSync());
    }

    next(null, memo);
  }

  //
  // If we don't have a callback and the current
  // store is capable of saving synchronously
  // then do so.
  //
  if (!callback) {
    return common.merge(names.reduce(saveStoreSync, []));
  }

  async.reduce(names, [], saveStore, function (err, objs) {
    return err ? callback(err) : callback(null, common.merge(objs));
  });
};

//
// ### @private function _execute (action, syncLength, [arguments])
// #### @action {string} Action to execute on `this.store`.
// #### @syncLength {number} Function length of the sync version.
// #### @arguments {Array} Arguments array to apply to the action
// Executes the specified `action` on all stores for this instance, ensuring a callback supplied
// to a synchronous store function is still invoked.
//
Provider.prototype._execute = function (action, syncLength /* [arguments] */) {
  var args = Array.prototype.slice.call(arguments, 2),
      callback = typeof args[args.length - 1] === 'function' && args.pop(),
      destructive = ['set', 'clear', 'merge', 'reset'].indexOf(action) !== -1,
      self = this,
      response,
      mergeObjs = [],
      keys = Object.keys(this.stores);


  function runAction (name, next) {
    var store = self.stores[name];

    if (destructive && store.readOnly) {
      return next();
    }

    return store[action].length > syncLength
      ? store[action].apply(store, args.concat(next))
      : next(null, store[action].apply(store, args));
  }

  if (callback) {
    return async.forEach(keys, runAction, function (err) {
      return err ? callback(err) : callback();
    });
  }

  keys.forEach(function (name) {
    if (typeof response === 'undefined') {
      var store = self.stores[name];

      if (destructive && store.readOnly) {
        return;
      }

      response = store[action].apply(store, args);

      // Merge objects if necessary
      if (response && action === 'get' && typeof response === 'object' && !Array.isArray(response)) {
        mergeObjs.push(response);
        response = undefined;
      }
    }
  });

  if (mergeObjs.length) {
    response = common.merge(mergeObjs.reverse());
  }

  return response;
}

//
// Throw the `err` if a callback is not supplied
//
function onError(err, callback) {
  if (callback) {
    return callback(err);
  }

  throw err;
}


/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = {"_from":"nconf@^0.10.0","_id":"nconf@0.10.0","_inBundle":false,"_integrity":"sha512-fKiXMQrpP7CYWJQzKkPPx9hPgmq+YLDyxcG9N8RpiE9FoCkCbzD0NyW0YhE3xn3Aupe7nnDeIx4PFzYehpHT9Q==","_location":"/nconf","_phantomChildren":{},"_requested":{"type":"range","registry":true,"raw":"nconf@^0.10.0","name":"nconf","escapedName":"nconf","rawSpec":"^0.10.0","saveSpec":null,"fetchSpec":"^0.10.0"},"_requiredBy":["/fabric-ca-client","/fabric-client"],"_resolved":"https://registry.npmjs.org/nconf/-/nconf-0.10.0.tgz","_shasum":"da1285ee95d0a922ca6cee75adcf861f48205ad2","_spec":"nconf@^0.10.0","_where":"C:\\Users\\Yoo\\hyperledger\\hyperledger-study02\\node_modules\\fabric-ca-client","author":{"name":"Charlie Robbins","email":"charlie.robbins@gmail.com"},"bugs":{"url":"https://github.com/flatiron/nconf/issues"},"bundleDependencies":false,"contributors":[{"name":"Matt Hamann","email":"matthew.hamann@gmail.com"},{"name":"Maciej Małecki","email":"me@mmalecki.com"},{"name":"Jarrett Cruger","email":"jcrugzz@gmail.com"},{"name":"Adrien Becchis"}],"dependencies":{"async":"^1.4.0","ini":"^1.3.0","secure-keys":"^1.0.0","yargs":"^3.19.0"},"deprecated":false,"description":"Hierarchical node.js configuration with files, environment variables, command-line arguments, and atomic object merging.","devDependencies":{"coveralls":"^2.11.4","eslint":"^4.9.0","istanbul":"^0.4.1","nconf-yaml":"^1.0.2","vows":"0.8.x"},"engines":{"node":">= 0.4.0"},"homepage":"https://github.com/flatiron/nconf#readme","keywords":["configuration","key value store","plugabble"],"license":"MIT","main":"./lib/nconf","name":"nconf","repository":{"type":"git","url":"git+ssh://git@github.com/flatiron/nconf.git"},"scripts":{"cover":"istanbul cover vows -- test/*-test.js test/**/*-test.js  --spec","coveralls":"cat coverage/lcov.info | coveralls","lint":"eslint .","test":"vows test/*-test.js test/**/*-test.js --spec"},"version":"0.10.0"}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./argv": 15,
	"./argv.js": 15,
	"./env": 18,
	"./env.js": 18,
	"./file": 19,
	"./file.js": 19,
	"./literal": 20,
	"./literal.js": 20,
	"./memory": 2,
	"./memory.js": 2
};
function webpackContext(req) {
	return __webpack_require__(webpackContextResolve(req));
};
function webpackContextResolve(req) {
	var id = map[req];
	if(!(id + 1)) // check for number or string
		throw new Error("Cannot find module '" + req + "'.");
	return id;
};
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = 39;

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("assert");

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__dirname) {var fs = __webpack_require__(4)
var path = __webpack_require__(0)

// add bash completions to your
//  yargs-powered applications.
module.exports = function (yargs, usage) {
  var self = {
    completionKey: 'get-yargs-completions'
  }

  // get a list of completion commands.
  self.getCompletion = function (done) {
    var completions = []
    var current = process.argv[process.argv.length - 1]
    var previous = process.argv.slice(process.argv.indexOf('--' + self.completionKey) + 1)
    var argv = yargs.parse(previous)

    // a custom completion function can be provided
    // to completion().
    if (completionFunction) {
      if (completionFunction.length < 3) {
        var result = completionFunction(current, argv)

        // promise based completion function.
        if (typeof result.then === 'function') {
          return result.then(function (list) {
            process.nextTick(function () { done(list) })
          }).catch(function (err) {
            process.nextTick(function () { throw err })
          })
        }

        // synchronous completion function.
        return done(result)
      } else {
        // asynchronous completion function
        return completionFunction(current, argv, function (completions) {
          done(completions)
        })
      }
    }

    var handlers = yargs.getCommandHandlers()
    for (var i = 0, ii = previous.length; i < ii; ++i) {
      if (handlers[previous[i]]) {
        return handlers[previous[i]](yargs.reset())
      }
    }

    if (!current.match(/^-/)) {
      usage.getCommands().forEach(function (command) {
        if (previous.indexOf(command[0]) === -1) {
          completions.push(command[0])
        }
      })
    }

    if (current.match(/^-/)) {
      Object.keys(yargs.getOptions().key).forEach(function (key) {
        completions.push('--' + key)
      })
    }

    done(completions)
  }

  // generate the completion script to add to your .bashrc.
  self.generateCompletionScript = function ($0) {
    var script = fs.readFileSync(
      path.resolve(__dirname, '../completion.sh.hbs'),
      'utf-8'
    )
    var name = path.basename($0)

    // add ./to applications not yet installed as bin.
    if ($0.match(/\.js$/)) $0 = './' + $0

    script = script.replace(/{{app_name}}/g, name)
    return script.replace(/{{app_path}}/g, $0)
  }

  // register a function to perform your own custom
  // completions., this function can be either
  // synchrnous or asynchronous.
  var completionFunction = null
  self.registerFunction = function (fn) {
    completionFunction = fn
  }

  return self
}

/* WEBPACK VAR INJECTION */}.call(exports, "node_modules\\yargs\\lib"))

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

// fancy-pants parsing of argv, originally forked
// from minimist: https://www.npmjs.com/package/minimist
var camelCase = __webpack_require__(43)
var path = __webpack_require__(0)

function increment (orig) {
  return orig !== undefined ? orig + 1 : 0
}

module.exports = function (args, opts, y18n) {
  if (!opts) opts = {}

  var __ = y18n.__
  var error = null
  var flags = { arrays: {}, bools: {}, strings: {}, counts: {}, normalize: {}, configs: {}, defaulted: {} }

  ;[].concat(opts['array']).filter(Boolean).forEach(function (key) {
    flags.arrays[key] = true
  })

  ;[].concat(opts['boolean']).filter(Boolean).forEach(function (key) {
    flags.bools[key] = true
  })

  ;[].concat(opts.string).filter(Boolean).forEach(function (key) {
    flags.strings[key] = true
  })

  ;[].concat(opts.count).filter(Boolean).forEach(function (key) {
    flags.counts[key] = true
  })

  ;[].concat(opts.normalize).filter(Boolean).forEach(function (key) {
    flags.normalize[key] = true
  })

  Object.keys(opts.config).forEach(function (k) {
    flags.configs[k] = opts.config[k]
  })

  var aliases = {}
  var newAliases = {}

  extendAliases(opts.key)
  extendAliases(opts.alias)
  extendAliases(opts.default)

  var defaults = opts['default'] || {}
  Object.keys(defaults).forEach(function (key) {
    if (/-/.test(key) && !opts.alias[key]) {
      aliases[key] = aliases[key] || []
    }
    (aliases[key] || []).forEach(function (alias) {
      defaults[alias] = defaults[key]
    })
  })

  var argv = { _: [] }

  Object.keys(flags.bools).forEach(function (key) {
    setArg(key, !(key in defaults) ? false : defaults[key])
    setDefaulted(key)
  })

  var notFlags = []
  if (args.indexOf('--') !== -1) {
    notFlags = args.slice(args.indexOf('--') + 1)
    args = args.slice(0, args.indexOf('--'))
  }

  for (var i = 0; i < args.length; i++) {
    var arg = args[i]
    var broken
    var key
    var letters
    var m
    var next
    var value

    // -- seperated by =
    if (arg.match(/^--.+=/)) {
      // Using [\s\S] instead of . because js doesn't support the
      // 'dotall' regex modifier. See:
      // http://stackoverflow.com/a/1068308/13216
      m = arg.match(/^--([^=]+)=([\s\S]*)$/)

      // nargs format = '--f=monkey washing cat'
      if (checkAllAliases(m[1], opts.narg)) {
        args.splice(i + 1, m[1], m[2])
        i = eatNargs(i, m[1], args)
      // arrays format = '--f=a b c'
      } else if (checkAllAliases(m[1], flags.arrays) && args.length > i + 1) {
        args.splice(i + 1, m[1], m[2])
        i = eatArray(i, m[1], args)
      } else {
        setArg(m[1], m[2])
      }
    } else if (arg.match(/^--no-.+/)) {
      key = arg.match(/^--no-(.+)/)[1]
      setArg(key, false)

    // -- seperated by space.
    } else if (arg.match(/^--.+/)) {
      key = arg.match(/^--(.+)/)[1]

      // nargs format = '--foo a b c'
      if (checkAllAliases(key, opts.narg)) {
        i = eatNargs(i, key, args)
      // array format = '--foo a b c'
      } else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) {
        i = eatArray(i, key, args)
      } else {
        next = args[i + 1]

        if (next !== undefined && !next.match(/^-/) &&
          !checkAllAliases(key, flags.bools) &&
          !checkAllAliases(key, flags.counts)) {
          setArg(key, next)
          i++
        } else if (/^(true|false)$/.test(next)) {
          setArg(key, next)
          i++
        } else {
          setArg(key, defaultForType(guessType(key, flags)))
        }
      }

    // dot-notation flag seperated by '='.
    } else if (arg.match(/^-.\..+=/)) {
      m = arg.match(/^-([^=]+)=([\s\S]*)$/)
      setArg(m[1], m[2])

    // dot-notation flag seperated by space.
    } else if (arg.match(/^-.\..+/)) {
      next = args[i + 1]
      key = arg.match(/^-(.\..+)/)[1]

      if (next !== undefined && !next.match(/^-/) &&
        !checkAllAliases(key, flags.bools) &&
        !checkAllAliases(key, flags.counts)) {
        setArg(key, next)
        i++
      } else {
        setArg(key, defaultForType(guessType(key, flags)))
      }
    } else if (arg.match(/^-[^-]+/)) {
      letters = arg.slice(1, -1).split('')
      broken = false

      for (var j = 0; j < letters.length; j++) {
        next = arg.slice(j + 2)

        if (letters[j + 1] && letters[j + 1] === '=') {
          value = arg.slice(j + 3)
          key = letters[j]

          // nargs format = '-f=monkey washing cat'
          if (checkAllAliases(letters[j], opts.narg)) {
            args.splice(i + 1, 0, value)
            i = eatNargs(i, key, args)
          // array format = '-f=a b c'
          } else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) {
            args.splice(i + 1, 0, value)
            i = eatArray(i, key, args)
          } else {
            setArg(key, value)
          }

          broken = true
          break
        }

        if (next === '-') {
          setArg(letters[j], next)
          continue
        }

        if (/[A-Za-z]/.test(letters[j]) &&
          /-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) {
          setArg(letters[j], next)
          broken = true
          break
        }

        if (letters[j + 1] && letters[j + 1].match(/\W/)) {
          setArg(letters[j], arg.slice(j + 2))
          broken = true
          break
        } else {
          setArg(letters[j], defaultForType(guessType(letters[j], flags)))
        }
      }

      key = arg.slice(-1)[0]

      if (!broken && key !== '-') {
        // nargs format = '-f a b c'
        if (checkAllAliases(key, opts.narg)) {
          i = eatNargs(i, key, args)
        // array format = '-f a b c'
        } else if (checkAllAliases(key, flags.arrays) && args.length > i + 1) {
          i = eatArray(i, key, args)
        } else {
          if (args[i + 1] && !/^(-|--)[^-]/.test(args[i + 1]) &&
            !checkAllAliases(key, flags.bools) &&
            !checkAllAliases(key, flags.counts)) {
            setArg(key, args[i + 1])
            i++
          } else if (args[i + 1] && /true|false/.test(args[i + 1])) {
            setArg(key, args[i + 1])
            i++
          } else {
            setArg(key, defaultForType(guessType(key, flags)))
          }
        }
      }
    } else {
      argv._.push(
        flags.strings['_'] || !isNumber(arg) ? arg : Number(arg)
      )
    }
  }

  // order of precedence:
  // 1. command line arg
  // 2. value from config file
  // 3. value from env var
  // 4. configured default value
  applyEnvVars(opts, argv, true) // special case: check env vars that point to config file
  setConfig(argv)
  applyEnvVars(opts, argv, false)
  applyDefaultsAndAliases(argv, aliases, defaults)

  Object.keys(flags.counts).forEach(function (key) {
    setArg(key, defaults[key])
  })

  notFlags.forEach(function (key) {
    argv._.push(key)
  })

  // how many arguments should we consume, based
  // on the nargs option?
  function eatNargs (i, key, args) {
    var toEat = checkAllAliases(key, opts.narg)

    if (args.length - (i + 1) < toEat) error = Error(__('Not enough arguments following: %s', key))

    for (var ii = i + 1; ii < (toEat + i + 1); ii++) {
      setArg(key, args[ii])
    }

    return (i + toEat)
  }

  // if an option is an array, eat all non-hyphenated arguments
  // following it... YUM!
  // e.g., --foo apple banana cat becomes ["apple", "banana", "cat"]
  function eatArray (i, key, args) {
    for (var ii = i + 1; ii < args.length; ii++) {
      if (/^-/.test(args[ii])) break
      i = ii
      setArg(key, args[ii])
    }

    return i
  }

  function setArg (key, val) {
    unsetDefaulted(key)

    // handle parsing boolean arguments --foo=true --bar false.
    if (checkAllAliases(key, flags.bools) || checkAllAliases(key, flags.counts)) {
      if (typeof val === 'string') val = val === 'true'
    }

    if (/-/.test(key) && !(aliases[key] && aliases[key].length)) {
      var c = camelCase(key)
      aliases[key] = [c]
      newAliases[c] = true
    }

    var value = !checkAllAliases(key, flags.strings) && isNumber(val) ? Number(val) : val

    if (checkAllAliases(key, flags.counts)) {
      value = increment
    }

    var splitKey = key.split('.')
    setKey(argv, splitKey, value)

    // alias references an inner-value within
    // a dot-notation object. see #279.
    if (~key.indexOf('.') && aliases[key]) {
      aliases[key].forEach(function (x) {
        x = x.split('.')
        setKey(argv, x, value)
      })
    }

    ;(aliases[splitKey[0]] || []).forEach(function (x) {
      x = x.split('.')

      // handle populating dot notation for both
      // the key and its aliases.
      if (splitKey.length > 1) {
        var a = [].concat(splitKey)
        a.shift() // nuke the old key.
        x = x.concat(a)
      }

      setKey(argv, x, value)
    })

    var keys = [key].concat(aliases[key] || [])
    for (var i = 0, l = keys.length; i < l; i++) {
      if (flags.normalize[keys[i]]) {
        keys.forEach(function (key) {
          argv.__defineSetter__(key, function (v) {
            val = path.normalize(v)
          })

          argv.__defineGetter__(key, function () {
            return typeof val === 'string' ? path.normalize(val) : val
          })
        })
        break
      }
    }
  }

  // set args from config.json file, this should be
  // applied last so that defaults can be applied.
  function setConfig (argv) {
    var configLookup = {}

    // expand defaults/aliases, in-case any happen to reference
    // the config.json file.
    applyDefaultsAndAliases(configLookup, aliases, defaults)

    Object.keys(flags.configs).forEach(function (configKey) {
      var configPath = argv[configKey] || configLookup[configKey]
      if (configPath) {
        try {
          var config = null
          var resolvedConfigPath = path.resolve(process.cwd(), configPath)

          if (typeof flags.configs[configKey] === 'function') {
            try {
              config = flags.configs[configKey](resolvedConfigPath)
            } catch (e) {
              config = e
            }
            if (config instanceof Error) {
              error = config
              return
            }
          } else {
            config = !(function webpackMissingModule() { var e = new Error("Cannot find module \".\""); e.code = 'MODULE_NOT_FOUND'; throw e; }())
          }

          Object.keys(config).forEach(function (key) {
            // setting arguments via CLI takes precedence over
            // values within the config file.
            if (argv[key] === undefined || (flags.defaulted[key])) {
              delete argv[key]
              setArg(key, config[key])
            }
          })
        } catch (ex) {
          if (argv[configKey]) error = Error(__('Invalid JSON config file: %s', configPath))
        }
      }
    })
  }

  function applyEnvVars (opts, argv, configOnly) {
    if (typeof opts.envPrefix === 'undefined') return

    var prefix = typeof opts.envPrefix === 'string' ? opts.envPrefix : ''
    Object.keys(process.env).forEach(function (envVar) {
      if (prefix === '' || envVar.lastIndexOf(prefix, 0) === 0) {
        var key = camelCase(envVar.substring(prefix.length))
        if (((configOnly && flags.configs[key]) || !configOnly) && (!(key in argv) || flags.defaulted[key])) {
          setArg(key, process.env[envVar])
        }
      }
    })
  }

  function applyDefaultsAndAliases (obj, aliases, defaults) {
    Object.keys(defaults).forEach(function (key) {
      if (!hasKey(obj, key.split('.'))) {
        setKey(obj, key.split('.'), defaults[key])

        ;(aliases[key] || []).forEach(function (x) {
          if (hasKey(obj, x.split('.'))) return
          setKey(obj, x.split('.'), defaults[key])
        })
      }
    })
  }

  function hasKey (obj, keys) {
    var o = obj
    keys.slice(0, -1).forEach(function (key) {
      o = (o[key] || {})
    })

    var key = keys[keys.length - 1]

    if (typeof o !== 'object') return false
    else return key in o
  }

  function setKey (obj, keys, value) {
    var o = obj
    keys.slice(0, -1).forEach(function (key) {
      if (o[key] === undefined) o[key] = {}
      o = o[key]
    })

    var key = keys[keys.length - 1]
    if (value === increment) {
      o[key] = increment(o[key])
    } else if (o[key] === undefined && checkAllAliases(key, flags.arrays)) {
      o[key] = Array.isArray(value) ? value : [value]
    } else if (o[key] === undefined || typeof o[key] === 'boolean') {
      o[key] = value
    } else if (Array.isArray(o[key])) {
      o[key].push(value)
    } else {
      o[key] = [ o[key], value ]
    }
  }

  // extend the aliases list with inferred aliases.
  function extendAliases (obj) {
    Object.keys(obj || {}).forEach(function (key) {
      // short-circuit if we've already added a key
      // to the aliases array, for example it might
      // exist in both 'opts.default' and 'opts.key'.
      if (aliases[key]) return

      aliases[key] = [].concat(opts.alias[key] || [])
      // For "--option-name", also set argv.optionName
      aliases[key].concat(key).forEach(function (x) {
        if (/-/.test(x)) {
          var c = camelCase(x)
          aliases[key].push(c)
          newAliases[c] = true
        }
      })
      aliases[key].forEach(function (x) {
        aliases[x] = [key].concat(aliases[key].filter(function (y) {
          return x !== y
        }))
      })
    })
  }

  // check if a flag is set for any of a key's aliases.
  function checkAllAliases (key, flag) {
    var isSet = false
    var toCheck = [].concat(aliases[key] || [], key)

    toCheck.forEach(function (key) {
      if (flag[key]) isSet = flag[key]
    })

    return isSet
  }

  function setDefaulted (key) {
    [].concat(aliases[key] || [], key).forEach(function (k) {
      flags.defaulted[k] = true
    })
  }

  function unsetDefaulted (key) {
    [].concat(aliases[key] || [], key).forEach(function (k) {
      delete flags.defaulted[k]
    })
  }

  // return a default value, given the type of a flag.,
  // e.g., key of type 'string' will default to '', rather than 'true'.
  function defaultForType (type) {
    var def = {
      boolean: true,
      string: '',
      array: []
    }

    return def[type]
  }

  // given a flag, enforce a default type.
  function guessType (key, flags) {
    var type = 'boolean'

    if (flags.strings && flags.strings[key]) type = 'string'
    else if (flags.arrays && flags.arrays[key]) type = 'array'

    return type
  }

  function isNumber (x) {
    if (typeof x === 'number') return true
    if (/^0x[0-9a-f]+$/i.test(x)) return true
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x)
  }

  return {
    argv: argv,
    aliases: aliases,
    error: error,
    newAliases: newAliases
  }
}


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function preserveCamelCase(str) {
	var isLastCharLower = false;

	for (var i = 0; i < str.length; i++) {
		var c = str.charAt(i);

		if (isLastCharLower && (/[a-zA-Z]/).test(c) && c.toUpperCase() === c) {
			str = str.substr(0, i) + '-' + str.substr(i);
			isLastCharLower = false;
			i++;
		} else {
			isLastCharLower = (c.toLowerCase() === c);
		}
	}

	return str;
}

module.exports = function () {
	var str = [].map.call(arguments, function (str) {
		return str.trim();
	}).filter(function (str) {
		return str.length;
	}).join('-');

	if (!str.length) {
		return '';
	}

	if (str.length === 1) {
		return str;
	}

	if (!(/[_.\- ]+/).test(str)) {
		if (str === str.toUpperCase()) {
			return str.toLowerCase();
		}

		if (str[0] !== str[0].toLowerCase()) {
			return str[0].toLowerCase() + str.slice(1);
		}

		return str;
	}

	str = preserveCamelCase(str);

	return str
	.replace(/^[_.\- ]+/, '')
	.toLowerCase()
	.replace(/[_.\- ]+(\w|$)/g, function (m, p1) {
		return p1.toUpperCase();
	});
};


/***/ }),
/* 44 */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 44;

/***/ }),
/* 45 */
/***/ (function(module, exports) {

// take an un-split argv string and tokenize it.
module.exports = function (argString) {
  var i = 0
  var c = null
  var opening = null
  var args = []

  for (var ii = 0; ii < argString.length; ii++) {
    c = argString.charAt(ii)

    // split on spaces unless we're in quotes.
    if (c === ' ' && !opening) {
      i++
      continue
    }

    // don't split the string if we're in matching
    // opening or closing single and double quotes.
    if (c === opening) {
      opening = null
      continue
    } else if ((c === "'" || c === '"') && !opening) {
      opening = c
      continue
    }

    if (!args[i]) args[i] = ''
    args[i] += c
  }

  return args
}


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// this file handles outputting usage instructions,
// failures, etc. keeps logging in one place.
var cliui = __webpack_require__(47)
var decamelize = __webpack_require__(53)
var stringWidth = __webpack_require__(9)
var wsize = __webpack_require__(17)

module.exports = function (yargs, y18n) {
  var __ = y18n.__
  var self = {}

  // methods for ouputting/building failure message.
  var fails = []
  self.failFn = function (f) {
    fails.push(f)
  }

  var failMessage = null
  var showHelpOnFail = true
  self.showHelpOnFail = function (enabled, message) {
    if (typeof enabled === 'string') {
      message = enabled
      enabled = true
    } else if (typeof enabled === 'undefined') {
      enabled = true
    }
    failMessage = message
    showHelpOnFail = enabled
    return self
  }

  var failureOutput = false
  self.fail = function (msg) {
    if (fails.length) {
      fails.forEach(function (f) {
        f(msg)
      })
    } else {
      // don't output failure message more than once
      if (!failureOutput) {
        failureOutput = true
        if (showHelpOnFail) yargs.showHelp('error')
        if (msg) console.error(msg)
        if (failMessage) {
          if (msg) console.error('')
          console.error(failMessage)
        }
      }
      if (yargs.getExitProcess()) {
        process.exit(1)
      } else {
        throw new Error(msg)
      }
    }
  }

  // methods for ouputting/building help (usage) message.
  var usage
  self.usage = function (msg) {
    usage = msg
  }

  var examples = []
  self.example = function (cmd, description) {
    examples.push([cmd, description || ''])
  }

  var commands = []
  self.command = function (cmd, description) {
    commands.push([cmd, description || ''])
  }
  self.getCommands = function () {
    return commands
  }

  var descriptions = {}
  self.describe = function (key, desc) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(function (k) {
        self.describe(k, key[k])
      })
    } else {
      descriptions[key] = desc
    }
  }
  self.getDescriptions = function () {
    return descriptions
  }

  var epilog
  self.epilog = function (msg) {
    epilog = msg
  }

  var wrap = windowWidth()
  self.wrap = function (cols) {
    wrap = cols
  }

  var deferY18nLookupPrefix = '__yargsString__:'
  self.deferY18nLookup = function (str) {
    return deferY18nLookupPrefix + str
  }

  var defaultGroup = 'Options:'
  self.help = function () {
    normalizeAliases()

    var demanded = yargs.getDemanded()
    var groups = yargs.getGroups()
    var options = yargs.getOptions()
    var keys = Object.keys(
      Object.keys(descriptions)
      .concat(Object.keys(demanded))
      .concat(Object.keys(options.default))
      .reduce(function (acc, key) {
        if (key !== '_') acc[key] = true
        return acc
      }, {})
    )
    var ui = cliui({
      width: wrap,
      wrap: !!wrap
    })

    // the usage string.
    if (usage) {
      var u = usage.replace(/\$0/g, yargs.$0)
      ui.div(u + '\n')
    }

    // your application's commands, i.e., non-option
    // arguments populated in '_'.
    if (commands.length) {
      ui.div(__('Commands:'))

      commands.forEach(function (command) {
        ui.div(
          {text: command[0], padding: [0, 2, 0, 2], width: maxWidth(commands) + 4},
          {text: command[1]}
        )
      })

      ui.div()
    }

    // perform some cleanup on the keys array, making it
    // only include top-level keys not their aliases.
    var aliasKeys = (Object.keys(options.alias) || [])
      .concat(Object.keys(yargs.parsed.newAliases) || [])

    keys = keys.filter(function (key) {
      return !yargs.parsed.newAliases[key] && aliasKeys.every(function (alias) {
        return (options.alias[alias] || []).indexOf(key) === -1
      })
    })

    // populate 'Options:' group with any keys that have not
    // explicitly had a group set.
    if (!groups[defaultGroup]) groups[defaultGroup] = []
    addUngroupedKeys(keys, options.alias, groups)

    // display 'Options:' table along with any custom tables:
    Object.keys(groups).forEach(function (groupName) {
      if (!groups[groupName].length) return

      ui.div(__(groupName))

      // if we've grouped the key 'f', but 'f' aliases 'foobar',
      // normalizedKeys should contain only 'foobar'.
      var normalizedKeys = groups[groupName].map(function (key) {
        if (~aliasKeys.indexOf(key)) return key
        for (var i = 0, aliasKey; (aliasKey = aliasKeys[i]) !== undefined; i++) {
          if (~(options.alias[aliasKey] || []).indexOf(key)) return aliasKey
        }
        return key
      })

      // actually generate the switches string --foo, -f, --bar.
      var switches = normalizedKeys.reduce(function (acc, key) {
        acc[key] = [ key ].concat(options.alias[key] || [])
          .map(function (sw) {
            return (sw.length > 1 ? '--' : '-') + sw
          })
          .join(', ')

        return acc
      }, {})

      normalizedKeys.forEach(function (key) {
        var kswitch = switches[key]
        var desc = descriptions[key] || ''
        var type = null

        if (~desc.lastIndexOf(deferY18nLookupPrefix)) desc = __(desc.substring(deferY18nLookupPrefix.length))

        if (~options.boolean.indexOf(key)) type = '[' + __('boolean') + ']'
        if (~options.count.indexOf(key)) type = '[' + __('count') + ']'
        if (~options.string.indexOf(key)) type = '[' + __('string') + ']'
        if (~options.normalize.indexOf(key)) type = '[' + __('string') + ']'
        if (~options.array.indexOf(key)) type = '[' + __('array') + ']'

        var extra = [
          type,
          demanded[key] ? '[' + __('required') + ']' : null,
          options.choices && options.choices[key] ? '[' + __('choices:') + ' ' +
            self.stringifiedValues(options.choices[key]) + ']' : null,
          defaultString(options.default[key], options.defaultDescription[key])
        ].filter(Boolean).join(' ')

        ui.span(
          {text: kswitch, padding: [0, 2, 0, 2], width: maxWidth(switches) + 4},
          desc
        )

        if (extra) ui.div({text: extra, padding: [0, 0, 0, 2], align: 'right'})
        else ui.div()
      })

      ui.div()
    })

    // describe some common use-cases for your application.
    if (examples.length) {
      ui.div(__('Examples:'))

      examples.forEach(function (example) {
        example[0] = example[0].replace(/\$0/g, yargs.$0)
      })

      examples.forEach(function (example) {
        ui.div(
          {text: example[0], padding: [0, 2, 0, 2], width: maxWidth(examples) + 4},
          example[1]
        )
      })

      ui.div()
    }

    // the usage string.
    if (epilog) {
      var e = epilog.replace(/\$0/g, yargs.$0)
      ui.div(e + '\n')
    }

    return ui.toString()
  }

  // return the maximum width of a string
  // in the left-hand column of a table.
  function maxWidth (table) {
    var width = 0

    // table might be of the form [leftColumn],
    // or {key: leftColumn}}
    if (!Array.isArray(table)) {
      table = Object.keys(table).map(function (key) {
        return [table[key]]
      })
    }

    table.forEach(function (v) {
      width = Math.max(stringWidth(v[0]), width)
    })

    // if we've enabled 'wrap' we should limit
    // the max-width of the left-column.
    if (wrap) width = Math.min(width, parseInt(wrap * 0.5, 10))

    return width
  }

  // make sure any options set for aliases,
  // are copied to the keys being aliased.
  function normalizeAliases () {
    var demanded = yargs.getDemanded()
    var options = yargs.getOptions()

    ;(Object.keys(options.alias) || []).forEach(function (key) {
      options.alias[key].forEach(function (alias) {
        // copy descriptions.
        if (descriptions[alias]) self.describe(key, descriptions[alias])
        // copy demanded.
        if (demanded[alias]) yargs.demand(key, demanded[alias].msg)
        // type messages.
        if (~options.boolean.indexOf(alias)) yargs.boolean(key)
        if (~options.count.indexOf(alias)) yargs.count(key)
        if (~options.string.indexOf(alias)) yargs.string(key)
        if (~options.normalize.indexOf(alias)) yargs.normalize(key)
        if (~options.array.indexOf(alias)) yargs.array(key)
      })
    })
  }

  // given a set of keys, place any keys that are
  // ungrouped under the 'Options:' grouping.
  function addUngroupedKeys (keys, aliases, groups) {
    var groupedKeys = []
    var toCheck = null
    Object.keys(groups).forEach(function (group) {
      groupedKeys = groupedKeys.concat(groups[group])
    })

    keys.forEach(function (key) {
      toCheck = [key].concat(aliases[key])
      if (!toCheck.some(function (k) {
        return groupedKeys.indexOf(k) !== -1
      })) {
        groups[defaultGroup].push(key)
      }
    })
    return groupedKeys
  }

  self.showHelp = function (level) {
    level = level || 'error'
    console[level](self.help())
  }

  self.functionDescription = function (fn) {
    var description = fn.name ? decamelize(fn.name, '-') : __('generated-value')
    return ['(', description, ')'].join('')
  }

  self.stringifiedValues = function (values, separator) {
    var string = ''
    var sep = separator || ', '
    var array = [].concat(values)

    if (!values || !array.length) return string

    array.forEach(function (value) {
      if (string.length) string += sep
      string += JSON.stringify(value)
    })

    return string
  }

  // format the default-value-string displayed in
  // the right-hand column.
  function defaultString (value, defaultDescription) {
    var string = '[' + __('default:') + ' '

    if (value === undefined && !defaultDescription) return null

    if (defaultDescription) {
      string += defaultDescription
    } else {
      switch (typeof value) {
        case 'string':
          string += JSON.stringify(value)
          break
        case 'object':
          string += JSON.stringify(value)
          break
        default:
          string += value
      }
    }

    return string + ']'
  }

  // guess the width of the console window, max-width 80.
  function windowWidth () {
    return wsize.width ? Math.min(80, wsize.width) : null
  }

  // logic for displaying application version.
  var version = null
  self.version = function (ver, opt, msg) {
    version = ver
  }

  self.showVersion = function () {
    if (typeof version === 'function') console.log(version())
    else console.log(version)
  }

  return self
}


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var stringWidth = __webpack_require__(9)
var stripAnsi = __webpack_require__(10)
var wrap = __webpack_require__(52)
var align = {
  right: alignRight,
  center: alignCenter
}
var top = 0
var right = 1
var bottom = 2
var left = 3

function UI (opts) {
  this.width = opts.width
  this.wrap = opts.wrap
  this.rows = []
}

UI.prototype.span = function () {
  var cols = this.div.apply(this, arguments)
  cols.span = true
}

UI.prototype.div = function () {
  if (arguments.length === 0) this.div('')
  if (this.wrap && this._shouldApplyLayoutDSL.apply(this, arguments)) {
    return this._applyLayoutDSL(arguments[0])
  }

  var cols = []

  for (var i = 0, arg; (arg = arguments[i]) !== undefined; i++) {
    if (typeof arg === 'string') cols.push(this._colFromString(arg))
    else cols.push(arg)
  }

  this.rows.push(cols)
  return cols
}

UI.prototype._shouldApplyLayoutDSL = function () {
  return arguments.length === 1 && typeof arguments[0] === 'string' &&
    /[\t\n]/.test(arguments[0])
}

UI.prototype._applyLayoutDSL = function (str) {
  var _this = this
  var rows = str.split('\n')
  var leftColumnWidth = 0

  // simple heuristic for layout, make sure the
  // second column lines up along the left-hand.
  // don't allow the first column to take up more
  // than 50% of the screen.
  rows.forEach(function (row) {
    var columns = row.split('\t')
    if (columns.length > 1 && stringWidth(columns[0]) > leftColumnWidth) {
      leftColumnWidth = Math.min(
        Math.floor(_this.width * 0.5),
        stringWidth(columns[0])
      )
    }
  })

  // generate a table:
  //  replacing ' ' with padding calculations.
  //  using the algorithmically generated width.
  rows.forEach(function (row) {
    var columns = row.split('\t')
    _this.div.apply(_this, columns.map(function (r, i) {
      return {
        text: r.trim(),
        padding: _this._measurePadding(r),
        width: (i === 0 && columns.length > 1) ? leftColumnWidth : undefined
      }
    }))
  })

  return this.rows[this.rows.length - 1]
}

UI.prototype._colFromString = function (str) {
  return {
    text: str,
    padding: this._measurePadding(str)
  }
}

UI.prototype._measurePadding = function (str) {
  // measure padding without ansi escape codes
  var noAnsi = stripAnsi(str)
  return [0, noAnsi.match(/\s*$/)[0].length, 0, noAnsi.match(/^\s*/)[0].length]
}

UI.prototype.toString = function () {
  var _this = this
  var lines = []

  _this.rows.forEach(function (row, i) {
    _this.rowToString(row, lines)
  })

  // don't display any lines with the
  // hidden flag set.
  lines = lines.filter(function (line) {
    return !line.hidden
  })

  return lines.map(function (line) {
    return line.text
  }).join('\n')
}

UI.prototype.rowToString = function (row, lines) {
  var _this = this
  var padding
  var rrows = this._rasterize(row)
  var str = ''
  var ts
  var width
  var wrapWidth

  rrows.forEach(function (rrow, r) {
    str = ''
    rrow.forEach(function (col, c) {
      ts = '' // temporary string used during alignment/padding.
      width = row[c].width // the width with padding.
      wrapWidth = _this._negatePadding(row[c]) // the width without padding.

      ts += col

      for (var i = 0; i < wrapWidth - stringWidth(col); i++) {
        ts += ' '
      }

      // align the string within its column.
      if (row[c].align && row[c].align !== 'left' && _this.wrap) {
        ts = align[row[c].align](ts, wrapWidth)
        if (stringWidth(ts) < wrapWidth) ts += new Array(width - stringWidth(ts)).join(' ')
      }

      // apply border and padding to string.
      padding = row[c].padding || [0, 0, 0, 0]
      if (padding[left]) str += new Array(padding[left] + 1).join(' ')
      str += addBorder(row[c], ts, '| ')
      str += ts
      str += addBorder(row[c], ts, ' |')
      if (padding[right]) str += new Array(padding[right] + 1).join(' ')

      // if prior row is span, try to render the
      // current row on the prior line.
      if (r === 0 && lines.length > 0) {
        str = _this._renderInline(str, lines[lines.length - 1])
      }
    })

    // remove trailing whitespace.
    lines.push({
      text: str.replace(/ +$/, ''),
      span: row.span
    })
  })

  return lines
}

function addBorder (col, ts, style) {
  if (col.border) {
    if (/[.']-+[.']/.test(ts)) return ''
    else if (ts.trim().length) return style
    else return '  '
  }
  return ''
}

// if the full 'source' can render in
// the target line, do so.
UI.prototype._renderInline = function (source, previousLine) {
  var leadingWhitespace = source.match(/^ */)[0].length
  var target = previousLine.text
  var targetTextWidth = stringWidth(target.trimRight())

  if (!previousLine.span) return source

  // if we're not applying wrapping logic,
  // just always append to the span.
  if (!this.wrap) {
    previousLine.hidden = true
    return target + source
  }

  if (leadingWhitespace < targetTextWidth) return source

  previousLine.hidden = true

  return target.trimRight() + new Array(leadingWhitespace - targetTextWidth + 1).join(' ') + source.trimLeft()
}

UI.prototype._rasterize = function (row) {
  var _this = this
  var i
  var rrow
  var rrows = []
  var widths = this._columnWidths(row)
  var wrapped

  // word wrap all columns, and create
  // a data-structure that is easy to rasterize.
  row.forEach(function (col, c) {
    // leave room for left and right padding.
    col.width = widths[c]
    if (_this.wrap) wrapped = wrap(col.text, _this._negatePadding(col), {hard: true}).split('\n')
    else wrapped = col.text.split('\n')

    if (col.border) {
      wrapped.unshift('.' + new Array(_this._negatePadding(col) + 3).join('-') + '.')
      wrapped.push("'" + new Array(_this._negatePadding(col) + 3).join('-') + "'")
    }

    // add top and bottom padding.
    if (col.padding) {
      for (i = 0; i < (col.padding[top] || 0); i++) wrapped.unshift('')
      for (i = 0; i < (col.padding[bottom] || 0); i++) wrapped.push('')
    }

    wrapped.forEach(function (str, r) {
      if (!rrows[r]) rrows.push([])

      rrow = rrows[r]

      for (var i = 0; i < c; i++) {
        if (rrow[i] === undefined) rrow.push('')
      }
      rrow.push(str)
    })
  })

  return rrows
}

UI.prototype._negatePadding = function (col) {
  var wrapWidth = col.width
  if (col.padding) wrapWidth -= (col.padding[left] || 0) + (col.padding[right] || 0)
  if (col.border) wrapWidth -= 4
  return wrapWidth
}

UI.prototype._columnWidths = function (row) {
  var _this = this
  var widths = []
  var unset = row.length
  var unsetWidth
  var remainingWidth = this.width

  // column widths can be set in config.
  row.forEach(function (col, i) {
    if (col.width) {
      unset--
      widths[i] = col.width
      remainingWidth -= col.width
    } else {
      widths[i] = undefined
    }
  })

  // any unset widths should be calculated.
  if (unset) unsetWidth = Math.floor(remainingWidth / unset)
  widths.forEach(function (w, i) {
    if (!_this.wrap) widths[i] = row[i].width || stringWidth(row[i].text)
    else if (w === undefined) widths[i] = Math.max(unsetWidth, _minWidth(row[i]))
  })

  return widths
}

// calculates the minimum width of
// a column, based on padding preferences.
function _minWidth (col) {
  var padding = col.padding || []
  var minWidth = 1 + (padding[left] || 0) + (padding[right] || 0)
  if (col.border) minWidth += 4
  return minWidth
}

function alignRight (str, width) {
  str = str.trim()
  var padding = ''
  var strWidth = stringWidth(str)

  if (strWidth < width) {
    padding = new Array(width - strWidth + 1).join(' ')
  }

  return padding + str
}

function alignCenter (str, width) {
  str = str.trim()
  var padding = ''
  var strWidth = stringWidth(str.trim())

  if (strWidth < width) {
    padding = new Array(parseInt((width - strWidth) / 2, 10) + 1).join(' ')
  }

  return padding + str
}

module.exports = function (opts) {
  opts = opts || {}

  return new UI({
    width: (opts || {}).width || 80,
    wrap: typeof opts.wrap === 'boolean' ? opts.wrap : true
  })
}


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable babel/new-cap, xo/throw-new-error */

module.exports = function (str, pos) {
	if (str === null || str === undefined) {
		throw TypeError();
	}

	str = String(str);

	var size = str.length;
	var i = pos ? Number(pos) : 0;

	if (Number.isNaN(i)) {
		i = 0;
	}

	if (i < 0 || i >= size) {
		return undefined;
	}

	var first = str.charCodeAt(i);

	if (first >= 0xD800 && first <= 0xDBFF && size > i + 1) {
		var second = str.charCodeAt(i + 1);

		if (second >= 0xDC00 && second <= 0xDFFF) {
			return ((first - 0xD800) * 0x400) + second - 0xDC00 + 0x10000;
		}
	}

	return first;
};


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var numberIsNan = __webpack_require__(51);

module.exports = function (x) {
	if (numberIsNan(x)) {
		return false;
	}

	// https://github.com/nodejs/io.js/blob/cff7300a578be1b10001f2d967aaedc88aee6402/lib/readline.js#L1369

	// code points are derived from:
	// http://www.unix.org/Public/UNIDATA/EastAsianWidth.txt
	if (x >= 0x1100 && (
		x <= 0x115f ||  // Hangul Jamo
		0x2329 === x || // LEFT-POINTING ANGLE BRACKET
		0x232a === x || // RIGHT-POINTING ANGLE BRACKET
		// CJK Radicals Supplement .. Enclosed CJK Letters and Months
		(0x2e80 <= x && x <= 0x3247 && x !== 0x303f) ||
		// Enclosed CJK Letters and Months .. CJK Unified Ideographs Extension A
		0x3250 <= x && x <= 0x4dbf ||
		// CJK Unified Ideographs .. Yi Radicals
		0x4e00 <= x && x <= 0xa4c6 ||
		// Hangul Jamo Extended-A
		0xa960 <= x && x <= 0xa97c ||
		// Hangul Syllables
		0xac00 <= x && x <= 0xd7a3 ||
		// CJK Compatibility Ideographs
		0xf900 <= x && x <= 0xfaff ||
		// Vertical Forms
		0xfe10 <= x && x <= 0xfe19 ||
		// CJK Compatibility Forms .. Small Form Variants
		0xfe30 <= x && x <= 0xfe6b ||
		// Halfwidth and Fullwidth Forms
		0xff01 <= x && x <= 0xff60 ||
		0xffe0 <= x && x <= 0xffe6 ||
		// Kana Supplement
		0x1b000 <= x && x <= 0x1b001 ||
		// Enclosed Ideographic Supplement
		0x1f200 <= x && x <= 0x1f251 ||
		// CJK Unified Ideographs Extension B .. Tertiary Ideographic Plane
		0x20000 <= x && x <= 0x3fffd)) {
		return true;
	}

	return false;
}


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = Number.isNaN || function (x) {
	return x !== x;
};


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var stringWidth = __webpack_require__(9);
var stripAnsi = __webpack_require__(10);

var ESCAPES = [
	'\u001b',
	'\u009b'
];

var END_CODE = 39;

var ESCAPE_CODES = {
	0: 0,
	1: 22,
	2: 22,
	3: 23,
	4: 24,
	7: 27,
	8: 28,
	9: 29,
	30: 39,
	31: 39,
	32: 39,
	33: 39,
	34: 39,
	35: 39,
	36: 39,
	37: 39,
	90: 39,
	40: 49,
	41: 49,
	42: 49,
	43: 49,
	44: 49,
	45: 49,
	46: 49,
	47: 49
};

function wrapAnsi(code) {
	return ESCAPES[0] + '[' + code + 'm';
}

// calculate the length of words split on ' ', ignoring
// the extra characters added by ansi escape codes.
function wordLengths(str) {
	return str.split(' ').map(function (s) {
		return stringWidth(s);
	});
}

// wrap a long word across multiple rows.
// ansi escape codes do not count towards length.
function wrapWord(rows, word, cols) {
	var insideEscape = false;
	var visible = stripAnsi(rows[rows.length - 1]).length;

	for (var i = 0; i < word.length; i++) {
		var x = word[i];

		rows[rows.length - 1] += x;

		if (ESCAPES.indexOf(x) !== -1) {
			insideEscape = true;
		} else if (insideEscape && x === 'm') {
			insideEscape = false;
			continue;
		}

		if (insideEscape) {
			continue;
		}

		visible++;

		if (visible >= cols && i < word.length - 1) {
			rows.push('');
			visible = 0;
		}
	}

	// it's possible that the last row we copy over is only
	// ansi escape characters, handle this edge-case.
	if (!visible && rows[rows.length - 1].length > 0 && rows.length > 1) {
		rows[rows.length - 2] += rows.pop();
	}
}

// the wrap-ansi module can be invoked
// in either 'hard' or 'soft' wrap mode.
//
// 'hard' will never allow a string to take up more
// than cols characters.
//
// 'soft' allows long words to expand past the column length.
function exec(str, cols, opts) {
	var options = opts || {};

	var pre = '';
	var ret = '';
	var escapeCode;

	var lengths = wordLengths(str);
	var words = str.split(' ');
	var rows = [''];

	for (var i = 0, word; (word = words[i]) !== undefined; i++) {
		var rowLength = stringWidth(rows[rows.length - 1]);

		if (rowLength) {
			rows[rows.length - 1] += ' ';
			rowLength++;
		}

		// in 'hard' wrap mode, the length of a line is
		// never allowed to extend past 'cols'.
		if (lengths[i] > cols && options.hard) {
			if (rowLength) {
				rows.push('');
			}
			wrapWord(rows, word, cols);
			continue;
		}

		if (rowLength + lengths[i] > cols && rowLength > 0) {
			if (options.wordWrap === false && rowLength < cols) {
				wrapWord(rows, word, cols);
				continue;
			}

			rows.push('');
		}

		rows[rows.length - 1] += word;
	}

	pre = rows.map(function (r) {
		return r.trim();
	}).join('\n');

	for (var j = 0; j < pre.length; j++) {
		var y = pre[j];

		ret += y;

		if (ESCAPES.indexOf(y) !== -1) {
			var code = parseFloat(/[0-9][^m]*/.exec(pre.slice(j, j + 4)));
			escapeCode = code === END_CODE ? null : code;
		}

		if (escapeCode && ESCAPE_CODES[escapeCode]) {
			if (pre[j + 1] === '\n') {
				ret += wrapAnsi(ESCAPE_CODES[escapeCode]);
			} else if (y === '\n') {
				ret += wrapAnsi(escapeCode);
			}
		}
	}

	return ret;
}

// for each line break, invoke the method separately.
module.exports = function (str, cols, opts) {
	return String(str).split('\n').map(function (substr) {
		return exec(substr, cols, opts);
	}).join('\n');
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str, sep) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	sep = typeof sep === 'undefined' ? '_' : sep;

	return str
		.replace(/([a-z\d])([A-Z])/g, '$1' + sep + '$2')
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, '$1' + sep + '$2')
		.toLowerCase();
};


/***/ }),
/* 54 */
/***/ (function(module, exports) {

module.exports = require("tty");

/***/ }),
/* 55 */
/***/ (function(module, exports) {

// validation-type-stuff, missing params,
// bad implications, custom checks.
module.exports = function (yargs, usage, y18n) {
  var __ = y18n.__
  var __n = y18n.__n
  var self = {}

  // validate appropriate # of non-option
  // arguments were provided, i.e., '_'.
  self.nonOptionCount = function (argv) {
    var demanded = yargs.getDemanded()
    var _s = argv._.length

    if (demanded._ && (_s < demanded._.count || _s > demanded._.max)) {
      if (demanded._.msg !== undefined) {
        usage.fail(demanded._.msg)
      } else if (_s < demanded._.count) {
        usage.fail(
          __('Not enough non-option arguments: got %s, need at least %s', argv._.length, demanded._.count)
        )
      } else {
        usage.fail(
          __('Too many non-option arguments: got %s, maximum of %s', argv._.length, demanded._.max)
        )
      }
    }
  }

  // make sure that any args that require an
  // value (--foo=bar), have a value.
  self.missingArgumentValue = function (argv) {
    var defaultValues = [true, false, '']
    var options = yargs.getOptions()

    if (options.requiresArg.length > 0) {
      var missingRequiredArgs = []

      options.requiresArg.forEach(function (key) {
        var value = argv[key]

        // if a value is explicitly requested,
        // flag argument as missing if it does not
        // look like foo=bar was entered.
        if (~defaultValues.indexOf(value) ||
          (Array.isArray(value) && !value.length)) {
          missingRequiredArgs.push(key)
        }
      })

      if (missingRequiredArgs.length > 0) {
        usage.fail(__n(
          'Missing argument value: %s',
          'Missing argument values: %s',
          missingRequiredArgs.length,
          missingRequiredArgs.join(', ')
        ))
      }
    }
  }

  // make sure all the required arguments are present.
  self.requiredArguments = function (argv) {
    var demanded = yargs.getDemanded()
    var missing = null

    Object.keys(demanded).forEach(function (key) {
      if (!argv.hasOwnProperty(key)) {
        missing = missing || {}
        missing[key] = demanded[key]
      }
    })

    if (missing) {
      var customMsgs = []
      Object.keys(missing).forEach(function (key) {
        var msg = missing[key].msg
        if (msg && customMsgs.indexOf(msg) < 0) {
          customMsgs.push(msg)
        }
      })

      var customMsg = customMsgs.length ? '\n' + customMsgs.join('\n') : ''

      usage.fail(__n(
        'Missing required argument: %s',
        'Missing required arguments: %s',
        Object.keys(missing).length,
        Object.keys(missing).join(', ') + customMsg
      ))
    }
  }

  // check for unknown arguments (strict-mode).
  self.unknownArguments = function (argv, aliases) {
    var aliasLookup = {}
    var descriptions = usage.getDescriptions()
    var demanded = yargs.getDemanded()
    var unknown = []

    Object.keys(aliases).forEach(function (key) {
      aliases[key].forEach(function (alias) {
        aliasLookup[alias] = key
      })
    })

    Object.keys(argv).forEach(function (key) {
      if (key !== '$0' && key !== '_' &&
        !descriptions.hasOwnProperty(key) &&
        !demanded.hasOwnProperty(key) &&
        !aliasLookup.hasOwnProperty(key)) {
        unknown.push(key)
      }
    })

    if (unknown.length > 0) {
      usage.fail(__n(
        'Unknown argument: %s',
        'Unknown arguments: %s',
        unknown.length,
        unknown.join(', ')
      ))
    }
  }

  // validate arguments limited to enumerated choices
  self.limitedChoices = function (argv) {
    var options = yargs.getOptions()
    var invalid = {}

    if (!Object.keys(options.choices).length) return

    Object.keys(argv).forEach(function (key) {
      if (key !== '$0' && key !== '_' &&
        options.choices.hasOwnProperty(key)) {
        [].concat(argv[key]).forEach(function (value) {
          // TODO case-insensitive configurability
          if (options.choices[key].indexOf(value) === -1) {
            invalid[key] = (invalid[key] || []).concat(value)
          }
        })
      }
    })

    var invalidKeys = Object.keys(invalid)

    if (!invalidKeys.length) return

    var msg = __('Invalid values:')
    invalidKeys.forEach(function (key) {
      msg += '\n  ' + __(
        'Argument: %s, Given: %s, Choices: %s',
        key,
        usage.stringifiedValues(invalid[key]),
        usage.stringifiedValues(options.choices[key])
      )
    })
    usage.fail(msg)
  }

  // custom checks, added using the `check` option on yargs.
  var checks = []
  self.check = function (f) {
    checks.push(f)
  }

  self.customChecks = function (argv, aliases) {
    checks.forEach(function (f) {
      try {
        var result = f(argv, aliases)
        if (!result) {
          usage.fail(__('Argument check failed: %s', f.toString()))
        } else if (typeof result === 'string') {
          usage.fail(result)
        }
      } catch (err) {
        usage.fail(err.message ? err.message : err)
      }
    })
  }

  // check implications, argument foo implies => argument bar.
  var implied = {}
  self.implies = function (key, value) {
    if (typeof key === 'object') {
      Object.keys(key).forEach(function (k) {
        self.implies(k, key[k])
      })
    } else {
      implied[key] = value
    }
  }
  self.getImplied = function () {
    return implied
  }

  self.implications = function (argv) {
    var implyFail = []

    Object.keys(implied).forEach(function (key) {
      var num
      var origKey = key
      var value = implied[key]

      // convert string '1' to number 1
      num = Number(key)
      key = isNaN(num) ? key : num

      if (typeof key === 'number') {
        // check length of argv._
        key = argv._.length >= key
      } else if (key.match(/^--no-.+/)) {
        // check if key doesn't exist
        key = key.match(/^--no-(.+)/)[1]
        key = !argv[key]
      } else {
        // check if key exists
        key = argv[key]
      }

      num = Number(value)
      value = isNaN(num) ? value : num

      if (typeof value === 'number') {
        value = argv._.length >= value
      } else if (value.match(/^--no-.+/)) {
        value = value.match(/^--no-(.+)/)[1]
        value = !argv[value]
      } else {
        value = argv[value]
      }

      if (key && !value) {
        implyFail.push(origKey)
      }
    })

    if (implyFail.length) {
      var msg = __('Implications failed:') + '\n'

      implyFail.forEach(function (key) {
        msg += ('  ' + key + ' -> ' + implied[key])
      })

      usage.fail(msg)
    }
  }

  return self
}


/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(4)
var path = __webpack_require__(0)
var util = __webpack_require__(3)

function Y18N (opts) {
  // configurable options.
  opts = opts || {}
  this.directory = opts.directory || './locales'
  this.updateFiles = typeof opts.updateFiles === 'boolean' ? opts.updateFiles : true
  this.locale = opts.locale || 'en'
  this.fallbackToLanguage = typeof opts.fallbackToLanguage === 'boolean' ? opts.fallbackToLanguage : true

  // internal stuff.
  this.cache = {}
  this.writeQueue = []
}

Y18N.prototype.__ = function () {
  var args = Array.prototype.slice.call(arguments)
  var str = args.shift()
  var cb = function () {} // start with noop.

  if (typeof args[args.length - 1] === 'function') cb = args.pop()
  cb = cb || function () {} // noop.

  if (!this.cache[this.locale]) this._readLocaleFile()

  // we've observed a new string, update the language file.
  if (!this.cache[this.locale][str] && this.updateFiles) {
    this.cache[this.locale][str] = str

    // include the current directory and locale,
    // since these values could change before the
    // write is performed.
    this._enqueueWrite([this.directory, this.locale, cb])
  } else {
    cb()
  }

  return util.format.apply(util, [this.cache[this.locale][str] || str].concat(args))
}

Y18N.prototype._enqueueWrite = function (work) {
  this.writeQueue.push(work)
  if (this.writeQueue.length === 1) this._processWriteQueue()
}

Y18N.prototype._processWriteQueue = function () {
  var _this = this
  var work = this.writeQueue[0]

  // destructure the enqueued work.
  var directory = work[0]
  var locale = work[1]
  var cb = work[2]

  var languageFile = this._resolveLocaleFile(directory, locale)
  var serializedLocale = JSON.stringify(this.cache[locale], null, 2)

  fs.writeFile(languageFile, serializedLocale, 'utf-8', function (err) {
    _this.writeQueue.shift()
    if (_this.writeQueue.length > 0) _this._processWriteQueue()
    cb(err)
  })
}

Y18N.prototype._readLocaleFile = function () {
  var localeLookup = {}
  var languageFile = this._resolveLocaleFile(this.directory, this.locale)

  try {
    localeLookup = JSON.parse(fs.readFileSync(languageFile, 'utf-8'))
  } catch (err) {
    if (err instanceof SyntaxError) {
      err.message = 'syntax error in ' + languageFile
    }

    if (err.code === 'ENOENT') localeLookup = {}
    else throw err
  }

  this.cache[this.locale] = localeLookup
}

Y18N.prototype._resolveLocaleFile = function (directory, locale) {
  var file = path.resolve(directory, './', locale + '.json')
  if (this.fallbackToLanguage && !this._fileExistsSync(file) && ~locale.lastIndexOf('_')) {
    // attempt fallback to language only
    var languageFile = path.resolve(directory, './', locale.split('_')[0] + '.json')
    if (this._fileExistsSync(languageFile)) file = languageFile
  }
  return file
}

// this only exists because fs.existsSync() "will be deprecated"
// see https://nodejs.org/api/fs.html#fs_fs_existssync_path
Y18N.prototype._fileExistsSync = function (file) {
  try {
    return fs.statSync(file).isFile()
  } catch (err) {
    return false
  }
}

Y18N.prototype.__n = function () {
  var args = Array.prototype.slice.call(arguments)
  var singular = args.shift()
  var plural = args.shift()
  var quantity = args.shift()

  var cb = function () {} // start with noop.
  if (typeof args[args.length - 1] === 'function') cb = args.pop()

  if (!this.cache[this.locale]) this._readLocaleFile()

  var str = quantity === 1 ? singular : plural
  if (this.cache[this.locale][singular]) {
    str = this.cache[this.locale][singular][quantity === 1 ? 'one' : 'other']
  }

  // we've observed a new string, update the language file.
  if (!this.cache[this.locale][singular] && this.updateFiles) {
    this.cache[this.locale][singular] = {
      one: singular,
      other: plural
    }

    // include the current directory and locale,
    // since these values could change before the
    // write is performed.
    this._enqueueWrite([this.directory, this.locale, cb])
  } else {
    cb()
  }

  // if a %d placeholder is provided, add quantity
  // to the arguments expanded by util.format.
  var values = [str]
  if (~str.indexOf('%d')) values.push(quantity)

  return util.format.apply(util, values.concat(args))
}

Y18N.prototype.setLocale = function (locale) {
  this.locale = locale
}

Y18N.prototype.getLocale = function () {
  return this.locale
}

Y18N.prototype.updateLocale = function (obj) {
  if (!this.cache[this.locale]) this._readLocaleFile()

  for (var key in obj) {
    this.cache[this.locale][key] = obj[key]
  }
}

module.exports = function (opts) {
  var y18n = new Y18N(opts)

  // bind all functions to y18n, so that
  // they can be used in isolation.
  for (var key in y18n) {
    if (typeof y18n[key] === 'function') {
      y18n[key] = y18n[key].bind(y18n)
    }
  }

  return y18n
}


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var childProcess = __webpack_require__(58);
var execFileSync = childProcess.execFileSync;
var lcid = __webpack_require__(59);
var defaultOpts = {spawn: true};
var cache;

function fallback() {
	cache = 'en_US';
	return cache;
}

function getEnvLocale(env) {
	env = env || process.env;
	var ret = env.LC_ALL || env.LC_MESSAGES || env.LANG || env.LANGUAGE;
	cache = getLocale(ret);
	return ret;
}

function parseLocale(x) {
	var env = x.split('\n').reduce(function (env, def) {
		def = def.split('=');
		env[def[0]] = def[1];
		return env;
	}, {});
	return getEnvLocale(env);
}

function getLocale(str) {
	return (str && str.replace(/[.:].*/, '')) || fallback();
}

module.exports = function (opts, cb) {
	if (typeof opts === 'function') {
		cb = opts;
		opts = defaultOpts;
	} else {
		opts = opts || defaultOpts;
	}

	if (cache || getEnvLocale() || opts.spawn === false) {
		setImmediate(cb, null, cache);
		return;
	}

	var getAppleLocale = function () {
		childProcess.execFile('defaults', ['read', '-g', 'AppleLocale'], function (err, stdout) {
			if (err) {
				fallback();
				return;
			}

			cache = stdout.trim() || fallback();
			cb(null, cache);
		});
	};

	if (process.platform === 'win32') {
		childProcess.execFile('wmic', ['os', 'get', 'locale'], function (err, stdout) {
			if (err) {
				fallback();
				return;
			}

			var lcidCode = parseInt(stdout.replace('Locale', ''), 16);
			cache = lcid.from(lcidCode) || fallback();
			cb(null, cache);
		});
	} else {
		childProcess.execFile('locale', function (err, stdout) {
			if (err) {
				fallback();
				return;
			}

			var res = parseLocale(stdout);

			if (!res && process.platform === 'darwin') {
				getAppleLocale();
				return;
			}

			cache = getLocale(res);
			cb(null, cache);
		});
	}
};

module.exports.sync = function (opts) {
	opts = opts || defaultOpts;

	if (cache || getEnvLocale() || !execFileSync || opts.spawn === false) {
		return cache;
	}

	if (process.platform === 'win32') {
		var stdout;

		try {
			stdout = execFileSync('wmic', ['os', 'get', 'locale'], {encoding: 'utf8'});
		} catch (err) {
			return fallback();
		}

		var lcidCode = parseInt(stdout.replace('Locale', ''), 16);
		cache = lcid.from(lcidCode) || fallback();
		return cache;
	}

	var res;

	try {
		res = parseLocale(execFileSync('locale', {encoding: 'utf8'}));
	} catch (err) {}

	if (!res && process.platform === 'darwin') {
		try {
			cache = execFileSync('defaults', ['read', '-g', 'AppleLocale'], {encoding: 'utf8'}).trim() || fallback();
			return cache;
		} catch (err) {
			return fallback();
		}
	}

	cache = getLocale(res);
	return cache;
};


/***/ }),
/* 58 */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var invertKv = __webpack_require__(60);
var all = __webpack_require__(61);
var inverted = invertKv(all);

exports.from = function (lcidCode) {
	if (typeof lcidCode !== 'number') {
		throw new TypeError('Expected a number');
	}

	return inverted[lcidCode];
};

exports.to = function (localeId) {
	if (typeof localeId !== 'string') {
		throw new TypeError('Expected a string');
	}

	return all[localeId];
};

exports.all = all;


/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (obj) {
	if (typeof obj !== 'object') {
		throw new TypeError('Expected an object');
	}

	var ret = {};

	for (var key in obj) {
		var val = obj[key];
		ret[val] = key;
	}

	return ret;
};


/***/ }),
/* 61 */
/***/ (function(module, exports) {

module.exports = {"af_ZA":1078,"am_ET":1118,"ar_AE":14337,"ar_BH":15361,"ar_DZ":5121,"ar_EG":3073,"ar_IQ":2049,"ar_JO":11265,"ar_KW":13313,"ar_LB":12289,"ar_LY":4097,"ar_MA":6145,"ar_OM":8193,"ar_QA":16385,"ar_SA":1025,"ar_SY":10241,"ar_TN":7169,"ar_YE":9217,"arn_CL":1146,"as_IN":1101,"az_AZ":2092,"ba_RU":1133,"be_BY":1059,"bg_BG":1026,"bn_IN":1093,"bo_BT":2129,"bo_CN":1105,"br_FR":1150,"bs_BA":8218,"ca_ES":1027,"co_FR":1155,"cs_CZ":1029,"cy_GB":1106,"da_DK":1030,"de_AT":3079,"de_CH":2055,"de_DE":1031,"de_LI":5127,"de_LU":4103,"div_MV":1125,"dsb_DE":2094,"el_GR":1032,"en_AU":3081,"en_BZ":10249,"en_CA":4105,"en_CB":9225,"en_GB":2057,"en_IE":6153,"en_IN":18441,"en_JA":8201,"en_MY":17417,"en_NZ":5129,"en_PH":13321,"en_TT":11273,"en_US":1033,"en_ZA":7177,"en_ZW":12297,"es_AR":11274,"es_BO":16394,"es_CL":13322,"es_CO":9226,"es_CR":5130,"es_DO":7178,"es_EC":12298,"es_ES":3082,"es_GT":4106,"es_HN":18442,"es_MX":2058,"es_NI":19466,"es_PA":6154,"es_PE":10250,"es_PR":20490,"es_PY":15370,"es_SV":17418,"es_UR":14346,"es_US":21514,"es_VE":8202,"et_EE":1061,"eu_ES":1069,"fa_IR":1065,"fi_FI":1035,"fil_PH":1124,"fo_FO":1080,"fr_BE":2060,"fr_CA":3084,"fr_CH":4108,"fr_FR":1036,"fr_LU":5132,"fr_MC":6156,"fy_NL":1122,"ga_IE":2108,"gbz_AF":1164,"gl_ES":1110,"gsw_FR":1156,"gu_IN":1095,"ha_NG":1128,"he_IL":1037,"hi_IN":1081,"hr_BA":4122,"hr_HR":1050,"hu_HU":1038,"hy_AM":1067,"id_ID":1057,"ii_CN":1144,"is_IS":1039,"it_CH":2064,"it_IT":1040,"iu_CA":2141,"ja_JP":1041,"ka_GE":1079,"kh_KH":1107,"kk_KZ":1087,"kl_GL":1135,"kn_IN":1099,"ko_KR":1042,"kok_IN":1111,"ky_KG":1088,"lb_LU":1134,"lo_LA":1108,"lt_LT":1063,"lv_LV":1062,"mi_NZ":1153,"mk_MK":1071,"ml_IN":1100,"mn_CN":2128,"mn_MN":1104,"moh_CA":1148,"mr_IN":1102,"ms_BN":2110,"ms_MY":1086,"mt_MT":1082,"my_MM":1109,"nb_NO":1044,"ne_NP":1121,"nl_BE":2067,"nl_NL":1043,"nn_NO":2068,"ns_ZA":1132,"oc_FR":1154,"or_IN":1096,"pa_IN":1094,"pl_PL":1045,"ps_AF":1123,"pt_BR":1046,"pt_PT":2070,"qut_GT":1158,"quz_BO":1131,"quz_EC":2155,"quz_PE":3179,"rm_CH":1047,"ro_RO":1048,"ru_RU":1049,"rw_RW":1159,"sa_IN":1103,"sah_RU":1157,"se_FI":3131,"se_NO":1083,"se_SE":2107,"si_LK":1115,"sk_SK":1051,"sl_SI":1060,"sma_NO":6203,"sma_SE":7227,"smj_NO":4155,"smj_SE":5179,"smn_FI":9275,"sms_FI":8251,"sq_AL":1052,"sr_BA":7194,"sr_SP":3098,"sv_FI":2077,"sv_SE":1053,"sw_KE":1089,"syr_SY":1114,"ta_IN":1097,"te_IN":1098,"tg_TJ":1064,"th_TH":1054,"tk_TM":1090,"tmz_DZ":2143,"tn_ZA":1074,"tr_TR":1055,"tt_RU":1092,"ug_CN":1152,"uk_UA":1058,"ur_IN":2080,"ur_PK":1056,"uz_UZ":2115,"vi_VN":1066,"wen_DE":1070,"wo_SN":1160,"xh_ZA":1076,"yo_NG":1130,"zh_CHS":4,"zh_CHT":31748,"zh_CN":2052,"zh_HK":3076,"zh_MO":5124,"zh_SG":4100,"zh_TW":1028,"zu_ZA":1077}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var crypto = __webpack_require__(63);

var json = {
  stringify: function (obj, replacer, spacing) {
    return JSON.stringify(obj, replacer || null, spacing || 2)
  },
  parse: JSON.parse
};

module.exports = Secure;
/**
 * @constructor
 * Simple Object used to serialize and deserialize
 */
function Secure(opts) {
  opts = opts || {};
  this.secret = typeof opts !== 'string'
    ? opts.secret
    : opts;

  this.format = opts.format || json;
  this.alg = opts.alg || 'aes-256-ctr';

  if (!this.secret) throw new Error('Secret is a required option');
}

Secure.prototype.encrypt = function encrypt(data, callback) {
  var self = this;

  return Object.keys(data).reduce(function (acc, key) {
    var value = self.format.stringify(data[key]);
    acc[key] = {
      alg: self.alg,
      value: cipherConvert(value, {
        alg: self.alg,
        secret: self.secret,
        encs: { input: 'utf8', output: 'hex' }
      })
    };

    return acc;
  }, {});

 };

Secure.prototype.decrypt = function decrypt(data, callback) {
  var self = this;

  return Object.keys(data).reduce(function (acc, key) {
    var decrypted = cipherConvert(data[key].value, {
      alg: data[key].alg || self.alg,
      secret: self.secret,
      encs: { input: 'hex', output: 'utf8' }
    });

    acc[key] = self.format.parse(decrypted);
    return acc;
  }, {});

 };

//
// ### function cipherConvert (contents, opts)
// Returns the result of the cipher operation
// on the contents contents.
//
function cipherConvert(contents, opts) {
  var encs = opts.encs;
  var cipher = crypto.createCipher(opts.alg, opts.secret);
  return cipher.update(contents, encs.input, encs.output)
    + cipher.final(encs.output);
}


/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = require("crypto");

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = require("fabric-ca-client/lib/FabricCAClientImpl.js");

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = require("fabric-client/lib/User.js");

/***/ }),
/* 66 */
/***/ (function(module, exports) {

module.exports = require("fabric-client/lib/utils.js");

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const util = __webpack_require__(3); /**
                               *
                               * Copyright 2018 KT All Rights Reserved.
                               *
                               */

const member = __webpack_require__(11);
const channelLib = __webpack_require__(21);

function format_query_resp(peer_responses) {
  const ret = {
    parsed: null,
    peers_agree: true,
    peer_payloads: [],
    error: null
  };
  let last = null;

  // -- iter on each peer's response -- //
  for (const i in peer_responses) {
    const as_string = peer_responses[i].toString('utf8');
    let as_obj = {};
    ret.peer_payloads.push(as_string);

    // -- compare peer responses -- //
    if (last != null) {
      // check if all peers agree
      if (last !== as_string) {
        logger.warn('[fcw] warning - some peers do not agree on query', last, as_string);
        ret.peers_agree = false;
      }
      last = as_string;
    }

    try {
      if (as_string === '') {
        // if its empty, thats okay... well its not great
        as_obj = '';
      } else {
        as_obj = JSON.parse(as_string); // if we can parse it, its great
      }
      if (ret.parsed === null) ret.parsed = as_obj; // store the first one here
    } catch (e) {
      _logger2.default.error(e.toString());
      if (known_sdk_errors(as_string)) {
        ret.parsed = null;
        ret.error = as_string;
      } else if (as_string.indexOf('premature execution') >= 0) {
        ret.parsed = null;
        ret.error = as_string;
      } else {
        ret.parsed = as_string;
      }
    }
  }
  return ret;
}

function known_sdk_errors(str) {
  const known_errors = ['Error: failed to obtain', 'Error: Connect Failed']; //list of known sdk errors from a query
  for (let i in known_errors) {
    if (str && str.indexOf(known_errors[i]) >= 0) {
      return true;
    }
  }
  return false;
}

function queryChaincode(client, channelName, req, targets) {
  _logger2.default.debug(`queryChaincode(${req.chaincodeId}, ${req.fcn}, [${req.args}])`);
  _logger2.default.info(`Query Targets : ${targets}`);

  return new Promise((resolve, reject) => {
    const invoker = member.getCurrentContextMember(client);
    _logger2.default.info(`Member '${invoker.getName()}' try to query ~`);

    const channel = client.getChannel(channelName);
    const tx_id = client.newTransactionID();

    // send query
    const request = {
      chaincodeId: req.chaincodeId,
      txId: tx_id,
      fcn: req.fcn,
      args: req.args ? req.args : []
    };

    if (targets && targets.length != 0) {
      request.targets = targets;
    }

    return channel.queryByChaincode(request).then(response_payloads => {
      if (response_payloads) {
        const result = [];
        for (let i = 0; i < response_payloads.length; i++) {
          result.push(response_payloads[i] instanceof Error ? response_payloads : format_query_resp(response_payloads));
          _logger2.default.info(response_payloads);
        }
        resolve(result);
      } else {
        _logger2.default.error('Failed to get response on query - response_payloads is null');
        reject(new Error('Failed to get response on query - response_payloads is null'));
      }
    }).catch(err => {
      if (err instanceof Error) {
        _logger2.default.error(`Failed to query. ${err.stack ? err.stack : err}`);
        reject(err);
      } else {
        _logger2.default.error( true ? err : 'No Error Info');
        reject(new Error( true ? err : 'No Error Info'));
      }
    });
  });
}
module.exports.queryChaincode = queryChaincode;

function invokeChaincode(client, channelName, req, targets, eventhubs) {
  _logger2.default.debug(`invokeChaincode(${req.chaincodeId}, ${req.fcn}, [${req.args}])`);
  _logger2.default.info(`Invoke Targets : ${targets}`);

  return new Promise((resolve, reject) => {
    const invoker = member.getCurrentContextMember(client);
    _logger2.default.info(`Member '${invoker.getName()}' try to invoke ~`);

    const channel = client.getChannel(channelName);
    let tx_id;

    tx_id = client.newTransactionID();
    _logger2.default.info(util.format('Sending transaction "%s"', JSON.stringify(tx_id._transaction_id)));

    // send proposal to endorser
    const request = {
      chaincodeId: req.chaincodeId,
      fcn: req.fcn,
      args: req.args,
      txId: tx_id
    };

    if (targets && targets.length != 0) {
      request.targets = targets;
    }

    return channel.sendTransactionProposal(request).then(results => {
      const proposalResponses = results[0];
      const proposal = results[1];
      const header = results[2];
      let errorResponse;

      for (const i in proposalResponses) {
        if (proposalResponses[i] && proposalResponses[i].response && proposalResponses[i].response.status === 200) {
          _logger2.default.info('transaction proposal has response status of good');
          if (channel.verifyProposalResponse(proposalResponses[i])) {
            _logger2.default.info(' - transaction proposal signature and endorser are valid');
          } else {
            errorResponse = new Error('transaction proposal signature and endorser are invalid!');
          }
        } else {
          _logger2.default.error(`transaction proposal was bad : ${proposalResponses[i]}`);
          errorResponse = proposalResponses[i] instanceof Error ? proposalResponses[i] : new Error(proposalResponses[i]);
        }
      }
      if (!errorResponse) {
        if (channel.compareProposalResponseResults(proposalResponses)) {
          _logger2.default.info('compareProposalResponseResults exection did not throw');
          _logger2.default.info(' All proposals have a matching read/writes sets');
        } else {
          _logger2.default.error(' All proposals do not have matching read/write sets');
          errorResponse = new Error('proposals do not have matching read/write sets');
        }
      }
      if (!errorResponse) {
        _logger2.default.info(util.format('Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s', proposalResponses[0].response.status, proposalResponses[0].response.message, proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
        const request = {
          proposalResponses,
          proposal,
          header
        };

        const deployId = tx_id.getTransactionID();

        const eventPromises = [];
        eventhubs.forEach(eh => {
          if (eh.isconnected()) {
            const txPromise = new Promise((resolve, reject) => {
              const handle = setTimeout(() => {
                _logger2.default.debug('eventhub time out');
                eh.unregisterTxEvent(deployId);
                reject(new Error('eventhub time out'));
              }, 60000);

              eh.registerTxEvent(deployId.toString(), (tx, code) => {
                clearTimeout(handle);
                eh.unregisterTxEvent(deployId);

                if (code !== 'VALID') {
                  _logger2.default.error(`The transaction was invalid, code = ${code}`);
                  reject(new Error(`The transaction was invalid, code = ${code} on peer ${eh.getPeerAddr()}`));
                } else {
                  _logger2.default.info('The transaction was valid.');
                  _logger2.default.info(`The transaction has been committed on peer ${eh.getPeerAddr()}`);
                  resolve();
                }
              }, err => {
                clearTimeout(handle);
                _logger2.default.info(`Eventhub is shutdown for ${deployId} err : ${err}`);
                reject(new Error(`Eventhub is shutdown for ${deployId} err : ${err}`));
              });
            });
            eventPromises.push(txPromise);
          }
        });

        const sendPromise = channel.sendTransaction(request).catch(err => {
          _logger2.default.error('지정된 Orderer에 연결이 불가능합니다. ');
          channelLib.loadChannelConfig(channel).catch(err => {
            _logger2.default.info(err);
          });
          //   return Promise.reject(err);
          throw err;
        });

        return Promise.all([sendPromise].concat(eventPromises)).then(results => {
          _logger2.default.debug('Event promise all complete and testing complete');
          return results[0]; // just first results are from orderer, the rest are from the peer events
        }).catch(err => {
          if (err && err instanceof Error) {
            _logger2.default.error(`Failed to send transaction - ${err}`);
            throw err;
          } else {
            _logger2.default.error(`Failed to send transaction - ${err || 'Failed to get notifications within the timeout period'}`);
            throw new Error(`Failed to send transaction - ${err || 'Failed to get notifications within the timeout period'}`);
          }
        });
      }
      _logger2.default.error(errorResponse);
      throw errorResponse;
    }).then(response => {
      if (!(response instanceof Error) && response.status === 'SUCCESS') {
        _logger2.default.info(JSON.stringify(response));
        _logger2.default.info('Successfully sent transaction to the orderer.');
        _logger2.default.info('******************************************************************');
        _logger2.default.info(`${'export TX_ID=' + '\''}${tx_id.getTransactionID()}'`);
        _logger2.default.info('******************************************************************');
        resolve(`${'TX_ID=' + '\''}${tx_id.getTransactionID()}'`);
      } else if (response instanceof Error) {
        _logger2.default.error(`Failed to the transaction. ${response.stack ? response.stack : response}`);
        reject(response);
      } else {
        _logger2.default.error(`Failed to order the transaction - ${response || 'No Error Info'}`);
        reject(new Error(`Failed to order the transaction - ${response || 'No Error Info'}`));
      }
    }).catch(err => {
      if (err instanceof Error) {
        _logger2.default.error(`Failed to transaction. ${err.stack ? err.stack : err}`);
        reject(err);
      } else {
        _logger2.default.error(`Failed to send transaction - ${err || 'No Error Info'}`);
        reject(new Error(`Failed to send transaction - ${err || 'No Error Info'}`));
      }
    });
  });
}
module.exports.invokeChaincode = invokeChaincode;

/***/ }),
/* 68 */
/***/ (function(module, exports) {

module.exports = {"default":{"org":"org1","member":"org1Admin","adminClient":true},"registrar":{"org1":{"name":"admin","password":"adminpw"}},"adminCertPath":{"org1":{"member":"org1Admin","key":"adminCerts/org1.example.com/keystore","cert":"adminCerts/org1.example.com/signcerts"}}}

/***/ }),
/* 69 */
/***/ (function(module, exports) {

module.exports = {"channelName":"mychannel","orderer":{"orderer1":{"mspid":"OrdererMSP","url":"grpc://192.168.99.100:7050","server-hostname":"orderer.example.com","tls_cacerts":"tlsCerts/orderer/ca.example.com-cert.pem"}},"orgs":{"org1":{"name":"peerOrg1","mspid":"Org1MSP","ca":{"url":"http://192.168.99.100:7054","name":"ca.example.com"},"peers":{"peer1":{"requests":"grpc://192.168.99.100:7051","events":"grpc://192.168.99.100:7053","server-hostname":"peer0.org1.example.com","tls_cacerts":"tlsCerts/org1.example.com/ca.org1.example.com-cert.pem"}}}}}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const transaction = __webpack_require__(71);

class CouchClient {
  constructor() {
    // CouchDB Client
    this._couch = __webpack_require__(72)('http://localhost:5984');
    this._imdb = null;
  }

  dbSetUp() {
    this._imdb = this._couch.use('mychannel_im');
  }

  queryCouchDB(params) {
    return transaction.queryCouchDB(this._imdb, params);
  }
}

const couchClient = new CouchClient();
module.exports = couchClient;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function queryCouchDB(imDB, params) {
  const queryResult = {};
  /*
      http://localhost:5984/mychannel_im/_design/new-view/_view/new-view
  */

  if (params.logType == 'service') {
    params.key = 'imService';
  } else if (params.logType == 'contents') {
    params.key = 'imContents';
  } else if (params.logType == 'platform') {
    params.key = 'imLog';
  }

  /*
    1. 검색어가 있다면 데이터 뷰 Query 이전 Statistics view의 해당 검색어로 토탈카운트 집계
    2. 데이터 뷰에 해당 검색어로 Query
    3. 검색어는 Key 가 되어야 함
  */

  return imDB.view('data', params.key, { key: params.key, limit: params.limit, skip: params.offset }).then(body => {
    queryResult.total_rows = body.total_rows;
    queryResult.offset = body.offset;
    queryResult.data = body.rows;

    _logger2.default.debug(JSON.stringify(queryResult));

    return queryResult;
  });

  /*
  return imDB.view('statistics', 'doc-count', { key: params.key, group: true }).then(body => {
    queryResult.total_cnt = body.rows;
    return params.key;
  }).then(key => {
    const viewName = key;
     return imDB.view('data', viewName, { key: params.key, limit: params.limit, skip: params.offset }).then(body => {
      queryResult.total_rows = body.total_rows;
      queryResult.offset = body.offset;
      queryResult.data = body.rows;
       l.debug(JSON.stringify(queryResult));
       return queryResult;
    });
  });
  */
}
module.exports.queryCouchDB = queryCouchDB;

/***/ }),
/* 72 */
/***/ (function(module, exports) {

module.exports = require("nano");

/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = {"clientPort":"4500","logLevel":"info","chaincodePath":"gopath","keyValStorePath":"key","startChannelNetwork":"channel_local"}

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = routes;

var _router = __webpack_require__(75);

var _router2 = _interopRequireDefault(_router);

var _router3 = __webpack_require__(79);

var _router4 = _interopRequireDefault(_router3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function routes(app) {
  app.use('/api/v1/examples', _router2.default);
  app.use('/api/v1/balance', _router4.default);
}

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(6);

var express = _interopRequireWildcard(_express);

var _controller = __webpack_require__(76);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

exports.default = express.Router().post('/', _controller2.default.create).get('/', _controller2.default.all).get('/:id', _controller2.default.byId).post('/echo', _controller2.default.echo);

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Controller = undefined;

var _examples = __webpack_require__(77);

var _examples2 = _interopRequireDefault(_examples);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Controller {
  all(req, res) {
    _examples2.default.all().then(r => res.json(r));
  }

  byId(req, res) {
    _examples2.default.byId(req.params.id).then(r => {
      if (r) res.json(r);else res.status(404).end();
    });
  }

  create(req, res) {
    _examples2.default.create(req.body.name).then(r => res.status(201).location(`/api/v1/examples/${r.id}`).json(r));
  }

  echo(req, res) {
    _examples2.default.echo(req.body.Message).then(r => res.json(r));
  }
}
exports.Controller = Controller;
exports.default = new Controller();

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

var _examplesDb = __webpack_require__(78);

var _examplesDb2 = _interopRequireDefault(_examplesDb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class ExamplesService {
  all() {
    _logger2.default.info(`${this.constructor.name}.all()`);
    return _examplesDb2.default.all();
  }

  byId(id) {
    _logger2.default.info(`${this.constructor.name}.byId(${id})`);
    return _examplesDb2.default.byId(id);
  }

  create(name) {
    return _examplesDb2.default.insert(name);
  }
  echo(Message) {
    return Promise.resolve("your message is " + Message);
  }
}

exports.default = new ExamplesService();

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
class ExamplesDatabase {
  constructor() {
    this._data = [];
    this._counter = 0;

    this.insert('example 0');
    this.insert('example 1');
  }

  all() {
    return Promise.resolve(this._data);
  }

  byId(id) {
    return Promise.resolve(this._data[id]);
  }

  insert(name) {
    const record = {
      id: this._counter,
      name
    };

    this._counter += 1;
    this._data.push(record);

    return Promise.resolve(record);
  }
}

exports.default = new ExamplesDatabase();

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(6);

var express = _interopRequireWildcard(_express);

var _controller = __webpack_require__(80);

var _controller2 = _interopRequireDefault(_controller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 *
 * Copyright 2018 KT All Rights Reserved.
 *
 */

exports.default = express.Router().get('/:id', _controller2.default.getBalance).post('/', _controller2.default.move).post('/user', _controller2.default.addUser);

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Controller = undefined;

var _balance = __webpack_require__(81);

var _balance2 = _interopRequireDefault(_balance);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Controller {
  getBalance(req, res) {
    _balance2.default.getBalance(req, res).then(r => {
      if (r) res.json(r);else res.status(404).end();
    });
  }

  move(req, res) {
    _balance2.default.move(req, res).then(r => {
      if (r) res.json(r);else res.status(404).end();
    });
  }

  addUser(req, res) {
    _balance2.default.addUser(req, res).then(r => {
      if (r) res.json(r);else res.status(404).end();
    });
  }
}
exports.Controller = Controller;
exports.default = new Controller();

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = __webpack_require__(1);

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fbClient = __webpack_require__(12);

class BalanceService {
  getBalance(req, res) {
    const args = [];

    args.push(req.params.id);
    return Promise.resolve(fbClient.queryChaincode('balance', 'query', args, []));
  }

  move(req, res) {
    _logger2.default.info(`${this.constructor.name}.byId(${req})`);
    const args = [];

    args.push(req.body.from);
    args.push(req.body.to);
    args.push(req.body.amount.toString());

    return Promise.resolve(fbClient.invokeChaincode('balance', 'move', args, []));
  }

  addUser(req, res) {
    _logger2.default.info(`${this.constructor.name}.byId(${req})`);
    const args = [];

    args.push(req.body.name);
    args.push(req.body.balance.toString());

    return Promise.resolve(fbClient.invokeChaincode('balance', 'add', args, []));
  }
}

exports.default = new BalanceService();

/***/ })
/******/ ]);
//# sourceMappingURL=main.map