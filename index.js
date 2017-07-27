var DocumentDBClient = require('documentdb').DocumentClient;

/**
 * A utility for querying a doumentDb database.
 */
class DocumentDbUtility {
    /**
     *  constructor
     * 
     * @param {Object} config - Client configuration
     * @param {string} config.host - Host URL.
     * @param {string} config.authKey - Access key/token.
     */
    constructor(config) {
        this.client = new DocumentDBClient(config.host, {
            masterKey: config.authKey
        });
    }

    /**
     * Get or create database.
     * 
     * @param {string} databaseId - Id of the database.
     */
    database(databaseId) {
        return new Promise((resolve, reject) => {
            let querySpec = {
                query: 'SELECT * FROM root r WHERE r.id= @id',
                parameters: [{
                    name: '@id',
                    value: databaseId
                }]
            };

            this.client.queryDatabases(querySpec).toArray((err, results) => {
                if (err) return reject(err);

                if (results.length === 0) {
                    let databaseSpec = {
                        id: databaseId
                    };

                    this.client.createDatabase(databaseSpec, (err, created) => {
                        if (err) return reject(err);

                        resolve(created);
                    });

                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    /**
     * List Collections.
     * 
     * @param {string} databaseId - Id of the database.
     */

    listCollections(database) {
        return new Promise((resolve, reject) => {
            this.client.readCollections(database._self).toArray(function (err, cols) {
                if (err) {
                    reject(err);

                } else {
                    resolve(cols);
                }
            });
        });
    }

    /**
     * Get or create collection.
     * 
     * @param {Object} database - Database
     * @param {string} collectionId - Id of the collection.
     */
    collection(database, collectionId) {
        return new Promise((resolve, reject) => {
            let querySpec = {
                query: 'SELECT * FROM root r WHERE r.id=@id',
                parameters: [{
                    name: '@id',
                    value: collectionId
                }]
            };

            this.client.queryCollections(database._self, querySpec).toArray((err, results) => {
                if (err) return reject(err);

                if (results.length === 0) {
                    let collectionSpec = {
                        id: collectionId
                    };

                    this.client.createCollection(database._self, collectionSpec, (err, created) => {
                        resolve(created);
                    });

                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    /**
     * Get or Create stored procedure
     * 
     * @param {string} collection - Collection
     * @param {Function} proc - ACID transaction to be executed.
     */
    storedProcedure(collection, proc, options) {
        return new Promise((resolve, reject) => {
            let querySpec = {
                query: 'SELECT * FROM root r WHERE r.id=@id',
                parameters: [{
                    name: '@id',
                    value: proc.id
                }]
            };

            this.client.queryStoredProcedures(collection._self, querySpec).toArray((err, results) => {
                if (err) return reject(err);


                if (results.length === 0) {

                    this.client.createStoredProcedure(collection._self, proc, options, (err, response) => {
                        if (err) return reject(err);
                        resolve(response);
                    });

                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    /**
     * Delete stored procedure
     * 
     * @param {string} procedureLink - Procedure Link
     */
    deleteStoredProcedure(procedureLink, options) {
        return new Promise((resolve, reject) => {
            this.client.deleteStoredProcedure(procedureLink, options, (err, response) => {
                if (err) return reject(err);

                resolve(response);
            });
        });
    }

    /**
     * Create user defined function
     * 
     * @param {string} collection - Collection
     * @param {Function} udf - User defined function
     */
    userDefinedFunction(collection, udf, options) {
        return new Promise((resolve, reject) => {
            let querySpec = {
                query: 'SELECT * FROM root r WHERE r.id=@id',
                parameters: [{
                    name: '@id',
                    value: udf.id
                }]
            };

            this.client.queryUserDefinedFunctions(collection._self, querySpec).toArray((err, results) => {
                if (err) return reject(err);

                if (results.length === 0) {

                    this.client.createUserDefinedFunction(collection._self, udf, options, (err, response) => {
                        if (err) return reject(err);

                        resolve(response);
                    });
                } else {
                    resolve(results[0])
                }
            });
        });
    }

    /**
     * Delete User Defined Function
     * 
     * @param {string} functionLink - Function Link
     */
    deleteUserDefinedFunction(functionLink, options) {
        return new Promise((resolve, reject) => {
            this.client.deleteUserDefinedFunction(functionLink, options, (err, response) => {
                if (err) return reject(err);

                resolve(response);
            });
        });
    }

    /**
     * Get of create user defined function
     * 
     * @param {string} collection - Collection
     * @param {Function} trigger - Trigger
     */
    trigger(collection, trigger, options) {
        return new Promise((resolve, reject) => {
            let querySpec = {
                query: 'SELECT * FROM root r WHERE r.id=@id',
                parameters: [{
                    name: '@id',
                    value: trigger.id
                }]
            };

            this.client.queryTriggers(collection._self, querySpec).toArray((err, results) => {
                if (err) return reject(err);

                if (results.length === 0) {

                    this.client.createTrigger(collection._self, trigger, options, (err, response) => {
                        if (err) return reject(err);

                        resolve(response);
                    });
                } else {
                    resolve(results[0]);
                }
            });
        });
    }

    /**
     * Delete Trigger
     * 
     * @param {string} triggerLink - Trigger Link
     */
    deleteTrigger(triggerLink, options) {
        return new Promise((resolve, reject) => {
            this.client.deleteTrigger(triggerLink, options, (err, response) => {
                if (err) return reject(err);

                resolve(response);
            });
        });
    }

    /**
     * Execute stored procedure
     * 
     * @param {Object} proc
     */
    executeStoredProcedure(proc, params) {
        return new Promise((resolve, reject) => {
            this.client.executeStoredProcedure(proc._self, params, (err, response) => {
                if (err) return reject(err);

                resolve(response);
            });
        });
    }

    /**
     * Insert a document.
     * 
     * @param {string} collection - Collection.
     * @param {Object} documentDefinition - Document JSON.
     */
    insert(collection, documentDefinition, options) {
        return new Promise((resolve, reject) => {
            this.client.createDocument(collection._self, documentDefinition, options, (err, document) => {
                if (err) return reject(err);

                resolve(document);
            });
        });
    }

    /**
     * Delete a document.
     * 
     * @param {string} docLink - document link.
     */
    delete(docLink, options) {
        return new Promise((resolve, reject) => {
            this.client.deleteDocument(docLink, options, err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    /**
     * Delete a document.
     * 
     * @param {Object} collection - Collection.
     * @param {Object} [querySpec] - Query specification.
     */
    query(collection, querySpec) {
        querySpec = querySpec || {
            query: 'SELECT * FROM c'
        };
        return new Promise((resolve, reject) => {
            this.client.queryDocuments(collection._self, querySpec).toArray((err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    /**
     * Update a document.
     * 
     * @param {string} docLink - document link.
     * @param {Object} documentDefinition - Document JSON.
     */
    update(docLink, documentDefinition, options) {
        return new Promise((resolve, reject) => {
            this.client.replaceDocument(docLink, documentDefinition, options, function (err, updated, headers) {
                if (err) return reject(err);
                resolve(updated);
            });
        });
    }

    /**
     * Delete database.
     * 
     * @param {string} databaseId - Id of the database.
     */
    deleteDatabase(databaseId, options) {
        return new Promise((resolve, reject) => {
            let dbLink = 'dbs/' + databaseId;

            this.client.deleteDatabase(dbLink, options, err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    /**
     * Delete collection.
     * 
     * @param {string} databaseId - Id of the database.
     * @param {string} collectionId - Id of the collection.
     */
    deleteCollection(databaseId, collectionId, options) {
        return new Promise((resolve, reject) => {
            let dbLink = 'dbs/' + databaseId;
            let collLink = dbLink + '/colls/' + collectionId;

            this.client.deleteCollection(collLink, options, err => {
                if (err) return reject(err);
                resolve();
            });
        });
    }

    /**
     *  Create a document link
     * 
     * @param {string} databaseId - Id of the database.
     * @param {Object} collection - Collection.
     * @param {string} documentId - Id of the document to delete.
     */
    createDocumentLink(databaseId, collectionId, documentId) {
        return 'dbs/' + databaseId + '/colls/' + collectionId + '/docs/' + documentId;
    }
}

module.exports = DocumentDbUtility;