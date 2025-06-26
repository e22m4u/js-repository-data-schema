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
  getDataSchemaByModelClass: () => getDataSchemaByModelClass2,
  getDataSchemaByModelName: () => getDataSchemaByModelName2,
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
var _RepositoryDataSchema = class _RepositoryDataSchema extends import_js_service.Service {
  /**
   * Get data schema by model name.
   *
   * @param modelName
   */
  getDataSchemaByModelName(modelName) {
    const hasRepSchema = this.hasService(import_js_repository4.DatabaseSchema);
    if (!hasRepSchema)
      throw new import_js_format.Errorf("A DatabaseSchema instance must be registered in the RepositoryDataSchema service.");
    return getDataSchemaByModelName(this.getService(import_js_repository4.DatabaseSchema), modelName);
  }
  /**
   * Get data schema by model class.
   *
   * @param modelClass
   * @param projectionScope
   */
  getDataSchemaByModelClass(modelClass, projectionScope) {
    const hasRepSchema = this.hasService(import_js_repository4.DatabaseSchema);
    if (!hasRepSchema)
      throw new import_js_format.Errorf("A DatabaseSchema instance must be registered in the RepositoryDataSchema service.");
    return getDataSchemaByModelClass(this.getService(import_js_repository4.DatabaseSchema), modelClass, projectionScope);
  }
};
__name(_RepositoryDataSchema, "RepositoryDataSchema");
var RepositoryDataSchema = _RepositoryDataSchema;
var repositoryDataSchema = new RepositoryDataSchema();
var getDataSchemaByModelName2 = repositoryDataSchema.getDataSchemaByModelName.bind(repositoryDataSchema);
var getDataSchemaByModelClass2 = repositoryDataSchema.getDataSchemaByModelClass.bind(repositoryDataSchema);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RepositoryDataSchema,
  getDataSchemaByModelClass,
  getDataSchemaByModelName,
  repositoryDataSchema
});
