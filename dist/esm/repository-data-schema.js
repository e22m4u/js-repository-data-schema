import { Errorf } from '@e22m4u/js-format';
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
     */
    getDataSchemaByModelName(modelName) {
        const hasDbSchema = this.hasService(DatabaseSchema);
        if (!hasDbSchema)
            throw new Errorf('A DatabaseSchema instance must be registered ' +
                'in the RepositoryDataSchema service.');
        return getDataSchemaByModelName(this.getService(DatabaseSchema), modelName);
    }
    /**
     * Get data schema by model class.
     *
     * @param modelClass
     * @param projectionScope
     */
    getDataSchemaByModelClass(modelClass, projectionScope) {
        const hasDbSchema = this.hasService(DatabaseSchema);
        if (!hasDbSchema)
            throw new Errorf('A DatabaseSchema instance must be registered ' +
                'in the RepositoryDataSchema service.');
        return getDataSchemaByModelClass(this.getService(DatabaseSchema), modelClass, projectionScope);
    }
}
