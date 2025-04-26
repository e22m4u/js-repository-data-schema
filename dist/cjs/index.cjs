"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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

// dist/esm/index.js
var index_exports = {};
__export(index_exports, {
  RepositoryDataSchema: () => RepositoryDataSchema,
  repositoryDataSchema: () => repositoryDataSchema
});
module.exports = __toCommonJS(index_exports);

// dist/esm/repository-data-schema.js
var import_js_format = require("@e22m4u/js-format");
var import_js_service = require("@e22m4u/js-service");
var import_js_repository4 = require("@e22m4u/js-repository");

// dist/esm/get-data-schema-by-model-name.js
var import_ts_data_schema = require("@e22m4u/ts-data-schema");
var import_js_repository = require("@e22m4u/js-repository");
var import_js_repository2 = require("@e22m4u/js-repository");
var import_js_repository3 = require("@e22m4u/js-repository");
function getDataSchemaByModelName(repSchema, modelName) {
  return {
    type: import_ts_data_schema.DataType.OBJECT,
    properties: getDataSchemaPropertiesByModelName(repSchema, modelName)
  };
}
__name(getDataSchemaByModelName, "getDataSchemaByModelName");
function getDataSchemaPropertiesByModelName(repSchema, modelName) {
  const res = {};
  const propsDef = repSchema.getService(import_js_repository2.ModelDefinitionUtils).getPropertiesDefinitionInBaseModelHierarchy(modelName);
  Object.keys(propsDef).forEach((propName) => {
    const propDef = propsDef[propName];
    res[propName] = convertPropertyDefinitionToDataSchema(repSchema, propDef);
  });
  const relsDef = repSchema.getService(import_js_repository2.ModelDefinitionUtils).getRelationsDefinitionInBaseModelHierarchy(modelName);
  Object.keys(relsDef).forEach((relName) => {
    const relDef = relsDef[relName];
    const dsProps = convertRelationDefinitionToDataSchemaProperties(relName, relDef);
    Object.keys(dsProps).forEach((propName) => {
      if (dsProps[propName])
        res[propName] = dsProps[propName];
    });
  });
  return res;
}
__name(getDataSchemaPropertiesByModelName, "getDataSchemaPropertiesByModelName");
function convertPropertyDefinitionToDataSchema(repSchema, propDef, forArrayItem = false) {
  const res = { type: import_ts_data_schema.DataType.STRING };
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
          res.properties = getDataSchemaPropertiesByModelName(repSchema, propDef.model);
        else if (forArrayItem && propDef.itemModel)
          res.properties = getDataSchemaPropertiesByModelName(repSchema, propDef.itemModel);
      }
      break;
    case import_js_repository3.DataType.ARRAY:
      res.type = import_ts_data_schema.DataType.ARRAY;
      if (!forArrayItem && typeof propDef === "object" && propDef.itemType)
        res.items = convertPropertyDefinitionToDataSchema(repSchema, propDef, true);
      break;
  }
  if (typeof propDef === "object" && propDef.required)
    res.required = true;
  if (typeof propDef === "object" && propDef.default !== void 0) {
    res.default = typeof propDef.default === "function" ? propDef.default() : propDef.default;
  }
  return res;
}
__name(convertPropertyDefinitionToDataSchema, "convertPropertyDefinitionToDataSchema");
function convertRelationDefinitionToDataSchemaProperties(relName, relDef) {
  const res = {};
  switch (relDef.type) {
    case import_js_repository.RelationType.BELONGS_TO:
      if (relDef.foreignKey) {
        res[relDef.foreignKey] = { type: import_ts_data_schema.DataType.STRING };
      } else {
        res[`${relName}Id`] = { type: import_ts_data_schema.DataType.STRING };
      }
      if (relDef.polymorphic) {
        if (relDef.discriminator) {
          res[relDef.discriminator] = { type: import_ts_data_schema.DataType.STRING };
        } else {
          res[`${relName}Type`] = { type: import_ts_data_schema.DataType.STRING };
        }
      }
      break;
    case import_js_repository.RelationType.REFERENCES_MANY:
      if (relDef.foreignKey) {
        res[relDef.foreignKey] = {
          type: import_ts_data_schema.DataType.ARRAY,
          items: { type: import_ts_data_schema.DataType.STRING }
        };
      } else {
        res[`${relName}Ids`] = {
          type: import_ts_data_schema.DataType.ARRAY,
          items: { type: import_ts_data_schema.DataType.STRING }
        };
      }
      break;
  }
  return res;
}
__name(convertRelationDefinitionToDataSchemaProperties, "convertRelationDefinitionToDataSchemaProperties");

// dist/esm/repository-data-schema.js
var _RepositoryDataSchema = class _RepositoryDataSchema extends import_js_service.Service {
  /**
   * Get data schema by model name.
   *
   * @param modelName
   */
  getDataSchemaByModelName(modelName) {
    const hasRepSchema = this.hasService(import_js_repository4.Schema);
    if (!hasRepSchema)
      throw new import_js_format.Errorf("A Schema instance must be registered in the RepositoryDataSchema service.");
    return getDataSchemaByModelName(this.getService(import_js_repository4.Schema), modelName);
  }
};
__name(_RepositoryDataSchema, "RepositoryDataSchema");
var RepositoryDataSchema = _RepositoryDataSchema;
var repositoryDataSchema = new RepositoryDataSchema();
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RepositoryDataSchema,
  repositoryDataSchema
});
