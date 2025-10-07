import { DataType } from '@e22m4u/ts-data-schema';
import { RelationType } from '@e22m4u/js-repository';
import { ModelDefinitionUtils } from '@e22m4u/js-repository';
import { DataType as RepDataType } from '@e22m4u/js-repository';
/**
 * Get data schema by model name.
 *
 * @param dbSchema
 * @param modelName
 */
export function getDataSchemaByModelName(dbSchema, modelName, options) {
    const dataSchema = { type: DataType.OBJECT };
    const properties = getDataSchemaPropertiesByModelName(dbSchema, modelName, options);
    if (Object.keys(properties).length) {
        dataSchema.properties = properties;
    }
    return dataSchema;
}
/**
 * Get data schema properties by model name.
 *
 * @param dbSchema
 * @param modelName
 * @param options
 */
function getDataSchemaPropertiesByModelName(dbSchema, modelName, options) {
    const res = {};
    const propsDef = dbSchema
        .getService(ModelDefinitionUtils)
        .getPropertiesDefinitionInBaseModelHierarchy(modelName);
    // чтобы первичный ключ был первый в схеме данных,
    // сначала добавляются схемы с флагом "primaryKey"
    Object.keys(propsDef).forEach(propName => {
        const propDef = propsDef[propName];
        if (typeof propDef !== 'object' || !propDef.primaryKey)
            return;
        res[propName] = convertPropertyDefinitionToDataSchema(dbSchema, propDef, false, options);
    });
    Object.keys(propsDef).forEach(propName => {
        const propDef = propsDef[propName];
        if (typeof propDef === 'object' && propDef.primaryKey)
            return;
        res[propName] = convertPropertyDefinitionToDataSchema(dbSchema, propDef, false, options);
    });
    const relsDef = dbSchema
        .getService(ModelDefinitionUtils)
        .getRelationsDefinitionInBaseModelHierarchy(modelName);
    Object.keys(relsDef).forEach(relName => {
        const relDef = relsDef[relName];
        const dsProps = convertRelationDefinitionToDataSchemaProperties(dbSchema, relName, relDef);
        Object.keys(dsProps).forEach(propName => {
            if (dsProps[propName])
                res[propName] = dsProps[propName];
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
 * @param options
 */
function convertPropertyDefinitionToDataSchema(dbSchema, propDef, forArrayItem = false, options) {
    const res = { type: DataType.ANY };
    let type;
    if (typeof propDef === 'string') {
        type = propDef || RepDataType.ANY;
    }
    else if (forArrayItem) {
        type = propDef.itemType || RepDataType.ANY;
    }
    else {
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
                    res.properties = getDataSchemaPropertiesByModelName(dbSchema, propDef.model, options);
                else if (forArrayItem && propDef.itemModel)
                    res.properties = getDataSchemaPropertiesByModelName(dbSchema, propDef.itemModel, options);
            }
            break;
        case RepDataType.ARRAY:
            res.type = DataType.ARRAY;
            if (!forArrayItem && typeof propDef === 'object' && propDef.itemType)
                res.items = convertPropertyDefinitionToDataSchema(dbSchema, propDef, true, options);
            break;
    }
    if (!options?.skipRequiredOptions &&
        typeof propDef === 'object' &&
        propDef.required) {
        res.required = true;
    }
    if (!options?.skipDefaultValues &&
        typeof propDef === 'object' &&
        propDef.default !== undefined) {
        res.default = propDef.default;
    }
    return res;
}
/**
 * Convert relation definition to data schema properties.
 *
 * @param dbSchema
 * @param relName
 * @param relDef
 */
function convertRelationDefinitionToDataSchemaProperties(dbSchema, relName, relDef) {
    const res = {};
    switch (relDef.type) {
        case RelationType.BELONGS_TO: {
            const utils = dbSchema.getService(ModelDefinitionUtils);
            let foreignKeyDataType = DataType.ANY;
            if ('model' in relDef && relDef.model) {
                const targetModelName = relDef.model;
                const targetPkPropName = utils.getPrimaryKeyAsPropertyName(targetModelName);
                foreignKeyDataType = utils.getDataTypeByPropertyName(targetModelName, targetPkPropName);
            }
            if (relDef.foreignKey) {
                res[relDef.foreignKey] = { type: foreignKeyDataType };
            }
            else {
                res[`${relName}Id`] = { type: foreignKeyDataType };
            }
            if (relDef.polymorphic) {
                if (relDef.discriminator) {
                    res[relDef.discriminator] = { type: DataType.STRING };
                }
                else {
                    res[`${relName}Type`] = { type: DataType.STRING };
                }
            }
            break;
        }
        case RelationType.REFERENCES_MANY: {
            const utils = dbSchema.getService(ModelDefinitionUtils);
            let foreignKeyDataType = DataType.ANY;
            if ('model' in relDef && relDef.model) {
                const targetModelName = relDef.model;
                const targetPkPropName = utils.getPrimaryKeyAsPropertyName(targetModelName);
                foreignKeyDataType = utils.getDataTypeByPropertyName(targetModelName, targetPkPropName);
            }
            if (relDef.foreignKey) {
                res[relDef.foreignKey] = {
                    type: DataType.ARRAY,
                    items: { type: foreignKeyDataType },
                };
            }
            else {
                res[`${relName}Ids`] = {
                    type: DataType.ARRAY,
                    items: { type: foreignKeyDataType },
                };
            }
            break;
        }
    }
    return res;
}
