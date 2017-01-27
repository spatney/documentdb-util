var DocumentDBClient = require('documentdb').DocumentClient;

/**
 *  Document DB utility
 * 
 * @param {Object} config - Client configuration
 * @param {string} config.host - Host URL.
 * @param {string} config.authKey - Access key/token.
 */
function createUtility(config) {
    var client = new DocumentDBClient(config.host, {
        masterKey: config.authKey
    });

    var DatabaseUtil = {
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

                client.queryDatabases(querySpec).toArray((err, results) => {
                    if (err) return reject(err);

                    if (results.length === 0) {
                        let databaseSpec = {
                            id: databaseId
                        };

                        client.createDatabase(databaseSpec, (err, created) => {
                            if (err) return reject(err);

                            resolve(created);
                        });

                    } else {
                        resolve(results[0]);
                    }
                });
            });
        },

        /**
         * Get or create collection.
         * 
         * @param {Object} database - Database
         * @param {string} collectionId - Id of the collection.
         */
        collection(database, collectionId) {
            return new Promise((resolve, reject) => {
                var querySpec = {
                    query: 'SELECT * FROM root r WHERE r.id=@id',
                    parameters: [{
                        name: '@id',
                        value: collectionId
                    }]
                };

                client.queryCollections(database._self, querySpec).toArray((err, results) => {
                    if (err) return reject(err);

                    if (results.length === 0) {
                        var collectionSpec = {
                            id: collectionId
                        };

                        client.createCollection(database._self, collectionSpec, (err, created) => {
                            resolve(created);
                        });

                    } else {
                        resolve(results[0]);
                    }
                });
            });
        },

        /**
         * Insert a document.
         * 
         * @param {string} collection - Collection.
         * @param {Object} documentDefinition - Document JSON.
         */
        insert(collection, documentDefinition) {
            return new Promise((resolve, reject) => {
                client.createDocument(collection._self, documentDefinition, (err, document) => {
                    if (err) return reject(err);

                    resolve(document);
                });
            });
        },

        /**
         * Delete a document.
         * 
         * @param {string} docLink - document link.
         */
        delete(docLink) {
            return new Promise((resolve, reject) => {
                client.deleteDocument(docLink, err => {
                    if (err) return reject(err);
                    resolve();
                });
            })
        },

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
                client.queryDocuments(collection._self, querySpec).toArray((err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            })
        },
        /**
         * Update a document.
         * 
         * @param {string} docLink - document link.
         * @param {Object} documentDefinition - Document JSON.
         */
        update(docLink, documentDefinition) {
            return new Promise((resolve, reject) => {
                client.replaceDocument(docLink, documentDefinition, function (err, updated, headers) {
                    if (err) return reject(err);
                    resolve(updated);
                });
            })
        },

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
    return DatabaseUtil;
};

module.exports = createUtility;