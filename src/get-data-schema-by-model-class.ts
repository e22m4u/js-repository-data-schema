import {Constructor} from './types.js';
import {Schema} from '@e22m4u/js-repository';
import {DataSchema} from '@e22m4u/ts-data-schema';
import {applyProjection} from '@e22m4u/ts-projection';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {ModelReflector} from '@e22m4u/js-repository-decorators';
import {getDataSchemaByModelName} from './get-data-schema-by-model-name.js';

/**
 * Get data schema by model class.
 *
 * @param repSchema
 * @param modelClass
 * @param projectionScope
 */
export function getDataSchemaByModelClass<T extends object>(
  repSchema: Schema,
  modelClass: Constructor<T>,
  projectionScope?: ProjectionScope,
): DataSchema {
  const classMd = ModelReflector.getMetadata(modelClass);
  const modelName = classMd?.name ?? modelClass.name;
  let dataSchema = getDataSchemaByModelName(repSchema, modelName);
  if (projectionScope) {
    dataSchema = Object.assign({}, dataSchema);
    dataSchema.properties = applyProjection(
      projectionScope,
      modelClass,
      dataSchema.properties,
    );
  }
  return dataSchema;
}
