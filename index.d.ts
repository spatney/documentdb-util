declare class DocumentDbUtility {
    constructor(config: { authKey: string, host: string });
    database(databaseId: string): Promise<{}>;
    collection(database: {}, collectionId: string): Promise<{}>;
    insert(collection: {}, documentDefinition: {}): Promise<{}>;
    delete(docLink: string): Promise<void>;
    query(collection: {}, querySpec: { query: string, parameters: { name: string, value: string }[] }):Promise<{}>;
    update(docLink: string, documentDefinition: {}):Promise<{}>;
    deleteDatabase(databaseId: string):Promise<{}>;
    deleteCollection(databaseId: string, collectionId: string):Promise<{}>;
    createDocumentLink(databaseId: string, collectionId: string, documentId: string):string;
    storedProcedure(collection:{}, proc:{id:string, body:Function});
    executeStoredProcedure(proc:{});
}

declare namespace DocumentDbUtility{}

export = DocumentDbUtility;