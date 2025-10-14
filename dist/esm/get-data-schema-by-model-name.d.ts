import { DataSchema } from '@e22m4u/js-data-schema';
import { DatabaseSchema } from '@e22m4u/js-repository';
/**
 * Data schema options.
 */
export type DataSchemaOptions = {
    skipDefaultValues?: boolean;
    skipRequiredOptions?: boolean;
};
/**
 * Get data schema by model name.
 *
 * @param dbSchema
 * @param modelName
 */
export declare function getDataSchemaByModelName(dbSchema: DatabaseSchema, modelName: string, options?: DataSchemaOptions): DataSchema;
