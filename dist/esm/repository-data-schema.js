import { Errorf } from '@e22m4u/js-format';
import { Service } from '@e22m4u/js-service';
import { Schema } from '@e22m4u/js-repository';
import { getDataSchemaByModelName as baseGetDataSchemaByModelName } from './get-data-schema-by-model-name.js';
import { getDataSchemaByModelClass as baseGetDataSchemaByModelClass } from './get-data-schema-by-model-class.js';
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
        return baseGetDataSchemaByModelName(this.getService(Schema), modelName);
    }
    /**
     * Get data schema by model class.
     *
     * @param modelClass
     * @param projectionScope
     */
    getDataSchemaByModelClass(modelClass, projectionScope) {
        const hasRepSchema = this.hasService(Schema);
        if (!hasRepSchema)
            throw new Errorf('A Schema instance must be registered ' +
                'in the RepositoryDataSchema service.');
        return baseGetDataSchemaByModelClass(this.getService(Schema), modelClass, projectionScope);
    }
}
/**
 * Global instance of RepositoryDataService.
 */
export const repositoryDataSchema = new RepositoryDataSchema();
/**
 * Global instance method getDataSchemaByModelName.
 */
export const getDataSchemaByModelName = repositoryDataSchema.getDataSchemaByModelName.bind(repositoryDataSchema);
/**
 * Global instance method getDataSchemaByModelClass.
 */
export const getDataSchemaByModelClass = repositoryDataSchema.getDataSchemaByModelClass.bind(repositoryDataSchema);
