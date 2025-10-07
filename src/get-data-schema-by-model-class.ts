import {Constructor} from './types.js';
import {DataSchema} from '@e22m4u/ts-data-schema';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {applyProjection} from '@e22m4u/ts-projection';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {ModelReflector} from '@e22m4u/js-repository-decorators';
import {DataSchemaOptions} from './get-data-schema-by-model-name.js';
import {getDataSchemaByModelName} from './get-data-schema-by-model-name.js';

/**
 * Get data schema by model class.
 *
 * @param dbSchema
 * @param modelClass
 * @param projectionScope
 */
export function getDataSchemaByModelClass<T extends object>(
  dbSchema: DatabaseSchema,
  modelClass: Constructor<T>,
  projectionScope?: ProjectionScope,
  options?: DataSchemaOptions,
): DataSchema {
  const classMd = ModelReflector.getMetadata(modelClass);
  const modelName = classMd?.name ?? modelClass.name;
  let dataSchema = getDataSchemaByModelName(dbSchema, modelName, options);
  if (
    projectionScope &&
    dataSchema.properties &&
    Object.keys(dataSchema.properties).length
  ) {
    dataSchema = Object.assign({}, dataSchema);
    const properties = applyProjection(
      projectionScope,
      modelClass,
      dataSchema.properties,
    );
    if (properties && Object.keys(properties).length) {
      dataSchema.properties = properties;
    }
  }
  return dataSchema;
}
