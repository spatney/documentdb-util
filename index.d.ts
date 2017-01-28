declare class DocumentDbUtility {
    constructor(config: { authKey: string, host: string });
    database(databaseId: string): {};
    collection(database: {}, collectionId: string): {};
    insert(collection: {}, documentDefinition: {}): {};
    delete(docLink: string): void;
    query(collection: {}, querySpec: { query: string, parameters: { name: string, value: string }[] });
    update(docLink: string, documentDefinition: {});
    deleteDatabase(databaseId: string);
    deleteCollection(databaseId: string, collectionId: string);
    createDocumentLink(databaseId: string, collectionId: string, documentId: string);
}

export = DocumentDbUtility;