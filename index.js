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
     * Insert a document.
     * 
     * @param {string} collection - Collection.
     * @param {Object} documentDefinition - Document JSON.
     */
    insert(collection, documentDefinition) {
        return new Promise((resolve, reject) => {
            this.client.createDocument(collection._self, documentDefinition, (err, document) => {
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
    delete(docLink) {
        return new Promise((resolve, reject) => {
            this.client.deleteDocument(docLink, err => {
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
    update(docLink, documentDefinition) {
        return new Promise((resolve, reject) => {
            this.client.replaceDocument(docLink, documentDefinition, function (err, updated, headers) {
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
    deleteDatabase(databaseId) {
        return new Promise((resolve, reject) => {
            let dbLink = 'dbs/' + databaseId;

            this.client.deleteDatabase(dbLink, err => {
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
    deleteCollection(databaseId, collectionId) {
        return new Promise((resolve, reject) => {
            let dbLink = 'dbs/' + databaseId;
            let collLink = dbLink + '/colls/' + collectionId;

            this.client.deleteCollection(collLink, err => {
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