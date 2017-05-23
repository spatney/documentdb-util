var config = require('./config');
var DocumentDbUtility = require('./index');
var dbUtil = new DocumentDbUtility(config);

async function sample() {
    try {
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

        let spec = {
            query: 'Select * from c where c.name = @name',
            parameters: [
                {
                    name: '@name',
                    value: 'penguin'
                }
            ]
        }

        let doc = (await dbUtil.query(collection, spec))[0];
        console.log('doc', doc);
        doc.profession = "bad guy";

        let docLink = dbUtil.createDocumentLink(database.id, collection.id, doc.id);

        await dbUtil.update(docLink, doc);

        let proc = {
            id: "summer",
            serverScript: function (a, b) {
                var context = getContext();
                var response = context.getResponse();
                let sum = a + b;
                response.setBody(sum);
            }
        }

        let procInstance = await dbUtil.storedProcedure(collection, proc);
        let result = await dbUtil.executeStoredProcedure(procInstance, [1, 2]);
        console.log(`Store procedure result -> ${result}`);

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

        console.log('people', doc2)

        await dbUtil.delete(docLink);
        await dbUtil.deleteStoredProcedure(procInstance._self);
        await dbUtil.deleteTrigger(triggerInstance._self);
        await dbUtil.deleteCollection(database.id, collection.id);
        await dbUtil.deleteDatabase(database.id);

    } catch (e) {
        console.log('error', e);
    }
}

sample();