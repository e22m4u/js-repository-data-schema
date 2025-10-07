import {expect} from 'chai';
import {noInput} from '@e22m4u/ts-projection';
import {noOutput} from '@e22m4u/ts-projection';
import {DataType} from '@e22m4u/ts-data-schema';
import {allowInput} from '@e22m4u/ts-projection';
import {allowOutput} from '@e22m4u/ts-projection';
import {RelationType} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {relation} from '@e22m4u/js-repository-decorators';
import {DataType as RepDataType} from '@e22m4u/js-repository';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';
import {getDataSchemaByModelClass} from './get-data-schema-by-model-class.js';

describe('getDataSchemaByModeClass', function () {
  it('sets properties from short definition', function () {
    @model()
    class MyModel {
      @property(RepDataType.STRING)
      foo?: string;
      @property(RepDataType.NUMBER)
      bar?: number;
      @property(RepDataType.BOOLEAN)
      baz?: boolean;
      @property(RepDataType.ARRAY)
      abc?: unknown[];
      @property(RepDataType.OBJECT)
      def?: object;
      @property(RepDataType.ANY)
      zxc?: unknown;
    }
    const dbs = new DatabaseSchema();
    dbs.defineModel(getModelDefinitionFromClass(MyModel));
    const res = getDataSchemaByModelClass(dbs, MyModel);
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
    @model()
    class MyModel {
      @property({type: RepDataType.STRING})
      foo?: string;
      @property({type: RepDataType.NUMBER})
      bar?: number;
      @property({type: RepDataType.BOOLEAN})
      baz?: boolean;
      @property({type: RepDataType.ARRAY})
      abc?: unknown[];
      @property({type: RepDataType.OBJECT})
      def?: object;
      @property({type: RepDataType.ANY})
      zxc?: unknown;
    }
    const dbs = new DatabaseSchema();
    dbs.defineModel(getModelDefinitionFromClass(MyModel));
    const res = getDataSchemaByModelClass(dbs, MyModel);
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
    @model()
    class MyModelA {
      @property({type: RepDataType.STRING})
      foo?: string;
      @property({type: RepDataType.NUMBER})
      bar?: number;
      @property({type: RepDataType.BOOLEAN})
      baz?: boolean;
    }
    @model({base: MyModelA.name})
    class MyModelB {
      @property({type: RepDataType.ARRAY})
      abc?: unknown[];
      @property({type: RepDataType.OBJECT})
      def?: object;
      @property({type: RepDataType.ANY})
      zxc?: unknown;
    }
    const dbs = new DatabaseSchema();
    dbs.defineModel(getModelDefinitionFromClass(MyModelA));
    dbs.defineModel(getModelDefinitionFromClass(MyModelB));
    const res = getDataSchemaByModelClass(dbs, MyModelB);
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
    @model()
    class MyModel {
      @property({
        type: RepDataType.STRING,
        required: true,
      })
      foo?: string;
      @property({
        type: RepDataType.NUMBER,
        required: true,
      })
      bar?: number;
      @property({
        type: RepDataType.BOOLEAN,
        required: true,
      })
      baz?: boolean;
      @property({
        type: RepDataType.ARRAY,
        required: true,
      })
      abc?: unknown[];
      @property({
        type: RepDataType.OBJECT,
        required: true,
      })
      def?: object;
      @property({
        type: RepDataType.ANY,
        required: true,
      })
      zxc?: unknown;
    }
    const dbs = new DatabaseSchema();
    dbs.defineModel(getModelDefinitionFromClass(MyModel));
    const res = getDataSchemaByModelClass(dbs, MyModel);
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

  it('produces data schema with custom model name', function () {
    @model({name: 'customName'})
    class MyModel {
      @property(RepDataType.STRING)
      foo?: string;
    }
    const dbs = new DatabaseSchema();
    dbs.defineModel(getModelDefinitionFromClass(MyModel));
    const res = getDataSchemaByModelClass(dbs, MyModel);
    expect(res).to.be.eql({
      type: DataType.OBJECT,
      properties: {
        foo: {
          type: DataType.STRING,
        },
      },
    });
  });

  it('should not return empty properties object if no properties specified in model', function () {
    @model()
    class MyModel {}
    const dbs = new DatabaseSchema();
    dbs.defineModel(getModelDefinitionFromClass(MyModel));
    const res = getDataSchemaByModelClass(dbs, MyModel);
    expect(res).to.be.eql({type: DataType.OBJECT});
  });

  it('should not return empty properties object even if the projection is specified', function () {
    @model()
    class MyModel {}
    const dbs = new DatabaseSchema();
    dbs.defineModel(getModelDefinitionFromClass(MyModel));
    const res1 = getDataSchemaByModelClass(dbs, MyModel, ProjectionScope.INPUT);
    const res2 = getDataSchemaByModelClass(
      dbs,
      MyModel,
      ProjectionScope.OUTPUT,
    );
    expect(res1).to.be.eql({type: DataType.OBJECT});
    expect(res2).to.be.eql({type: DataType.OBJECT});
  });

  describe('options', function () {
    it('skips the schema option "required" when the option "skipRequiredOptions" is true', function () {
      @model()
      class MyModel {
        @property({
          type: RepDataType.STRING,
          required: true,
        })
        foo?: string;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res1 = getDataSchemaByModelClass(dbs, MyModel, undefined, {
        skipRequiredOptions: true,
      });
      const res2 = getDataSchemaByModelClass(dbs, MyModel, undefined, {
        skipRequiredOptions: false,
      });
      expect(res1).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
          },
        },
      });
      expect(res2).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
            required: true,
          },
        },
      });
    });

    it('skips the schema option "default" when the option "skipDefaultValues" is true', function () {
      @model()
      class MyModel {
        @property({
          type: RepDataType.STRING,
          default: 'value',
        })
        foo?: string;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res1 = getDataSchemaByModelClass(dbs, MyModel, undefined, {
        skipDefaultValues: true,
      });
      const res2 = getDataSchemaByModelClass(dbs, MyModel, undefined, {
        skipDefaultValues: false,
      });
      expect(res1).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
          },
        },
      });
      expect(res2).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {
            type: DataType.STRING,
            default: 'value',
          },
        },
      });
    });
  });

  describe('default values', function () {
    it('sets "default" option', function () {
      @model()
      class MyModel {
        @property({
          type: RepDataType.STRING,
          default: 'str',
        })
        foo?: string;
        @property({
          type: RepDataType.NUMBER,
          default: 10,
        })
        bar?: number;
        @property({
          type: RepDataType.BOOLEAN,
          default: true,
        })
        baz?: boolean;
        @property({
          type: RepDataType.ARRAY,
          default: [1, 2, 3],
        })
        abc?: unknown[];
        @property({
          type: RepDataType.OBJECT,
          default: {hello: 'world'},
        })
        def?: object;
        @property({
          type: RepDataType.ANY,
          default: null,
        })
        zxc?: unknown;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
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
      const getFoo = () => 'str';
      const getBar = () => 10;
      const getBaz = () => true;
      const getAbc = () => [1, 2, 3];
      const getDef = () => ({hello: 'world'});
      const getZxc = () => null;
      @model()
      class MyModel {
        @property({
          type: RepDataType.STRING,
          default: getFoo,
        })
        foo?: string;
        @property({
          type: RepDataType.NUMBER,
          default: getBar,
        })
        bar?: number;
        @property({
          type: RepDataType.BOOLEAN,
          default: getBaz,
        })
        baz?: boolean;
        @property({
          type: RepDataType.ARRAY,
          default: getAbc,
        })
        abc?: unknown[];
        @property({
          type: RepDataType.OBJECT,
          default: getDef,
        })
        def?: object;
        @property({
          type: RepDataType.ANY,
          default: getZxc,
        })
        zxc?: unknown;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {type: DataType.STRING, default: getFoo},
          bar: {type: DataType.NUMBER, default: getBar},
          baz: {type: DataType.BOOLEAN, default: getBaz},
          abc: {type: DataType.ARRAY, default: getAbc},
          def: {type: DataType.OBJECT, default: getDef},
          zxc: {type: DataType.ANY, default: getZxc},
        },
      });
    });
  });

  describe('Array', function () {
    it('sets items schema', function () {
      @model()
      class MyModel {
        @property({
          type: RepDataType.ARRAY,
          itemType: RepDataType.STRING,
        })
        foo?: string[];
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
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
      @model()
      class myModelA {
        @property(DataType.STRING)
        bar?: string;
      }
      @model()
      class myModelB {
        @property({
          type: RepDataType.ARRAY,
          itemType: RepDataType.OBJECT,
          itemModel: myModelA.name,
        })
        foo?: myModelA[];
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(myModelA));
      dbs.defineModel(getModelDefinitionFromClass(myModelB));
      const res = getDataSchemaByModelClass(dbs, myModelB);
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
      @model()
      class MyModel {
        @property({
          type: RepDataType.ARRAY,
          itemType: RepDataType.ARRAY,
        })
        foo?: unknown[][];
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
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
      @model()
      class myModelA {
        @property(RepDataType.STRING)
        baz?: string;
      }
      @model()
      class myModelB {
        @property({
          type: RepDataType.OBJECT,
          model: myModelA.name,
        })
        bar?: myModelA;
      }
      @model()
      class myModelC {
        @property({
          type: RepDataType.OBJECT,
          model: myModelB.name,
        })
        foo?: myModelB;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(myModelA));
      dbs.defineModel(getModelDefinitionFromClass(myModelB));
      dbs.defineModel(getModelDefinitionFromClass(myModelC));
      const res = getDataSchemaByModelClass(dbs, myModelC);
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
      @model()
      class MyModelA {}
      @model()
      class MyModelB {
        @relation({
          type: RelationType.BELONGS_TO,
          model: MyModelA.name,
        })
        rel?: MyModelA;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModelA));
      dbs.defineModel(getModelDefinitionFromClass(MyModelB));
      const res = getDataSchemaByModelClass(dbs, MyModelB);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relId: {type: DataType.ANY},
        },
      });
    });

    it('sets BELONGS_TO relation fields with specified "foreignKey" option', function () {
      @model()
      class MyModelA {}
      @model()
      class MyModelB {
        @relation({
          type: RelationType.BELONGS_TO,
          model: MyModelA.name,
          foreignKey: 'customFk',
        })
        rel?: MyModelA;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModelA));
      dbs.defineModel(getModelDefinitionFromClass(MyModelB));
      const res = getDataSchemaByModelClass(dbs, MyModelB);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          customFk: {type: DataType.ANY},
        },
      });
    });

    it('sets BELONGS_TO relation fields with custom DataType of foreign key', function () {
      @model()
      class MyModelA {
        @property({
          type: DataType.STRING,
          primaryKey: true,
        })
        id?: string;
      }
      @model()
      class MyModelB {
        @relation({
          type: RelationType.BELONGS_TO,
          model: MyModelA.name,
        })
        rel?: MyModelA;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModelA));
      dbs.defineModel(getModelDefinitionFromClass(MyModelB));
      const res = getDataSchemaByModelClass(dbs, MyModelB);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relId: {type: DataType.STRING},
        },
      });
    });

    it('sets REFERENCES_MANY relation fields', function () {
      @model()
      class MyModelA {}
      @model()
      class MyModelB {
        @relation({
          type: RelationType.REFERENCES_MANY,
          model: MyModelA.name,
        })
        rel?: MyModelA[];
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModelA));
      dbs.defineModel(getModelDefinitionFromClass(MyModelB));
      const res = getDataSchemaByModelClass(dbs, MyModelB);
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
      @model()
      class MyModelA {}
      @model()
      class MyModelB {
        @relation({
          type: RelationType.REFERENCES_MANY,
          model: MyModelA.name,
          foreignKey: 'customFks',
        })
        rel?: MyModelA[];
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModelA));
      dbs.defineModel(getModelDefinitionFromClass(MyModelB));
      const res = getDataSchemaByModelClass(dbs, MyModelB);
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
      @model()
      class MyModelA {
        @property({
          type: DataType.STRING,
          primaryKey: true,
        })
        id?: string;
      }
      @model()
      class MyModelB {
        @relation({
          type: RelationType.REFERENCES_MANY,
          model: MyModelA.name,
        })
        rel?: MyModelA[];
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModelA));
      dbs.defineModel(getModelDefinitionFromClass(MyModelB));
      const res = getDataSchemaByModelClass(dbs, MyModelB);
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
      @model()
      class MyModel {
        @relation({
          type: RelationType.BELONGS_TO,
          polymorphic: true,
        })
        rel?: object;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relId: {type: DataType.ANY},
          relType: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "foreignKey" option', function () {
      @model()
      class MyModel {
        @relation({
          type: RelationType.BELONGS_TO,
          foreignKey: 'customFk',
          polymorphic: true,
        })
        rel?: object;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          customFk: {type: DataType.ANY},
          relType: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "discriminator" option', function () {
      @model()
      class MyModel {
        @relation({
          type: RelationType.BELONGS_TO,
          discriminator: 'customDisc',
          polymorphic: true,
        })
        rel?: object;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          relId: {type: DataType.ANY},
          customDisc: {type: DataType.STRING},
        },
      });
    });

    it('sets polymorphic BELONGS_TO relation fields with specified "foreignKey" and "discriminator" options', function () {
      @model()
      class MyModel {
        @relation({
          type: RelationType.BELONGS_TO,
          foreignKey: 'customFk',
          discriminator: 'customDisc',
          polymorphic: true,
        })
        rel?: object;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          customFk: {type: DataType.ANY},
          customDisc: {type: DataType.STRING},
        },
      });
    });
  });

  describe('projection', function () {
    it('does not use projection if projection scope is not specified', function () {
      @model()
      class MyModel {
        @noInput()
        @property(RepDataType.STRING)
        foo?: string;
        @allowInput()
        @property(RepDataType.STRING)
        bar?: string;
        @noOutput()
        @property(RepDataType.STRING)
        baz?: string;
        @allowOutput()
        @property(RepDataType.STRING)
        abc?: string;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(dbs, MyModel);
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {type: DataType.STRING},
          bar: {type: DataType.STRING},
          baz: {type: DataType.STRING},
          abc: {type: DataType.STRING},
        },
      });
    });

    it('uses INPUT projection by specified scope', function () {
      @model()
      class MyModel {
        @noInput()
        @property(RepDataType.STRING)
        foo?: string;
        @noOutput()
        @property(RepDataType.NUMBER)
        bar?: number;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(
        dbs,
        MyModel,
        ProjectionScope.INPUT,
      );
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          bar: {type: DataType.NUMBER},
        },
      });
    });

    it('uses OUTPUT projection by specified scope', function () {
      @model()
      class MyModel {
        @noInput()
        @property(RepDataType.STRING)
        foo?: string;
        @noOutput()
        @property(RepDataType.NUMBER)
        bar?: number;
      }
      const dbs = new DatabaseSchema();
      dbs.defineModel(getModelDefinitionFromClass(MyModel));
      const res = getDataSchemaByModelClass(
        dbs,
        MyModel,
        ProjectionScope.OUTPUT,
      );
      expect(res).to.be.eql({
        type: DataType.OBJECT,
        properties: {
          foo: {type: DataType.STRING},
        },
      });
    });
  });
});
