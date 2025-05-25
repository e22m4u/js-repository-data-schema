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
/**
 * Global instance of RepositoryDataService.
 */
export declare const repositoryDataSchema: RepositoryDataSchema;
/**
 * Global instance method getDataSchemaByModelName.
 */
export declare const getDataSchemaByModelName: (modelName: string) => DataSchema;
/**
 * Global instance method getDataSchemaByModelClass.
 */
export declare const getDataSchemaByModelClass: <T extends object>(modelClass: Constructor<T>, projectionScope?: ProjectionScope) => DataSchema;
