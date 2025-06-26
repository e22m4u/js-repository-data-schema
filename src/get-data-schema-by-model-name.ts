import {DataType} from '@e22m4u/ts-data-schema';
import {DataSchema} from '@e22m4u/ts-data-schema';
import {RelationType} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {PropertyDefinition} from '@e22m4u/js-repository';
import {RelationDefinition} from '@e22m4u/js-repository';
import {BelongsToDefinition} from '@e22m4u/js-repository';
import {ModelDefinitionUtils} from '@e22m4u/js-repository';
import {DataSchemaProperties} from '@e22m4u/ts-data-schema';
import {DataType as RepDataType} from '@e22m4u/js-repository';
import {ReferencesManyDefinition} from '@e22m4u/js-repository';

/**
 * Get data schema by model name.
 *
 * @param dbSchema
 * @param modelName
 */
export function getDataSchemaByModelName(
  dbSchema: DatabaseSchema,
  modelName: string,
): DataSchema {
  return {
    type: DataType.OBJECT,
    properties: getDataSchemaPropertiesByModelName(dbSchema, modelName),
  };
}

/**
 * Get data schema properties by model name.
 *
 * @param dbSchema
 * @param modelName
 */
function getDataSchemaPropertiesByModelName(
  dbSchema: DatabaseSchema,
  modelName: string,
): DataSchemaProperties {
  const res: DataSchemaProperties = {};
  const propsDef = dbSchema
    .getService(ModelDefinitionUtils)
    .getPropertiesDefinitionInBaseModelHierarchy(modelName);
  Object.keys(propsDef).forEach(propName => {
    const propDef = propsDef[propName];
    res[propName] = convertPropertyDefinitionToDataSchema(dbSchema, propDef);
  });
  const relsDef = dbSchema
    .getService(ModelDefinitionUtils)
    .getRelationsDefinitionInBaseModelHierarchy(modelName);
  Object.keys(relsDef).forEach(relName => {
    const relDef = relsDef[relName];
    const dsProps = convertRelationDefinitionToDataSchemaProperties(
      dbSchema,
      relName,
      relDef,
    );
    Object.keys(dsProps).forEach(propName => {
      if (dsProps[propName]) res[propName] = dsProps[propName];
    });
  });
  return res;
}

/**
 * Convert property definition to data schema.
 *
 * @param dbSchema
 * @param propDef
 * @param forArrayItem
 */
function convertPropertyDefinitionToDataSchema(
  dbSchema: DatabaseSchema,
  propDef: PropertyDefinition,
  forArrayItem = false,
): DataSchema {
  const res: DataSchema = {type: DataType.ANY};
  let type: RepDataType;
  if (typeof propDef === 'string') {
    type = propDef || RepDataType.ANY;
  } else if (forArrayItem) {
    type = propDef.itemType || RepDataType.ANY;
  } else {
    type = propDef.type || RepDataType.ANY;
  }
  switch (type) {
    case RepDataType.STRING:
      res.type = DataType.STRING;
      break;
    case RepDataType.NUMBER:
      res.type = DataType.NUMBER;
      break;
    case RepDataType.BOOLEAN:
      res.type = DataType.BOOLEAN;
      break;
    case RepDataType.OBJECT:
      res.type = DataType.OBJECT;
      if (typeof propDef === 'object') {
        if (!forArrayItem && propDef.model)
          res.properties = getDataSchemaPropertiesByModelName(
            dbSchema,
            propDef.model,
          );
        else if (forArrayItem && propDef.itemModel)
          res.properties = getDataSchemaPropertiesByModelName(
            dbSchema,
            propDef.itemModel,
          );
      }
      break;
    case RepDataType.ARRAY:
      res.type = DataType.ARRAY;
      if (!forArrayItem && typeof propDef === 'object' && propDef.itemType)
        res.items = convertPropertyDefinitionToDataSchema(
          dbSchema,
          propDef,
          true,
        );
      break;
  }
  if (typeof propDef === 'object' && propDef.required) res.required = true;
  if (typeof propDef === 'object' && propDef.default !== undefined)
    res.default = propDef.default;
  return res;
}

/**
 * Convert relation definition to data schema properties.
 *
 * @param dbSchema
 * @param relName
 * @param relDef
 */
function convertRelationDefinitionToDataSchemaProperties(
  dbSchema: DatabaseSchema,
  relName: string,
  relDef: RelationDefinition,
): DataSchemaProperties {
  const res: DataSchemaProperties = {};
  switch (relDef.type) {
    case RelationType.BELONGS_TO: {
      const utils = dbSchema.getService(ModelDefinitionUtils);
      let foreignKeyDataType = DataType.ANY;
      if ('model' in relDef && relDef.model) {
        const targetModelName = (relDef as BelongsToDefinition).model;
        const targetPkPropName =
          utils.getPrimaryKeyAsPropertyName(targetModelName);
        foreignKeyDataType = utils.getDataTypeByPropertyName(
          targetModelName,
          targetPkPropName,
        );
      }
      if (relDef.foreignKey) {
        res[relDef.foreignKey] = {type: foreignKeyDataType};
      } else {
        res[`${relName}Id`] = {type: foreignKeyDataType};
      }
      if (relDef.polymorphic) {
        if (relDef.discriminator) {
          res[relDef.discriminator] = {type: DataType.STRING};
        } else {
          res[`${relName}Type`] = {type: DataType.STRING};
        }
      }
      break;
    }
    case RelationType.REFERENCES_MANY: {
      const utils = dbSchema.getService(ModelDefinitionUtils);
      let foreignKeyDataType = DataType.ANY;
      if ('model' in relDef && relDef.model) {
        const targetModelName = (relDef as ReferencesManyDefinition).model;
        const targetPkPropName =
          utils.getPrimaryKeyAsPropertyName(targetModelName);
        foreignKeyDataType = utils.getDataTypeByPropertyName(
          targetModelName,
          targetPkPropName,
        );
      }
      if (relDef.foreignKey) {
        res[relDef.foreignKey] = {
          type: DataType.ARRAY,
          items: {type: foreignKeyDataType},
        };
      } else {
        res[`${relName}Ids`] = {
          type: DataType.ARRAY,
          items: {type: foreignKeyDataType},
        };
      }
      break;
    }
  }
  return res;
}
