import {Errorf} from '@e22m4u/js-format';
import {Service} from '@e22m4u/js-service';
import {Constructor} from '@e22m4u/js-repository';
import {DataSchema} from '@e22m4u/ts-data-schema';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {DataSchemaOptions} from './get-data-schema-by-model-name.js';
import {getDataSchemaByModelName} from './get-data-schema-by-model-name.js';
import {getDataSchemaByModelClass} from './get-data-schema-by-model-class.js';

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
  getDataSchemaByModelName(
    modelName: string,
    options?: DataSchemaOptions,
  ): DataSchema {
    const hasDbSchema = this.hasService(DatabaseSchema);
    if (!hasDbSchema)
      throw new Errorf(
        'A DatabaseSchema instance must be registered ' +
          'in the RepositoryDataSchema service.',
      );
    return getDataSchemaByModelName(
      this.getService(DatabaseSchema),
      modelName,
      options,
    );
  }

  /**
   * Get data schema by model class.
   *
   * @param modelClass
   * @param projectionScope
   * @param options
   */
  getDataSchemaByModelClass<T extends object>(
    modelClass: Constructor<T>,
    projectionScope?: ProjectionScope,
    options?: DataSchemaOptions,
  ) {
    const hasDbSchema = this.hasService(DatabaseSchema);
    if (!hasDbSchema)
      throw new Errorf(
        'A DatabaseSchema instance must be registered ' +
          'in the RepositoryDataSchema service.',
      );
    return getDataSchemaByModelClass(
      this.getService(DatabaseSchema),
      modelClass,
      projectionScope,
      options,
    );
  }
}
