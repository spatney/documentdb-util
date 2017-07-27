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

### List Collections

```javascript
let collections = await dbUtil.listCollections(database);
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
    id:"summer",
    serverScript: function(a,b){
        var context = getContext();
        var response = context.getResponse();
        let sum = a + b;
        response.setBody(sum);
    }
}

let procInstance = await dbUtil.createStoredProcedure(collection, proc);
let result = await dbUtil.executeStoredProcedure(procInstance,[1,2]);
```

### Create & execute Triggers

```javascript
let database = await dbUtil.database('test');
let collection = await dbUtil.collection(database, 'people');

let superTimeTrigger = {
    id: "validateDocumentContents",
    serverScript: function validate() {
        var context = getContext();
        var request = context.getRequest();
        var documentToCreate = request.getBody();
        var ts = new Date();
        documentToCreate["supertime"] = ts.getTime();
        request.setBody(documentToCreate);
    },
    triggerType: 'Pre',
    triggerOperation: 'Create'
}

let triggerInstance = await dbUtil.trigger(collection, superTimeTrigger);

await dbUtil.insert(collection, {
    name: 'penguin',
    profession: 'better guy',
    income: 200
}, { preTriggerInclude: [superTimeTrigger.id] });
```

### Create & execute User Defined Functions

```javascript
var taxUdf = {
    id: "tax",
    serverScript: function tax(income) {

        if (income == undefined)
            throw 'no input';

        if (income < 1000)
            return income * 0.1;
        else if (income < 10000)
            return income * 0.2;
        else
            return income * 0.4;
    }
}

let udf = await dbUtil.userDefinedFunction(collection, taxUdf);
await dbUtil.insert(collection, {
    name: 'boomer',
    profession: 'rich guy',
    income: 10000
});

let spec2 = {
    query: 'Select * from c WHERE udf.tax(c.income) > @taxAmount',
    parameters: [
        {
            name: '@taxAmount',
            value: 3000
        }
    ]
}

let doc2 = await dbUtil.query(collection, spec2);
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