import {expect} from 'chai';
import {RelationType, Schema} from '@e22m4u/js-repository';
import {DataType} from '@e22m4u/ts-data-schema';
import {DataType as RepDataType} from '@e22m4u/js-repository';
import {getDataSchemaByModelName} from './get-data-schema-by-model-name.js';

describe('getDataSchemaByModelName', function () {
  it('sets properties from short definition', function () {
    const S = new Schema();
    S.defineModel({
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
    const res = getDataSchemaByModelName(S, 'myModel');
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {type: DataType.STRING},
        bar: {type: DataType.NUMBER},
        baz: {type: DataType.BOOLEAN},
        abc: {type: DataType.ARRAY},
        def: {type: DataType.OBJECT},
        zxc: {type: DataType.STRING},
      },
    });
  });

  it('sets properties from extended definition', function () {
    const S = new Schema();
    S.defineModel({
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
    const res = getDataSchemaByModelName(S, 'myModel');
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {type: DataType.STRING},
        bar: {type: DataType.NUMBER},
        baz: {type: DataType.BOOLEAN},
        abc: {type: DataType.ARRAY},
        def: {type: DataType.OBJECT},
        zxc: {type: DataType.STRING},
      },
    });
  });

  it('sets properties from base model (uses hierarchy)', function () {
    const S = new Schema();
    S.defineModel({
      name: 'myModel1',
      properties: {
        foo: RepDataType.STRING,
        bar: RepDataType.NUMBER,
        baz: RepDataType.BOOLEAN,
      },
    });
    S.defineModel({
      base: 'myModel1',
      name: 'myModel2',
      properties: {
        abc: RepDataType.ARRAY,
        def: RepDataType.OBJECT,
        zxc: RepDataType.ANY,
      },
    });
    const res = getDataSchemaByModelName(S, 'myModel2');
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {type: DataType.STRING},
        bar: {type: DataType.NUMBER},
        baz: {type: DataType.BOOLEAN},
        abc: {type: DataType.ARRAY},
        def: {type: DataType.OBJECT},
        zxc: {type: DataType.STRING},
      },
    });
  });

  it('sets "required" option', function () {
    const S = new Schema();
    S.defineModel({
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
    const res = getDataSchemaByModelName(S, 'myModel');
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {type: DataType.STRING, required: true},
        bar: {type: DataType.NUMBER, required: true},
        baz: {type: DataType.BOOLEAN, required: true},
        abc: {type: DataType.ARRAY, required: true},
        def: {type: DataType.OBJECT, required: true},
        zxc: {type: DataType.STRING, required: true},
      },
    });
  });

  describe('default values', function () {
    it('sets "default" option', function () {
      const S = new Schema();
      S.defineModel({
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
      const res = getDataSchemaByModelName(S, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {type: DataType.STRING, default: 'str'},
          bar: {type: DataType.NUMBER, default: 10},
          baz: {type: DataType.BOOLEAN, default: true},
          abc: {type: DataType.ARRAY, default: [1, 2, 3]},
          def: {type: DataType.OBJECT, default: {hello: 'world'}},
          zxc: {type: DataType.STRING, default: null},
        },
      });
    });

    it('sets factory as is', function () {
      const S = new Schema();
      const properties = {
        foo: {type: RepDataType.STRING, default: () => 'str'},
        bar: {type: RepDataType.NUMBER, default: () => 10},
        baz: {type: RepDataType.BOOLEAN, default: () => true},
        abc: {type: RepDataType.ARRAY, default: () => [1, 2, 3]},
        def: {type: RepDataType.OBJECT, default: () => ({hello: 'world'})},
        zxc: {type: RepDataType.ANY, default: () => null},
      };
      S.defineModel({
        name: 'myModel',
        properties,
      });
      const res = getDataSchemaByModelName(S, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {type: DataType.STRING, default: properties.foo.default},
          bar: {type: DataType.NUMBER, default: properties.bar.default},
          baz: {type: DataType.BOOLEAN, default: properties.baz.default},
          abc: {type: DataType.ARRAY, default: properties.abc.default},
          def: {type: DataType.OBJECT, default: properties.def.default},
          zxc: {type: DataType.STRING, default: properties.zxc.default},
        },
      });
    });
  });

  describe('Array', function () {
    it('sets items schema', function () {
      const S = new Schema();
      S.defineModel({
        name: 'myModel',
        properties: {
          foo: {
            type: RepDataType.ARRAY,
            itemType: RepDataType.STRING,
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'myModel');
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
      const S = new Schema();
      S.defineModel({
        name: 'myModel1',
        properties: {
          foo: {
            type: RepDataType.ARRAY,
            itemType: RepDataType.OBJECT,
            itemModel: 'myModel2',
          },
        },
      });
      S.defineModel({
        name: 'myModel2',
        properties: {
          bar: DataType.STRING,
        },
      });
      const res = getDataSchemaByModelName(S, 'myModel1');
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
      const S = new Schema();
      S.defineModel({
        name: 'myModel',
        properties: {
          foo: {
            type: RepDataType.ARRAY,
            itemType: RepDataType.ARRAY,
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'myModel');
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
      const S = new Schema();
      S.defineModel({
        name: 'myModel1',
        properties: {
          foo: {
            type: RepDataType.OBJECT,
            model: 'myModel2',
          },
        },
      });
      S.defineModel({
        name: 'myModel2',
        properties: {
          bar: {
            type: RepDataType.OBJECT,
            model: 'myModel3',
          },
        },
      });
      S.defineModel({
        name: 'myModel3',
        properties: {
          baz: RepDataType.STRING,
        },
      });
      const res = getDataSchemaByModelName(S, 'myModel1');
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
      const S = new Schema();
      S.defineModel({
        name: 'modelA',
        relations: {
          role: {
            type: RelationType.BELONGS_TO,
            model: 'modelB',
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          roleId: {type: DataType.STRING},
        },
      });
    });

    it('sets BELONGS_TO relation fields with specified "foreignKey" option', function () {
      const S = new Schema();
      S.defineModel({
        name: 'modelA',
        relations: {
          role: {
            type: RelationType.BELONGS_TO,
            model: 'modelB',
            foreignKey: 'roleIdentifier',
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          roleIdentifier: {type: DataType.STRING},
        },
      });
    });

    it('sets REFERENCES_MANY relation fields', function () {
      const S = new Schema();
      S.defineModel({
        name: 'modelA',
        relations: {
          role: {
            type: RelationType.REFERENCES_MANY,
            model: 'modelB',
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          roleIds: {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
          },
        },
      });
    });

    it('sets REFERENCES_MANY relation fields with specified "foreignKey" option', function () {
      const S = new Schema();
      S.defineModel({
        name: 'modelA',
        relations: {
          role: {
            type: RelationType.REFERENCES_MANY,
            model: 'modelB',
            foreignKey: 'roleIdentifiers',
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'modelA');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          roleIdentifiers: {
            type: DataType.ARRAY,
            items: {type: DataType.STRING},
          },
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields', function () {
      const S = new Schema();
      S.defineModel({
        name: 'myModel',
        relations: {
          reference: {
            type: RelationType.BELONGS_TO,
            polymorphic: true,
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          referenceId: {type: DataType.STRING},
          referenceType: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "foreignKey" option', function () {
      const S = new Schema();
      S.defineModel({
        name: 'myModel',
        relations: {
          reference: {
            type: RelationType.BELONGS_TO,
            foreignKey: 'myReferenceId',
            polymorphic: true,
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          myReferenceId: {type: DataType.STRING},
          referenceType: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "discriminator" option', function () {
      const S = new Schema();
      S.defineModel({
        name: 'myModel',
        relations: {
          reference: {
            type: RelationType.BELONGS_TO,
            discriminator: 'myReferenceType',
            polymorphic: true,
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          referenceId: {type: DataType.STRING},
          myReferenceType: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "foreignKey" and "discriminator" options', function () {
      const S = new Schema();
      S.defineModel({
        name: 'myModel',
        relations: {
          reference: {
            type: RelationType.BELONGS_TO,
            foreignKey: 'myReferenceId',
            discriminator: 'myReferenceType',
            polymorphic: true,
          },
        },
      });
      const res = getDataSchemaByModelName(S, 'myModel');
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          myReferenceId: {type: DataType.STRING},
          myReferenceType: {type: DataType.STRING},
        },
      });
    });
  });
});
