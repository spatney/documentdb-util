var config = require('./config');
var DatabaseUtil = require('./index')(config);

async function sample() {
    let database = await DatabaseUtil.database('test');
    let collection = await DatabaseUtil.collection(database, 'people');

    await DatabaseUtil.insert(collection, {
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

    let doc = (await DatabaseUtil.query(collection, spec))[0];
    doc.profession = "bad guy";

    let docLink = DatabaseUtil.createDocumentLink(database.id, collection.id, doc.id);

    await DatabaseUtil.update(docLink, doc);
    await DatabaseUtil.delete(docLink);
    await DatabaseUtil.deleteCollection(database.id, collection.id);
    await DatabaseUtil.deleteDatabase(database.id);
}

sample();