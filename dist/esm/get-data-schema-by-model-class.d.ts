import { Constructor } from './types.js';
import { Schema } from '@e22m4u/js-repository';
import { DataSchema } from '@e22m4u/ts-data-schema';
import { ProjectionScope } from '@e22m4u/ts-projection';
/**
 * Get data schema by model class.
 *
 * @param repSchema
 * @param modelClass
 * @param projectionScope
 */
export declare function getDataSchemaByModelClass<T extends object>(repSchema: Schema, modelClass: Constructor<T>, projectionScope?: ProjectionScope): DataSchema;
