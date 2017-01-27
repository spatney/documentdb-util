[![Npm Version](https://img.shields.io/npm/v/powerbi-visuals-tools.svg?style=flat)](https://www.npmjs.com/package/documentdb-util)
[![Npm Downloads](https://img.shields.io/npm/dm/powerbi-visuals-tools.svg?style=flat)](https://www.npmjs.com/package/documentdb-util)
# Document DB Utility
Here are some examples on how to use this Utility. Note, *await* is only avaliable as an experimental feature in Node. Each function returns a promise, so you can simple chain promises instead of using *await*.

### Get or Create DB

```
await DatabaseUtil.database('test');
```

### Get or Create Collection

```
let collection = await DatabaseUtil.collection(database, 'people');
```

### Insert Document

```
await DatabaseUtil.insert(collection, {
        name:'penguin',
        profession: 'good guy'
    });
```

### Query for Documents

```
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

```
let docLink = DatabaseUtil.createDocumentLink(database.id, collection.id, doc.id);

await DatabaseUtil.update(docLink, doc);
```

### Delete Document
```
let docLink = DatabaseUtil.createDocumentLink(database.id, collection.id, doc.id);

await DatabaseUtil.delete(docLink);
```
