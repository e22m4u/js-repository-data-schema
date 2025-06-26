import {expect} from 'chai';
import {RepositoryDataSchema} from './repository-data-schema.js';

describe('RepositoryDataSchema', function () {
  it('exports', function () {
    expect(typeof RepositoryDataSchema).to.be.eq('function');
  });
});
