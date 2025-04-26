import { Errorf } from '@e22m4u/js-format';
import { Service } from '@e22m4u/js-service';
import { Schema } from '@e22m4u/js-repository';
import { getDataSchemaByModelName } from './get-data-schema-by-model-name.js';
/**
 * Repository data schema utils.
 */
export class RepositoryDataSchema extends Service {
    /**
     * Get data schema by model name.
     *
     * @param modelName
     */
    getDataSchemaByModelName(modelName) {
        const hasRepSchema = this.hasService(Schema);
        if (!hasRepSchema)
            throw new Errorf('A Schema instance must be registered ' +
                'in the RepositoryDataSchema service.');
        return getDataSchemaByModelName(this.getService(Schema), modelName);
    }
}
/**
 * Global instance of the RepositoryDataService.
 */
export const repositoryDataSchema = new RepositoryDataSchema();
