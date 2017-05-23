[![Npm Version](https://img.shields.io/npm/v/documentdb-util.svg?style=flat)](https://www.npmjs.com/package/documentdb-util)
[![Npm Downloads](https://img.shields.io/npm/dm/documentdb-util.svg?style=flat)](https://www.npmjs.com/package/documentdb-util)

# Document DB Utility
Here are some examples on how to use this Utility. Note, *await* is only avaliable as an experimental feature in Node. Each function returns a promise, so you can simple chain promises instead of using *await*.

### Initialize the library
```javascript
var DocumentDbUtility = require('documentdb-util');
var dbUtil = new DocumentDbUtility({authKey:'KEY', host:'URL TO DOCDB'}));
```

### Get or Create Database

```javascript
await dbUtil.database('test');
```

### Get or Create Collection

```javascript
let collection = await dbUtil.collection(database, 'people');
```

### Insert Document

```javascript
await dbUtil.insert(collection, {
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

let docs = await dbUtil.query(collection, spec);
```

### Update Document

```javascript
let doc = (await dbUtil.query(collection, spec))[0];
doc.profession = "bad guy";

let docLink = dbUtil.createDocumentLink(database.id, collection.id, doc.id);

await dbUtil.update(docLink, doc);
```

### Create & execute Stored Procedure

```javascript
let proc = {
    id:"jello",
    serverScript: function() {
        var context = getContext();
        var response = context.getResponse();

        response.setBody("Hello from Proc");
    }
}

let procInstance = await dbUtil.storedProcedure(collection, proc);
let result = await dbUtil.executeStoredProcedure(procInstance);
```

### Delete Document
```javascript
let docLink = dbUtil.createDocumentLink(database.id, collection.id, doc.id);

await dbUtil.delete(docLink);
```

### Delete Database
```javascript
await dbUtil.deleteDatabase('name');
```

### Delete Collection
```javascript
await dbUtil.deleteCollection('dbName','collectionName');
```