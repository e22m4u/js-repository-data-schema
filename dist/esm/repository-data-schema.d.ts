import { Service } from '@e22m4u/js-service';
import { Constructor } from '@e22m4u/js-repository';
import { DataSchema } from '@e22m4u/ts-data-schema';
import { ProjectionScope } from '@e22m4u/ts-projection';
/**
 * Repository data schema utils.
 */
export declare class RepositoryDataSchema extends Service {
    /**
     * Get data schema by model name.
     *
     * @param modelName
     */
    getDataSchemaByModelName(modelName: string): DataSchema;
    /**
     * Get data schema by model class.
     *
     * @param modelClass
     * @param projectionScope
     */
    getDataSchemaByModelClass<T extends object>(modelClass: Constructor<T>, projectionScope?: ProjectionScope): DataSchema;
}
