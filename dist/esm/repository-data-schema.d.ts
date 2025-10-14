import { Service } from '@e22m4u/js-service';
import { Constructor } from '@e22m4u/js-repository';
import { DataSchema } from '@e22m4u/js-data-schema';
import { ProjectionScope } from '@e22m4u/ts-projection';
import { DataSchemaOptions } from './get-data-schema-by-model-name.js';
/**
 * Repository data schema utils.
 */
export declare class RepositoryDataSchema extends Service {
    /**
     * Get data schema by model name.
     *
     * @param modelName
     * @param options
     */
    getDataSchemaByModelName(modelName: string, options?: DataSchemaOptions): DataSchema;
    /**
     * Get data schema by model class.
     *
     * @param modelClass
     * @param projectionScope
     * @param options
     */
    getDataSchemaByModelClass<T extends object>(modelClass: Constructor<T>, projectionScope?: ProjectionScope, options?: DataSchemaOptions): DataSchema;
}
