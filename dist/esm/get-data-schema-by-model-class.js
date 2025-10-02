import { applyProjection } from '@e22m4u/ts-projection';
import { ModelReflector } from '@e22m4u/js-repository-decorators';
import { getDataSchemaByModelName } from './get-data-schema-by-model-name.js';
/**
 * Get data schema by model class.
 *
 * @param dbSchema
 * @param modelClass
 * @param projectionScope
 */
export function getDataSchemaByModelClass(dbSchema, modelClass, projectionScope, options) {
    const classMd = ModelReflector.getMetadata(modelClass);
    const modelName = classMd?.name ?? modelClass.name;
    let dataSchema = getDataSchemaByModelName(dbSchema, modelName, options);
    if (projectionScope) {
        dataSchema = Object.assign({}, dataSchema);
        dataSchema.properties = applyProjection(projectionScope, modelClass, dataSchema.properties);
    }
    return dataSchema;
}
