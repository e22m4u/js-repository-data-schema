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

Модуль экспортирует класс `RepositoryDataSchema` с методами для извлечения
*схемы данных* определенной модели. Прежде чем использовать методы, требуется
создать новый экземпляр данного класса и выполнить инъекцию вашего экземпляра
`DatabaseSchema` (схема базы данных).

```js
import {DatabaseSchema} from '@e22m4u/js-repository';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';

const dbs = new DatabaseSchema();
const rds = new RepositoryDataSchema();
rds.setService(DatabaseSchema, dbs);
```

### getDataSchemaByModelName

Извлечение схемы данных по названию модели.

Определение:

```ts
declare const getDataSchemaByModelName: (modelName: string) => DataSchema;
```

Пример:

```js
import {DataType} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';

const dbs = new DatabaseSchema();
const rds = new RepositoryDataSchema();
rds.setService(DatabaseSchema, dbs);

dbs.defineModel({
  name: 'city',
  properties: {
    name: DataType.STRING,
    codes: {
      type: DataType.ARRAY,
      itemType: DataType.NUMBER,
    },
  },
});

const schema = rds.getDataSchemaByModelName('city');
console.log(schema);
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
import {DataType} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';

const dbs = new DatabaseSchema();
const rds = new RepositoryDataSchema();
rds.setService(DatabaseSchema, dbs);

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

dbs.defineModel(getModelDefinitionFromClass(City));

const schema = rds.getDataSchemaByModelClass(City);
console.log(schema);
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
import {DataType} from '@e22m4u/js-repository';
import {DatabaseSchema} from '@e22m4u/js-repository';
import {hiddenProperty} from '@e22m4u/ts-projection';
import {lockedProperty} from '@e22m4u/ts-projection';
import {ProjectionScope} from '@e22m4u/ts-projection';
import {model} from '@e22m4u/js-repository-decorators';
import {property} from '@e22m4u/js-repository-decorators';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';
import {getModelDefinitionFromClass} from '@e22m4u/js-repository-decorators';

const dbs = new DatabaseSchema();
const rds = new RepositoryDataSchema();
rds.setService(DatabaseSchema, dbs);

@model()
class User {
  @property(DataType.STRING)
  name!: string;
  
  @lockedProperty() // исключается для INPUT
  @property(DataType.STRING)
  role!: string

  @hiddenProperty() // исключается для OUTPUT
  @property(DataType.STRING)
  password!: string;
}

dbs.defineModel(getModelDefinitionFromClass(User));

const inputSchema = rds.getDataSchemaByModelClass(User, ProjectionScope.INPUT);
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

const outputSchema = rds.getDataSchemaByModelClass(User, ProjectionScope.OUTPUT);
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
