import {expect} from 'chai';
import {repositoryDataSchema} from './repository-data-schema.js';
import {RepositoryDataSchema} from './repository-data-schema.js';
import {getDataSchemaByModelClass} from './repository-data-schema.js';
import {getDataSchemaByModelName} from './repository-data-schema.js';

describe('RepositoryDataSchema', function () {
  it('exports', function () {
    expect(typeof RepositoryDataSchema).to.be.eq('function');
    expect(repositoryDataSchema).to.be.instanceof(RepositoryDataSchema);
    expect(typeof getDataSchemaByModelName).to.be.eq('function');
    expect(typeof getDataSchemaByModelClass).to.be.eq('function');
  });
});
