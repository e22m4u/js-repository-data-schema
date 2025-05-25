# @e22m4u/js-repository-data-schema

Модуль решает проблему конвертации *определения модели* описывающей коллекцию
базы данных в *схему данных*, которая используется REST-маршрутизатором для
обработки тела и параметров входящего запроса.

Схема данных [@e22m4u/ts-data-schema](https://www.npmjs.com/package/@e22m4u/ts-data-schema)  
Определение модели [@e22m4u/js-repository](https://www.npmjs.com/package/@e22m4u/js-repository#%D0%BC%D0%BE%D0%B4%D0%B5%D0%BB%D1%8C)  
REST-маршрутизатор [@e22m4u/ts-rest-router](https://www.npmjs.com/package/@e22m4u/ts-rest-router)

## Установка

```bash
npm install @e22m4u/js-repository-data-schema
```

## Использование

Модуль экспортирует класс `RepositoryDataSchema`, его глобальный экземпляр
и методы, рассматриваемые ниже. Прежде чем использовать методы, требуется
выполнить инъекцию схемы репозиториев в глобальный экземпляр сервиса
как это показано ниже.

```js
import {Schema} from '@e22m4u/js-repository';
import {repositoryDataSchema} from '@e22m4u/js-repository-data-schema';

const schema = new Schema();
repositoryDataSchema.setService(Schema, schema);
```

### getDataSchemaByModelName

Извлечение схемы данных по названию модели.

Определение:

```ts
declare const getDataSchemaByModelName: (modelName: string) => DataSchema;
```

Пример:

```js
import {repositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {getDataSchemaByModelName} from '@e22m4u/js-repository-data-schema';
// peerDependencies
import {Schema} from '@e22m4u/js-repository';
import {DataType} from '@e22m4u/js-repository';

const schema = new Schema();
repositoryDataSchema.setService(Schema, schema);

schema.defineModel({
  name: 'city',
  properties: {
    name: DataType.STRING,
    codes: {
      type: DataType.ARRAY,
      itemType: DataType.NUMBER,
    },
  },
});

const dataSchema = getDataSchemaByModelName('city');
console.log(dataSchema);
// {
//   type: 'object',
//   properties: {
//     name: {
//       type: 'string',
//     },
//     codes: {
//       type: 'array',
//       items: {
//         type: 'number',
//       },
//     },
//   },
// },
```

### getDataSchemaByModelClass

Извлечение схемы данных из класса модели.

Определение:

```ts
const getDataSchemaByModelClass: <T extends object>(
  modelClass: Constructor<T>,
  projectionScope?: ProjectionScope,
) => DataSchema
```

Базовый пример:

```ts
import {repositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {getDataSchemaByModelClass} from '@e22m4u/js-repository-data-schema';
// peerDependencies
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

const schema = new Schema();
repositoryDataSchema.setService(Schema, schema);

@model()
class City {
  @property(RepDataType.STRING)
  name!: string;
  
  @property({
    type: DataType.ARRAY,
    itemType: DataType.NUMBER,
  })
  codes!: number[];
}

schema.defineModel(getModelDefinitionFromClass(City));

const dataSchema = getDataSchemaByModelClass(City);
console.log(dataSchema);
// {
//   type: 'object',
//   properties: {
//     name: {
//       type: 'string',
//     },
//     codes: {
//       type: 'array',
//       items: {
//         type: 'number',
//       },
//     },
//   },
// },
```

Пример с использованием проекции:

```ts
import {repositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {getDataSchemaByModelClass} from '@e22m4u/js-repository-data-schema';
// peerDependencies
import {hiddenProperty} from '@e22m4u/ts-projection';
import {lockedProperty} from '@e22m4u/ts-projection';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

const schema = new Schema();
repositoryDataSchema.setService(Schema, schema);

@model()
class User {
  @property(RepDataType.STRING)
  name!: string;
  
  @lockedProperty() // исключается для INPUT
  @property(RepDataType.STRING)
  role!: string

  @hiddenProperty() // исключается для OUTPUT
  @property(RepDataType.STRING)
  password!: string;
}

schema.defineModel(getModelDefinitionFromClass(User));

const inputSchema = getDataSchemaByModelClass(User, ProjectionScope.INPUT);
console.log(inputSchema);
// {
//   type: 'object',
//   properties: {
//     name: {
//       type: 'string',
//     },
//     password: {
//       type: 'string',
//     },
//   },
// },

const outputSchema = getDataSchemaByModelClass(User, ProjectionScope.OUTPUT);
console.log(outputSchema);
// {
//   type: 'object',
//   properties: {
//     name: {
//       type: 'string',
//     },
//     role: {
//       type: 'string',
//     },
//   },
// },
```

## Тесты

```bash
npm run test
```

## Лицензия

MIT
