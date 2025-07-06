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
var import_js_format2 = require("@e22m4u/js-format");

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
   * Получить существующий или новый экземпляр.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {*}
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
   * Проверка существования конструктора в контейнере.
   *
   * @param {*} ctor
   * @return {boolean}
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
   * @return {this}
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
   * @return {this}
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
   * @return {this}
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
   * @return {*}
   */
  getService(ctor, ...args) {
    return this.container.get(ctor, ...args);
  }
  /**
   * Проверка существования конструктора в контейнере.
   *
   * @param {*} ctor
   * @return {boolean}
   */
  hasService(ctor) {
    return this.container.has(ctor);
  }
  /**
   * Добавить конструктор в контейнер.
   *
   * @param {*} ctor
   * @param {*} args
   * @return {this}
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
   * @return {this}
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
   * @return {this}
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
      throw new import_js_format2.Errorf("A DatabaseSchema instance must be registered in the RepositoryDataSchema service.");
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
      throw new import_js_format2.Errorf("A DatabaseSchema instance must be registered in the RepositoryDataSchema service.");
    return getDataSchemaByModelClass(this.getService(import_js_repository4.DatabaseSchema), modelClass, projectionScope);
  }
};
__name(_RepositoryDataSchema, "RepositoryDataSchema");
var RepositoryDataSchema = _RepositoryDataSchema;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RepositoryDataSchema
});
