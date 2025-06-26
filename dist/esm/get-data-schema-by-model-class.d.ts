import { Constructor } from './types.js';
import { DataSchema } from '@e22m4u/ts-data-schema';
import { DatabaseSchema } from '@e22m4u/js-repository';
import { ProjectionScope } from '@e22m4u/ts-projection';
/**
 * Get data schema by model class.
 *
 * @param dbSchema
 * @param modelClass
 * @param projectionScope
 */
export declare function getDataSchemaByModelClass<T extends object>(dbSchema: DatabaseSchema, modelClass: Constructor<T>, projectionScope?: ProjectionScope): DataSchema;
