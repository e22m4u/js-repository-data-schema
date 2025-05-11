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

Извлечение схемы данных модели `city` используя *глобальный экземпляр* сервиса.

```ts
import {Schema} from '@e22m4u/js-repository';
import {DataType} from '@e22m4u/ts-data-schema';
import {repositoryDataSchema} from '@e22m4u/js-repository-data-schema';

// создание схемы репозиториев
// и объявление модели "city"
const schema = new Schema();
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

// иньекция схемы репозиториев в глобальный сервис
// (выполняется однократно)
repositoryDataSchema.setService(Schema, schema);

// извлечение схемы данных модели "city"
// в формате @e22m4u/ts-data-schema
const dataSchema = repositoryDataSchema.getDataSchemaByModelName('city');
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

Извлечение схемы данных модели `city` используя *локальный экземпляр* сервиса.

```ts
import {Schema} from '@e22m4u/js-repository';
import {DataType} from '@e22m4u/ts-data-schema';
import {RepositoryDataSchema} from '@e22m4u/js-repository-data-schema';

// создание схемы репозиториев
// и объявление модели "city"
const schema = new Schema();
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

// создание экземпляра сервиса и иньекция
// схемы репозиториев (выполняется однократно)
const repositoryDataSchema = new RepositoryDataSchema();
repositoryDataSchema.setService(Schema, schema);

// извлечение схемы данных модели "city"
// в формате @e22m4u/ts-data-schema
const dataSchema = repositoryDataSchema.getDataSchemaByModelName('city');
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

## Тесты

```bash
npm run test
```

## Лицензия

MIT
