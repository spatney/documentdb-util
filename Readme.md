[![Npm Version](https://img.shields.io/npm/v/documentdb-util.svg?style=flat)](https://www.npmjs.com/package/documentdb-util)
[![Npm Downloads](https://img.shields.io/npm/dm/documentdb-util.svg?style=flat)](https://www.npmjs.com/package/documentdb-util)
# Document DB Utility
Here are some examples on how to use this Utility. Note, *await* is only avaliable as an experimental feature in Node. Each function returns a promise, so you can simple chain promises instead of using *await*.

### Get or Create Database

```javascript
await DatabaseUtil.database('test');
```

### Get or Create Collection

```javascript
let collection = await DatabaseUtil.collection(database, 'people');
```

### Insert Document

```javascript
await DatabaseUtil.insert(collection, {
        name:'penguin',
        profession: 'good guy'
    });
```

### Query for Documents

```javascript
let spec = {
        query: 'Select * from c where c.name = @name',
        parameters:[
            {
                name:'@name',
                value: 'penguin'
            }
        ]
    }

let docs = await DatabaseUtil.query(collection, spec);
```

### Update Document

```javascript
let docLink = DatabaseUtil.createDocumentLink(database.id, collection.id, doc.id);

await DatabaseUtil.update(docLink, doc);
```

### Delete Document
```javascript
let docLink = DatabaseUtil.createDocumentLink(database.id, collection.id, doc.id);

await DatabaseUtil.delete(docLink);
```
