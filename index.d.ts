declare class DocumentDbUtility {
    constructor(config: { authKey: string, host: string });

    database(databaseId: string): Promise<{}>;
    collection(database: {}, collectionId: string): Promise<{}>;
    userDefinedFunction(collection: {}, udf: { id: string, serverScript: Function, options?: {} });
    trigger(collection: {}, proc: { id: string, serverScript: Function,options?:{}  });
    storedProcedure(collection: {}, proc: { id: string, serverScript: Function, options?: {} });

    insert(collection: {}, documentDefinition: {}, options?:{} ): Promise<{}>;
    update(docLink: string, documentDefinition: {}, options?:{} ): Promise<{}>;
    query(collection: {}, querySpec: { query: string, parameters: { name: string, value: string }[] }): Promise<{}>;
    executeStoredProcedure(proc: {}, params?: any[] );

    createDocumentLink(databaseId: string, collectionId: string, documentId: string): string;

    delete(docLink: string, options?:{} ): Promise<void>;
    deleteDatabase(databaseId: string, options?:{} ): Promise<{}>;
    deleteCollection(databaseId: string, collectionId: string, options?:{} ): Promise<{}>;
    deleteStoredProcedure(procedureLink: string, options?: {}): Promise<{}>;
    deleteTrigger(triggerLink: string, options?:{} ): Promise<{}>;
    deleteUserDefinedFunction(functionLink: string,options?:{} ): Promise<{}>;
}

declare namespace DocumentDbUtility { }

export = DocumentDbUtility;