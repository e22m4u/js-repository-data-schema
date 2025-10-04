import { Service } from '@e22m4u/js-service';
import { DatabaseSchema } from '@e22m4u/js-repository';
import { getDataSchemaByModelName } from './get-data-schema-by-model-name.js';
import { getDataSchemaByModelClass } from './get-data-schema-by-model-class.js';
/**
 * Repository data schema utils.
 */
export class RepositoryDataSchema extends Service {
    /**
     * Get data schema by model name.
     *
     * @param modelName
     * @param options
     */
    getDataSchemaByModelName(modelName, options) {
        return getDataSchemaByModelName(this.getRegisteredService(DatabaseSchema), modelName, options);
    }
    /**
     * Get data schema by model class.
     *
     * @param modelClass
     * @param projectionScope
     * @param options
     */
    getDataSchemaByModelClass(modelClass, projectionScope, options) {
        return getDataSchemaByModelClass(this.getRegisteredService(DatabaseSchema), modelClass, projectionScope, options);
    }
}
