import { Service } from '@e22m4u/js-service';
import { DataSchema } from '@e22m4u/ts-data-schema';
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
}
/**
 * Global instance of the RepositoryDataService.
 */
export declare const repositoryDataSchema: RepositoryDataSchema;
