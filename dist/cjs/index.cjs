"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// dist/esm/index.js
var index_exports = {};
__export(index_exports, {
  RepositoryDataSchema: () => RepositoryDataSchema
});
module.exports = __toCommonJS(index_exports);

// dist/esm/repository-data-schema.js
var import_js_format4 = require("@e22m4u/js-format");

// node_modules/@e22m4u/js-service/src/errors/invalid-argument-error.js
var import_js_format = require("@e22m4u/js-format");
var _InvalidArgumentError = class _InvalidArgumentError extends import_js_format.Errorf {
};
__name(_InvalidArgumentError, "InvalidArgumentError");
var InvalidArgumentError = _InvalidArgumentError;

// node_modules/@e22m4u/js-service/src/service-container.js
var SERVICE_CONTAINER_CLASS_NAME = "ServiceContainer";
var _ServiceContainer = class _ServiceContainer {
  /**
   * Services map.
   *
   * @type {Map<any, any>}
   * @private
   */
  _services = /* @__PURE__ */ new Map();
  /**
   * Parent container.
   *
   * @type {ServiceContainer}
   * @private
   */
  _parent;
  /**
   * Constructor.
   *
   * @param {ServiceContainer|undefined} parent
   */
  constructor(parent = void 0) {
    if (parent != null) {
      if (!(parent instanceof _ServiceContainer))
        throw new InvalidArgumentError(
          'The provided parameter "parent" of ServicesContainer.constructor must be an instance ServiceContainer, but %v given.',
          parent
        );
      this._parent = parent;
    }
  }
  /**
   * Получить родительский сервис-контейнер или выбросить ошибку.
   *
   * @returns {ServiceContainer}
   */
  getParent() {
    if (!this._parent)
      throw new InvalidArgumentError("The service container has no parent.");
    return this._parent;
  }
  /**
   * Проверить наличие родительского сервис-контейнера.
   *
   * @returns {boolean}
   */
  hasParent() {
    return Boolean(this._parent);
  }
  /**
   * Получить существующий или новый экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @returns {*}
   */
  get(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.get must be a class constructor, but %v given.",
        ctor
      );
    if (!this._services.has(ctor) && this._parent && this._parent.has(ctor)) {
      return this._parent.get(ctor);
    }
    let service = this._services.get(ctor);
    if (!service) {
      const ctors = this._services.keys();
      const inheritedCtor = ctors.find((v) => v.prototype instanceof ctor);
      if (inheritedCtor) {
        service = this._services.get(inheritedCtor);
        ctor = inheritedCtor;
      }
    }
    if (!service || args.length) {
      service = Array.isArray(ctor.kinds) && ctor.kinds.includes(SERVICE_CLASS_NAME) ? new ctor(this, ...args) : new ctor(...args);
      this._services.set(ctor, service);
    } else if (typeof service === "function") {
      service = service();
      this._services.set(ctor, service);
    }
    return service;
  }
  /**
   * Получить существующий или новый экземпляр,
   * только если конструктор зарегистрирован.
   *
   * @param {*} ctor
   * @param {*} args
   * @returns {*}
   */
  getRegistered(ctor, ...args) {
    if (!this.has(ctor))
      throw new InvalidArgumentError(
        "The constructor %v is not registered.",
        ctor
      );
    return this.get(ctor, ...args);
  }
  /**
   * Проверить существование конструктора в контейнере.
   *
   * @param {*} ctor
   * @returns {boolean}
   */
  has(ctor) {
    if (this._services.has(ctor)) return true;
    if (this._parent) return this._parent.has(ctor);
    const ctors = this._services.keys();
    const inheritedCtor = ctors.find((v) => v.prototype instanceof ctor);
    if (inheritedCtor) return true;
    return false;
  }
  /**
   * Добавить конструктор в контейнер.
   *
   * @param {*} ctor
   * @param {*} args
   * @returns {this}
   */
  add(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.add must be a class constructor, but %v given.",
        ctor
      );
    const factory = /* @__PURE__ */ __name(() => Array.isArray(ctor.kinds) && ctor.kinds.includes(SERVICE_CLASS_NAME) ? new ctor(this, ...args) : new ctor(...args), "factory");
    this._services.set(ctor, factory);
    return this;
  }
  /**
   * Добавить конструктор и создать экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @returns {this}
   */
  use(ctor, ...args) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.use must be a class constructor, but %v given.",
        ctor
      );
    const service = Array.isArray(ctor.kinds) && ctor.kinds.includes(SERVICE_CLASS_NAME) ? new ctor(this, ...args) : new ctor(...args);
    this._services.set(ctor, service);
    return this;
  }
  /**
   * Добавить конструктор и связанный экземпляр.
   *
   * @param {*} ctor
   * @param {*} service
   * @returns {this}
   */
  set(ctor, service) {
    if (!ctor || typeof ctor !== "function")
      throw new InvalidArgumentError(
        "The first argument of ServicesContainer.set must be a class constructor, but %v given.",
        ctor
      );
    if (!service || typeof service !== "object" || Array.isArray(service))
      throw new InvalidArgumentError(
        "The second argument of ServicesContainer.set must be an Object, but %v given.",
        service
      );
    this._services.set(ctor, service);
    return this;
  }
};
__name(_ServiceContainer, "ServiceContainer");
/**
 * Kinds.
 *
 * @type {string[]}
 */
__publicField(_ServiceContainer, "kinds", [SERVICE_CONTAINER_CLASS_NAME]);
var ServiceContainer = _ServiceContainer;

// node_modules/@e22m4u/js-service/src/utils/is-service-container.js
function isServiceContainer(container) {
  return Boolean(
    container && typeof container === "object" && typeof container.constructor === "function" && Array.isArray(container.constructor.kinds) && container.constructor.kinds.includes(SERVICE_CONTAINER_CLASS_NAME)
  );
}
__name(isServiceContainer, "isServiceContainer");

// node_modules/@e22m4u/js-service/src/service.js
var SERVICE_CLASS_NAME = "Service";
var _Service = class _Service {
  /**
   * Container.
   *
   * @type {ServiceContainer}
   */
  container;
  /**
   * Constructor.
   *
   * @param {ServiceContainer|undefined} container
   */
  constructor(container = void 0) {
    this.container = isServiceContainer(container) ? container : new ServiceContainer();
  }
  /**
   * Получить существующий или новый экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @returns {*}
   */
  getService(ctor, ...args) {
    return this.container.get(ctor, ...args);
  }
  /**
   * Получить существующий или новый экземпляр,
   * только если конструктор зарегистрирован.
   *
   * @param {*} ctor
   * @param {*} args
   * @returns {*}
   */
  getRegisteredService(ctor, ...args) {
    return this.container.getRegistered(ctor, ...args);
  }
  /**
   * Проверка существования конструктора в контейнере.
   *
   * @param {*} ctor
   * @returns {boolean}
   */
  hasService(ctor) {
    return this.container.has(ctor);
  }
  /**
   * Добавить конструктор в контейнер.
   *
   * @param {*} ctor
   * @param {*} args
   * @returns {this}
   */
  addService(ctor, ...args) {
    this.container.add(ctor, ...args);
    return this;
  }
  /**
   * Добавить конструктор и создать экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @returns {this}
   */
  useService(ctor, ...args) {
    this.container.use(ctor, ...args);
    return this;
  }
  /**
   * Добавить конструктор и связанный экземпляр.
   *
   * @param {*} ctor
   * @param {*} service
   * @returns {this}
   */
  setService(ctor, service) {
    this.container.set(ctor, service);
    return this;
  }
};
__name(_Service, "Service");
/**
 * Kinds.
 *
 * @type {string[]}
 */
__publicField(_Service, "kinds", [SERVICE_CLASS_NAME]);
var Service = _Service;

// node_modules/@e22m4u/js-debug/src/utils/to-camel-case.js
function toCamelCase(input) {
  return input.replace(/(^\w|[A-Z]|\b\w)/g, (c) => c.toUpperCase()).replace(/\W+/g, "").replace(/(^\w)/g, (c) => c.toLowerCase());
}
__name(toCamelCase, "toCamelCase");

// node_modules/@e22m4u/js-debug/src/utils/is-non-array-object.js
function isNonArrayObject(input) {
  return Boolean(input && typeof input === "object" && !Array.isArray(input));
}
__name(isNonArrayObject, "isNonArrayObject");

// node_modules/@e22m4u/js-debug/src/utils/generate-random-hex.js
function generateRandomHex(length = 4) {
  if (length <= 0) {
    return "";
  }
  const firstCharCandidates = "abcdef";
  const restCharCandidates = "0123456789abcdef";
  let result = "";
  const firstCharIndex = Math.floor(Math.random() * firstCharCandidates.length);
  result += firstCharCandidates[firstCharIndex];
  for (let i = 1; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * restCharCandidates.length);
    result += restCharCandidates[randomIndex];
  }
  return result;
}
__name(generateRandomHex, "generateRandomHex");

// node_modules/@e22m4u/js-debug/src/debuggable.js
var _Debuggable = class _Debuggable {
  /**
   * Debug.
   *
   * @type {Function}
   */
  debug;
  /**
   * Ctor Debug.
   *
   * @type {Function}
   */
  ctorDebug;
  /**
   * Возвращает функцию-отладчик с сегментом пространства имен
   * указанного в параметре метода.
   *
   * @param {Function} method
   * @returns {Function}
   */
  getDebuggerFor(method) {
    return this.debug.withHash().withNs(method.name);
  }
  /**
   * Constructor.
   *
   * @param {object|undefined} container
   * @param {DebuggableOptions|undefined} options
   */
  constructor(options = void 0) {
    const className = toCamelCase(this.constructor.name);
    options = typeof options === "object" && options || {};
    const namespace = options.namespace && String(options.namespace) || void 0;
    if (namespace) {
      this.debug = createDebugger(namespace, className);
    } else {
      this.debug = createDebugger(className);
    }
    const noEnvNs = Boolean(options.noEnvNs);
    if (noEnvNs) this.debug = this.debug.withoutEnvNs();
    this.ctorDebug = this.debug.withNs("constructor").withHash();
    this.ctorDebug(_Debuggable.INSTANTIATION_MESSAGE);
  }
};
__name(_Debuggable, "Debuggable");
/**
 * Instantiation message;
 *
 * @type {string}
 */
__publicField(_Debuggable, "INSTANTIATION_MESSAGE", "Instantiated.");
var Debuggable = _Debuggable;

// node_modules/@e22m4u/js-debug/src/create-debugger.js
var import_js_format2 = require("@e22m4u/js-format");
var import_js_format3 = require("@e22m4u/js-format");

// node_modules/@e22m4u/js-debug/src/create-colorized-dump.js
var import_util = require("util");
var INSPECT_OPTIONS = {
  showHidden: false,
  depth: null,
  colors: true,
  compact: false
};
function createColorizedDump(value) {
  return (0, import_util.inspect)(value, INSPECT_OPTIONS);
}
__name(createColorizedDump, "createColorizedDump");

// node_modules/@e22m4u/js-debug/src/create-debugger.js
var AVAILABLE_COLORS = [
  20,
  21,
  26,
  27,
  32,
  33,
  38,
  39,
  40,
  41,
  42,
  43,
  44,
  45,
  56,
  57,
  62,
  63,
  68,
  69,
  74,
  75,
  76,
  77,
  78,
  79,
  80,
  81,
  92,
  93,
  98,
  99,
  112,
  113,
  128,
  129,
  134,
  135,
  148,
  149,
  160,
  161,
  162,
  163,
  164,
  165,
  166,
  167,
  168,
  169,
  170,
  171,
  172,
  173,
  178,
  179,
  184,
  185,
  196,
  197,
  198,
  199,
  200,
  201,
  202,
  203,
  204,
  205,
  206,
  207,
  208,
  209,
  214,
  215,
  220,
  221
];
var DEFAULT_OFFSET_STEP_SPACES = 2;
function pickColorCode(input) {
  if (typeof input !== "string")
    throw new import_js_format2.Errorf(
      'The parameter "input" of the function pickColorCode must be a String, but %v given.',
      input
    );
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return AVAILABLE_COLORS[Math.abs(hash) % AVAILABLE_COLORS.length];
}
__name(pickColorCode, "pickColorCode");
function wrapStringByColorCode(input, color) {
  if (typeof input !== "string")
    throw new import_js_format2.Errorf(
      'The parameter "input" of the function wrapStringByColorCode must be a String, but %v given.',
      input
    );
  if (typeof color !== "number")
    throw new import_js_format2.Errorf(
      'The parameter "color" of the function wrapStringByColorCode must be a Number, but %v given.',
      color
    );
  const colorCode = "\x1B[3" + (Number(color) < 8 ? color : "8;5;" + color);
  return `${colorCode};1m${input}\x1B[0m`;
}
__name(wrapStringByColorCode, "wrapStringByColorCode");
function matchPattern(pattern, input) {
  if (typeof pattern !== "string")
    throw new import_js_format2.Errorf(
      'The parameter "pattern" of the function matchPattern must be a String, but %v given.',
      pattern
    );
  if (typeof input !== "string")
    throw new import_js_format2.Errorf(
      'The parameter "input" of the function matchPattern must be a String, but %v given.',
      input
    );
  const regexpStr = pattern.replace(/\*/g, ".*?");
  const regexp = new RegExp("^" + regexpStr + "$");
  return regexp.test(input);
}
__name(matchPattern, "matchPattern");
function createDebugger(namespaceOrOptions = void 0, ...namespaceSegments) {
  if (namespaceOrOptions && typeof namespaceOrOptions !== "string" && !isNonArrayObject(namespaceOrOptions)) {
    throw new import_js_format2.Errorf(
      'The parameter "namespace" of the function createDebugger must be a String or an Object, but %v given.',
      namespaceOrOptions
    );
  }
  const withCustomState = isNonArrayObject(namespaceOrOptions);
  const state = withCustomState ? namespaceOrOptions : {};
  state.envNsSegments = Array.isArray(state.envNsSegments) ? state.envNsSegments : [];
  state.nsSegments = Array.isArray(state.nsSegments) ? state.nsSegments : [];
  state.pattern = typeof state.pattern === "string" ? state.pattern : "";
  state.hash = typeof state.hash === "string" ? state.hash : "";
  state.offsetSize = typeof state.offsetSize === "number" ? state.offsetSize : 0;
  state.offsetStep = typeof state.offsetStep !== "string" ? " ".repeat(DEFAULT_OFFSET_STEP_SPACES) : state.offsetStep;
  state.delimiter = state.delimiter && typeof state.delimiter === "string" ? state.delimiter : ":";
  if (!withCustomState) {
    if (typeof process !== "undefined" && process.env && process.env["DEBUGGER_NAMESPACE"]) {
      state.envNsSegments.push(process.env.DEBUGGER_NAMESPACE);
    }
    if (typeof namespaceOrOptions === "string")
      state.nsSegments.push(namespaceOrOptions);
  }
  namespaceSegments.forEach((segment) => {
    if (!segment || typeof segment !== "string")
      throw new import_js_format2.Errorf(
        "Namespace segment must be a non-empty String, but %v given.",
        segment
      );
    state.nsSegments.push(segment);
  });
  if (typeof process !== "undefined" && process.env && process.env["DEBUG"]) {
    state.pattern = process.env["DEBUG"];
  } else if (typeof localStorage !== "undefined" && typeof localStorage.getItem("debug") === "string") {
    state.pattern = localStorage.getItem("debug");
  }
  const isDebuggerEnabled = /* @__PURE__ */ __name(() => {
    const nsStr = [...state.envNsSegments, ...state.nsSegments].join(
      state.delimiter
    );
    const patterns = state.pattern.split(/[\s,]+/).filter((p) => p.length > 0);
    if (patterns.length === 0 && state.pattern !== "*") return false;
    for (const singlePattern of patterns) {
      if (matchPattern(singlePattern, nsStr)) return true;
    }
    return false;
  }, "isDebuggerEnabled");
  const getPrefix = /* @__PURE__ */ __name(() => {
    let tokens = [];
    [...state.envNsSegments, ...state.nsSegments, state.hash].filter(Boolean).forEach((token) => {
      const extractedTokens = token.split(state.delimiter).filter(Boolean);
      tokens = [...tokens, ...extractedTokens];
    });
    let res = tokens.reduce((acc, token, index) => {
      const isLast = tokens.length - 1 === index;
      const tokenColor = pickColorCode(token);
      acc += wrapStringByColorCode(token, tokenColor);
      if (!isLast) acc += state.delimiter;
      return acc;
    }, "");
    if (state.offsetSize > 0) res += state.offsetStep.repeat(state.offsetSize);
    return res;
  }, "getPrefix");
  function debugFn(messageOrData, ...args) {
    if (!isDebuggerEnabled()) return;
    const prefix = getPrefix();
    const multiString = (0, import_js_format3.format)(messageOrData, ...args);
    const rows = multiString.split("\n");
    rows.forEach((message) => {
      prefix ? console.log(`${prefix} ${message}`) : console.log(message);
    });
  }
  __name(debugFn, "debugFn");
  debugFn.withNs = function(namespace, ...args) {
    const stateCopy = JSON.parse(JSON.stringify(state));
    [namespace, ...args].forEach((ns) => {
      if (!ns || typeof ns !== "string")
        throw new import_js_format2.Errorf(
          "Debugger namespace must be a non-empty String, but %v given.",
          ns
        );
      stateCopy.nsSegments.push(ns);
    });
    return createDebugger(stateCopy);
  };
  debugFn.withHash = function(hashLength = 4) {
    const stateCopy = JSON.parse(JSON.stringify(state));
    if (!hashLength || typeof hashLength !== "number" || hashLength < 1) {
      throw new import_js_format2.Errorf(
        "Debugger hash must be a positive Number, but %v given.",
        hashLength
      );
    }
    stateCopy.hash = generateRandomHex(hashLength);
    return createDebugger(stateCopy);
  };
  debugFn.withOffset = function(offsetSize) {
    const stateCopy = JSON.parse(JSON.stringify(state));
    if (!offsetSize || typeof offsetSize !== "number" || offsetSize < 1) {
      throw new import_js_format2.Errorf(
        "Debugger offset must be a positive Number, but %v given.",
        offsetSize
      );
    }
    stateCopy.offsetSize = offsetSize;
    return createDebugger(stateCopy);
  };
  debugFn.withoutEnvNs = function() {
    const stateCopy = JSON.parse(JSON.stringify(state));
    stateCopy.envNsSegments = [];
    return createDebugger(stateCopy);
  };
  debugFn.inspect = function(valueOrDesc, ...args) {
    if (!isDebuggerEnabled()) return;
    const prefix = getPrefix();
    let multiString = "";
    if (typeof valueOrDesc === "string" && args.length) {
      multiString += `${valueOrDesc}
`;
      const multilineDump = args.map((v) => createColorizedDump(v)).join("\n");
      const dumpRows = multilineDump.split("\n");
      multiString += dumpRows.map((v) => `${state.offsetStep}${v}`).join("\n");
    } else {
      multiString += [valueOrDesc, ...args].map((v) => createColorizedDump(v)).join("\n");
    }
    const rows = multiString.split("\n");
    rows.forEach((message) => {
      prefix ? console.log(`${prefix} ${message}`) : console.log(message);
    });
  };
  debugFn.state = state;
  return debugFn;
}
__name(createDebugger, "createDebugger");

// node_modules/@e22m4u/js-service/src/debuggable-service.js
var _DebuggableService = class _DebuggableService extends Debuggable {
  /**
   * Service.
   *
   * @type {Service}
   */
  _service;
  /**
   * Container.
   *
   * @type {ServiceContainer}
   */
  get container() {
    return this._service.container;
  }
  /**
   * Получить существующий или новый экземпляр.
   *
   * @type {Service['getService']}
   */
  get getService() {
    return this._service.getService;
  }
  /**
   * Получить существующий или новый экземпляр,
   * только если конструктор зарегистрирован.
   *
   * @type {Service['getRegisteredService']}
   */
  get getRegisteredService() {
    return this._service.getRegisteredService;
  }
  /**
   * Проверка существования конструктора в контейнере.
   *
   * @type {Service['hasService']}
   */
  get hasService() {
    return this._service.hasService;
  }
  /**
   * Добавить конструктор в контейнер.
   *
   * @type {Service['addService']}
   */
  get addService() {
    return this._service.addService;
  }
  /**
   * Добавить конструктор и создать экземпляр.
   *
   * @type {Service['useService']}
   */
  get useService() {
    return this._service.useService;
  }
  /**
   * Добавить конструктор и связанный экземпляр.
   *
   * @type {Service['setService']}
   */
  get setService() {
    return this._service.setService;
  }
  /**
   * Constructor.
   *
   * @param {ServiceContainer|undefined} container
   * @param {import('@e22m4u/js-debug').DebuggableOptions|undefined} options
   */
  constructor(container = void 0, options = void 0) {
    super(options);
    this._service = new Service(container);
  }
};
__name(_DebuggableService, "DebuggableService");
/**
 * Kinds.
 *
 * @type {string[]}
 */
__publicField(_DebuggableService, "kinds", Service.kinds);
var DebuggableService = _DebuggableService;

// dist/esm/repository-data-schema.js
var import_js_repository4 = require("@e22m4u/js-repository");

// dist/esm/get-data-schema-by-model-name.js
var import_ts_data_schema = require("@e22m4u/ts-data-schema");
var import_js_repository = require("@e22m4u/js-repository");
var import_js_repository2 = require("@e22m4u/js-repository");
var import_js_repository3 = require("@e22m4u/js-repository");
function getDataSchemaByModelName(dbSchema, modelName) {
  return {
    type: import_ts_data_schema.DataType.OBJECT,
    properties: getDataSchemaPropertiesByModelName(dbSchema, modelName)
  };
}
__name(getDataSchemaByModelName, "getDataSchemaByModelName");
function getDataSchemaPropertiesByModelName(dbSchema, modelName) {
  const res = {};
  const propsDef = dbSchema.getService(import_js_repository2.ModelDefinitionUtils).getPropertiesDefinitionInBaseModelHierarchy(modelName);
  Object.keys(propsDef).forEach((propName) => {
    const propDef = propsDef[propName];
    if (typeof propDef !== "object" || !propDef.primaryKey)
      return;
    res[propName] = convertPropertyDefinitionToDataSchema(dbSchema, propDef);
  });
  Object.keys(propsDef).forEach((propName) => {
    const propDef = propsDef[propName];
    if (typeof propDef === "object" && propDef.primaryKey)
      return;
    res[propName] = convertPropertyDefinitionToDataSchema(dbSchema, propDef);
  });
  const relsDef = dbSchema.getService(import_js_repository2.ModelDefinitionUtils).getRelationsDefinitionInBaseModelHierarchy(modelName);
  Object.keys(relsDef).forEach((relName) => {
    const relDef = relsDef[relName];
    const dsProps = convertRelationDefinitionToDataSchemaProperties(dbSchema, relName, relDef);
    Object.keys(dsProps).forEach((propName) => {
      if (dsProps[propName])
        res[propName] = dsProps[propName];
    });
  });
  return res;
}
__name(getDataSchemaPropertiesByModelName, "getDataSchemaPropertiesByModelName");
function convertPropertyDefinitionToDataSchema(dbSchema, propDef, forArrayItem = false) {
  const res = { type: import_ts_data_schema.DataType.ANY };
  let type;
  if (typeof propDef === "string") {
    type = propDef || import_js_repository3.DataType.ANY;
  } else if (forArrayItem) {
    type = propDef.itemType || import_js_repository3.DataType.ANY;
  } else {
    type = propDef.type || import_js_repository3.DataType.ANY;
  }
  switch (type) {
    case import_js_repository3.DataType.STRING:
      res.type = import_ts_data_schema.DataType.STRING;
      break;
    case import_js_repository3.DataType.NUMBER:
      res.type = import_ts_data_schema.DataType.NUMBER;
      break;
    case import_js_repository3.DataType.BOOLEAN:
      res.type = import_ts_data_schema.DataType.BOOLEAN;
      break;
    case import_js_repository3.DataType.OBJECT:
      res.type = import_ts_data_schema.DataType.OBJECT;
      if (typeof propDef === "object") {
        if (!forArrayItem && propDef.model)
          res.properties = getDataSchemaPropertiesByModelName(dbSchema, propDef.model);
        else if (forArrayItem && propDef.itemModel)
          res.properties = getDataSchemaPropertiesByModelName(dbSchema, propDef.itemModel);
      }
      break;
    case import_js_repository3.DataType.ARRAY:
      res.type = import_ts_data_schema.DataType.ARRAY;
      if (!forArrayItem && typeof propDef === "object" && propDef.itemType)
        res.items = convertPropertyDefinitionToDataSchema(dbSchema, propDef, true);
      break;
  }
  if (typeof propDef === "object" && propDef.required)
    res.required = true;
  if (typeof propDef === "object" && propDef.default !== void 0)
    res.default = propDef.default;
  return res;
}
__name(convertPropertyDefinitionToDataSchema, "convertPropertyDefinitionToDataSchema");
function convertRelationDefinitionToDataSchemaProperties(dbSchema, relName, relDef) {
  const res = {};
  switch (relDef.type) {
    case import_js_repository.RelationType.BELONGS_TO: {
      const utils = dbSchema.getService(import_js_repository2.ModelDefinitionUtils);
      let foreignKeyDataType = import_ts_data_schema.DataType.ANY;
      if ("model" in relDef && relDef.model) {
        const targetModelName = relDef.model;
        const targetPkPropName = utils.getPrimaryKeyAsPropertyName(targetModelName);
        foreignKeyDataType = utils.getDataTypeByPropertyName(targetModelName, targetPkPropName);
      }
      if (relDef.foreignKey) {
        res[relDef.foreignKey] = { type: foreignKeyDataType };
      } else {
        res[`${relName}Id`] = { type: foreignKeyDataType };
      }
      if (relDef.polymorphic) {
        if (relDef.discriminator) {
          res[relDef.discriminator] = { type: import_ts_data_schema.DataType.STRING };
        } else {
          res[`${relName}Type`] = { type: import_ts_data_schema.DataType.STRING };
        }
      }
      break;
    }
    case import_js_repository.RelationType.REFERENCES_MANY: {
      const utils = dbSchema.getService(import_js_repository2.ModelDefinitionUtils);
      let foreignKeyDataType = import_ts_data_schema.DataType.ANY;
      if ("model" in relDef && relDef.model) {
        const targetModelName = relDef.model;
        const targetPkPropName = utils.getPrimaryKeyAsPropertyName(targetModelName);
        foreignKeyDataType = utils.getDataTypeByPropertyName(targetModelName, targetPkPropName);
      }
      if (relDef.foreignKey) {
        res[relDef.foreignKey] = {
          type: import_ts_data_schema.DataType.ARRAY,
          items: { type: foreignKeyDataType }
        };
      } else {
        res[`${relName}Ids`] = {
          type: import_ts_data_schema.DataType.ARRAY,
          items: { type: foreignKeyDataType }
        };
      }
      break;
    }
  }
  return res;
}
__name(convertRelationDefinitionToDataSchemaProperties, "convertRelationDefinitionToDataSchemaProperties");

// dist/esm/get-data-schema-by-model-class.js
var import_ts_projection = require("@e22m4u/ts-projection");
var import_js_repository_decorators = require("@e22m4u/js-repository-decorators");
function getDataSchemaByModelClass(dbSchema, modelClass, projectionScope) {
  const classMd = import_js_repository_decorators.ModelReflector.getMetadata(modelClass);
  const modelName = (classMd == null ? void 0 : classMd.name) ?? modelClass.name;
  let dataSchema = getDataSchemaByModelName(dbSchema, modelName);
  if (projectionScope) {
    dataSchema = Object.assign({}, dataSchema);
    dataSchema.properties = (0, import_ts_projection.applyProjection)(projectionScope, modelClass, dataSchema.properties);
  }
  return dataSchema;
}
__name(getDataSchemaByModelClass, "getDataSchemaByModelClass");

// dist/esm/repository-data-schema.js
var _RepositoryDataSchema = class _RepositoryDataSchema extends Service {
  /**
   * Get data schema by model name.
   *
   * @param modelName
   */
  getDataSchemaByModelName(modelName) {
    const hasDbSchema = this.hasService(import_js_repository4.DatabaseSchema);
    if (!hasDbSchema)
      throw new import_js_format4.Errorf("A DatabaseSchema instance must be registered in the RepositoryDataSchema service.");
    return getDataSchemaByModelName(this.getService(import_js_repository4.DatabaseSchema), modelName);
  }
  /**
   * Get data schema by model class.
   *
   * @param modelClass
   * @param projectionScope
   */
  getDataSchemaByModelClass(modelClass, projectionScope) {
    const hasDbSchema = this.hasService(import_js_repository4.DatabaseSchema);
    if (!hasDbSchema)
      throw new import_js_format4.Errorf("A DatabaseSchema instance must be registered in the RepositoryDataSchema service.");
    return getDataSchemaByModelClass(this.getService(import_js_repository4.DatabaseSchema), modelClass, projectionScope);
  }
};
__name(_RepositoryDataSchema, "RepositoryDataSchema");
var RepositoryDataSchema = _RepositoryDataSchema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RepositoryDataSchema
});
