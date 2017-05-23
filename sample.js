var config = require('./config');
var DocumentDbUtility = require('./index');
var dbUtil = new DocumentDbUtility(config);

async function sample() {
    let database = await dbUtil.database('test');
    let collection = await dbUtil.collection(database, 'people');

    await dbUtil.insert(collection, {
        name:'penguin',
        profession: 'good guy'
    });

    let spec = {
        query: 'Select * from c where c.name = @name',
        parameters:[
            {
                name:'@name',
                value: 'penguin'
            }
        ]
    }

    let doc = (await dbUtil.query(collection, spec))[0];
    doc.profession = "bad guy";

    let docLink = dbUtil.createDocumentLink(database.id, collection.id, doc.id);

    await dbUtil.update(docLink, doc);
    await dbUtil.delete(docLink);

    let proc = {
        id:"summer",
        serverScript: function(a,b){
            var context = getContext();
            var response = context.getResponse();
            let sum = a + b;
            response.setBody(sum);
        }
    }

    let procInstance = await dbUtil.storedProcedure(collection, proc);
    let result = await dbUtil.executeStoredProcedure(procInstance,[1,2]);

    console.log(`Store procedure result -> ${result}`);

    await dbUtil.deleteCollection(database.id, collection.id);
    await dbUtil.deleteDatabase(database.id);
}

sample();