import {expect} from 'chai';
import {DataType} from '@e22m4u/ts-data-schema';
import {RelationType} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {DataType as RepDataType} from '@e22m4u/js-repository';
import {getDataSchemaByModelName} from './get-data-schema-by-model-name.js';

describe('getDataSchemaByModelName', function () {
  it('sets properties from short definition', function () {
    const dbs = new DatabaseSchema();
    dbs.defineModel({
      name: 'myModel',
      properties: {
        foo: RepDataType.STRING,
        bar: RepDataType.NUMBER,
        baz: RepDataType.BOOLEAN,
        abc: RepDataType.ARRAY,
        def: RepDataType.OBJECT,
        zxc: RepDataType.ANY,
      },
    });
    const res = getDataSchemaByModelName(dbs, 'myModel');
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {type: DataType.STRING},
        bar: {type: DataType.NUMBER},
        baz: {type: DataType.BOOLEAN},
        abc: {type: DataType.ARRAY},
        def: {type: DataType.OBJECT},
        zxc: {type: DataType.ANY},
      },
    });
  });

  it('sets properties from extended definition', function () {
    const dbs = new DatabaseSchema();
    dbs.defineModel({
      name: 'myModel',
      properties: {
        foo: {type: RepDataType.STRING},
        bar: {type: RepDataType.NUMBER},
        baz: {type: RepDataType.BOOLEAN},
        abc: {type: RepDataType.ARRAY},
        def: {type: RepDataType.OBJECT},
        zxc: {type: RepDataType.ANY},
      },
    });
    const res = getDataSchemaByModelName(dbs, 'myModel');
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {type: DataType.STRING},
        bar: {type: DataType.NUMBER},
        baz: {type: DataType.BOOLEAN},
        abc: {type: DataType.ARRAY},
        def: {type: DataType.OBJECT},
        zxc: {type: DataType.ANY},
      },
    });
  });

  it('sets properties from base model (uses hierarchy)', function () {
    const dbs = new DatabaseSchema();
    dbs.defineModel({
      name: 'myModelA',
      properties: {
        foo: RepDataType.STRING,
        bar: RepDataType.NUMBER,
        baz: RepDataType.BOOLEAN,
      },
    });
    dbs.defineModel({
      base: 'myModelA',
      name: 'myModelB',
      properties: {
        abc: RepDataType.ARRAY,
        def: RepDataType.OBJECT,
        zxc: RepDataType.ANY,
      },
    });
    const res = getDataSchemaByModelName(dbs, 'myModelB');
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {type: DataType.STRING},
        bar: {type: DataType.NUMBER},
        baz: {type: DataType.BOOLEAN},
        abc: {type: DataType.ARRAY},
        def: {type: DataType.OBJECT},
        zxc: {type: DataType.ANY},
      },
    });
  });

  it('sets "required" option', function () {
    const dbs = new DatabaseSchema();
    dbs.defineModel({
      name: 'myModel',
      properties: {
        foo: {type: RepDataType.STRING, required: true},
        bar: {type: RepDataType.NUMBER, required: true},
        baz: {type: RepDataType.BOOLEAN, required: true},
        abc: {type: RepDataType.ARRAY, required: true},
        def: {type: RepDataType.OBJECT, required: true},
        zxc: {type: RepDataType.ANY, required: true},
      },
    });
    const res = getDataSchemaByModelName(dbs, 'myModel');
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {type: DataType.STRING, required: true},
        bar: {type: DataType.NUMBER, required: true},
        baz: {type: DataType.BOOLEAN, required: true},
        abc: {type: DataType.ARRAY, required: true},
        def: {type: DataType.OBJECT, required: true},
        zxc: {type: DataType.ANY, required: true},
      },
    });
  });

  it('adds primary key as first in data schema', function () {
    const dbs = new DatabaseSchema();
    dbs.defineModel({
      name: 'myModel',
      properties: {
        foo: {type: RepDataType.NUMBER},
        bar: {type: RepDataType.NUMBER, primaryKey: true},
      },
    });
    const res = getDataSchemaByModelName(dbs, 'myModel');
    expect(Object.keys(res.properties!)).to.be.eql(['bar', 'foo']);
  });

  it('should not return empty properties object if no properties specified in model', function () {
    const dbs = new DatabaseSchema();
    dbs.defineModel({name: 'myModel'});
    const res = getDataSchemaByModelName(dbs, 'myModel');
    expect(res).to.be.eql({type: DataType.OBJECT});
  });

  describe('options', function () {
    it('skips the schema option "required" when the option "skipRequiredOptions" is true', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        properties: {
          foo: {type: RepDataType.STRING, required: true},
          bar: {type: RepDataType.STRING, required: true},
        },
      });
      const res1 = getDataSchemaByModelName(dbs, 'myModel', {
        skipRequiredOptions: true,
      });
      const res2 = getDataSchemaByModelName(dbs, 'myModel', {
        skipRequiredOptions: false,
      });
      expect(res1.properties).to.be.eql({
        foo: {type: DataType.STRING},
        bar: {type: DataType.STRING},
      });
      expect(res2.properties).to.be.eql({
        foo: {type: DataType.STRING, required: true},
        bar: {type: DataType.STRING, required: true},
      });
    });

    it('skips the schema option "default" when the option "skipDefaultValues" is true', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        properties: {
          foo: {type: RepDataType.STRING, default: 'value1'},
          bar: {type: RepDataType.STRING, default: 'value2'},
        },
      });
      const res1 = getDataSchemaByModelName(dbs, 'myModel', {
        skipDefaultValues: true,
      });
      const res2 = getDataSchemaByModelName(dbs, 'myModel', {
        skipDefaultValues: false,
      });
      expect(res1.properties).to.be.eql({
        foo: {type: DataType.STRING},
        bar: {type: DataType.STRING},
      });
      expect(res2.properties).to.be.eql({
        foo: {type: DataType.STRING, default: 'value1'},
        bar: {type: DataType.STRING, default: 'value2'},
      });
    });
  });

  describe('default values', function () {
    it('sets "default" option', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        properties: {
          foo: {type: RepDataType.STRING, default: 'str'},
          bar: {type: RepDataType.NUMBER, default: 10},
          baz: {type: RepDataType.BOOLEAN, default: true},
          abc: {type: RepDataType.ARRAY, default: [1, 2, 3]},
          def: {type: RepDataType.OBJECT, default: {hello: 'world'}},
          zxc: {type: RepDataType.ANY, default: null},
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {type: DataType.STRING, default: 'str'},
          bar: {type: DataType.NUMBER, default: 10},
          baz: {type: DataType.BOOLEAN, default: true},
          abc: {type: DataType.ARRAY, default: [1, 2, 3]},
          def: {type: DataType.OBJECT, default: {hello: 'world'}},
          zxc: {type: DataType.ANY, default: null},
        },
      });
    });

    it('sets factory as is', function () {
      const dbs = new DatabaseSchema();
      const properties = {
        foo: {type: RepDataType.STRING, default: () => 'str'},
        bar: {type: RepDataType.NUMBER, default: () => 10},
        baz: {type: RepDataType.BOOLEAN, default: () => true},
        abc: {type: RepDataType.ARRAY, default: () => [1, 2, 3]},
        def: {type: RepDataType.OBJECT, default: () => ({hello: 'world'})},
        zxc: {type: RepDataType.ANY, default: () => null},
      };
      dbs.defineModel({
        name: 'myModel',
        properties,
      });
      const res = getDataSchemaByModelName(dbs, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {type: DataType.STRING, default: properties.foo.default},
          bar: {type: DataType.NUMBER, default: properties.bar.default},
          baz: {type: DataType.BOOLEAN, default: properties.baz.default},
          abc: {type: DataType.ARRAY, default: properties.abc.default},
          def: {type: DataType.OBJECT, default: properties.def.default},
          zxc: {type: DataType.ANY, default: properties.zxc.default},
        },
      });
    });
  });

  describe('Array', function () {
    it('sets items schema', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        properties: {
          foo: {
            type: RepDataType.ARRAY,
            itemType: RepDataType.STRING,
          },
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
          },
        },
      });
    });

    it('sets items model schema', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModelA',
        properties: {
          foo: {
            type: RepDataType.ARRAY,
            itemType: RepDataType.OBJECT,
            itemModel: 'myModelB',
          },
        },
      });
      dbs.defineModel({
        name: 'myModelB',
        properties: {
          bar: DataType.STRING,
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.ARRAY,
            items: {
              type: DataType.OBJECT,
              properties: {
                bar: {
                  type: DataType.STRING,
                },
              },
            },
          },
        },
      });
    });

    it('sets nested arrays schema', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        properties: {
          foo: {
            type: RepDataType.ARRAY,
            itemType: RepDataType.ARRAY,
          },
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.ARRAY,
            items: {
              type: DataType.ARRAY,
            },
          },
        },
      });
    });
  });

  describe('Object', function () {
    it('sets nested objects schema', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModelA',
        properties: {
          foo: {
            type: RepDataType.OBJECT,
            model: 'myModelB',
          },
        },
      });
      dbs.defineModel({
        name: 'myModelB',
        properties: {
          bar: {
            type: RepDataType.OBJECT,
            model: 'myModelC',
          },
        },
      });
      dbs.defineModel({
        name: 'myModelC',
        properties: {
          baz: RepDataType.STRING,
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.OBJECT,
            properties: {
              bar: {
                type: DataType.OBJECT,
                properties: {
                  baz: {
                    type: DataType.STRING,
                  },
                },
              },
            },
          },
        },
      });
    });
  });

  describe('relations', function () {
    it('sets BELONGS_TO relation fields', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          rel: {
            type: RelationType.BELONGS_TO,
            model: 'modelB',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
      });
      const res = getDataSchemaByModelName(dbs, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relId: {type: DataType.ANY},
        },
      });
    });

    it('sets BELONGS_TO relation fields with specified "foreignKey" option', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          rel: {
            type: RelationType.BELONGS_TO,
            model: 'modelB',
            foreignKey: 'customFk',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
      });
      const res = getDataSchemaByModelName(dbs, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          customFk: {type: DataType.ANY},
        },
      });
    });

    it('sets BELONGS_TO relation fields with custom DataType of foreign key', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          rel: {
            type: RelationType.BELONGS_TO,
            model: 'modelB',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        properties: {
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
        },
      });
      const res = getDataSchemaByModelName(dbs, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relId: {type: DataType.STRING},
        },
      });
    });

    it('sets REFERENCES_MANY relation fields', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          rel: {
            type: RelationType.REFERENCES_MANY,
            model: 'modelB',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
      });
      const res = getDataSchemaByModelName(dbs, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relIds: {
            type: DataType.ARRAY,
            items: {type: DataType.ANY},
          },
        },
      });
    });

    it('sets REFERENCES_MANY relation fields with specified "foreignKey" option', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          rel: {
            type: RelationType.REFERENCES_MANY,
            model: 'modelB',
            foreignKey: 'customFks',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
      });
      const res = getDataSchemaByModelName(dbs, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          customFks: {
            type: DataType.ARRAY,
            items: {type: DataType.ANY},
          },
        },
      });
    });

    it('sets REFERENCES_MANY relation fields with custom DataType of foreign key', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'modelA',
        relations: {
          rel: {
            type: RelationType.REFERENCES_MANY,
            model: 'modelB',
          },
        },
      });
      dbs.defineModel({
        name: 'modelB',
        properties: {
          id: {
            type: DataType.STRING,
            primaryKey: true,
          },
        },
      });
      const res = getDataSchemaByModelName(dbs, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relIds: {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
          },
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        relations: {
          rel: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relId: {type: DataType.ANY},
          relType: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "foreignKey" option', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        relations: {
          rel: {
            type: RelationType.BELONGS_TO,
            foreignKey: 'customFk',
            polymorphic: true,
          },
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          customFk: {type: DataType.ANY},
          relType: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "discriminator" option', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        relations: {
          rel: {
            type: RelationType.BELONGS_TO,
            discriminator: 'customDisc',
            polymorphic: true,
          },
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relId: {type: DataType.ANY},
          customDisc: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "foreignKey" and "discriminator" options', function () {
      const dbs = new DatabaseSchema();
      dbs.defineModel({
        name: 'myModel',
        relations: {
          rel: {
            type: RelationType.BELONGS_TO,
            foreignKey: 'customFk',
            discriminator: 'customDisc',
            polymorphic: true,
          },
        },
      });
      const res = getDataSchemaByModelName(dbs, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          customFk: {type: DataType.ANY},
          customDisc: {type: DataType.STRING},
        },
      });
    });
  });
});
