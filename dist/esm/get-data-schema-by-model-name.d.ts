import { DataSchema } from '@e22m4u/ts-data-schema';
import { DatabaseSchema } from '@e22m4u/js-repository';
/**
 * Get data schema by model name.
 *
 * @param dbSchema
 * @param modelName
 */
export declare function getDataSchemaByModelName(dbSchema: DatabaseSchema, modelName: string): DataSchema;
