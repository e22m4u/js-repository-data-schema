import { Constructor } from './types.js';
import { DataSchema } from '@e22m4u/js-data-schema';
import { DatabaseSchema } from '@e22m4u/js-repository';
import { ProjectionScope } from '@e22m4u/ts-projection';
import { DataSchemaOptions } from './get-data-schema-by-model-name.js';
/**
 * Get data schema by model class.
 *
 * @param dbSchema
 * @param modelClass
 * @param projectionScope
 */
export declare function getDataSchemaByModelClass<T extends object>(dbSchema: DatabaseSchema, modelClass: Constructor<T>, projectionScope?: ProjectionScope, options?: DataSchemaOptions): DataSchema;
