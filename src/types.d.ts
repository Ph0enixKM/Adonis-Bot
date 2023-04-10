/* eslint-disable @typescript-eslint/no-explicit-any */
// Declare module for cargodb
declare module 'cargodb' {
  export default class CargoDB {
    constructor(path: string, dbPath?: string);
    get(key: string): Promise<any>;
    set(key: string, value: any): Promise<void>;
    in(name: string): CargoDBCollection;
    create(name: string): void;
  }

  export type CargoDBCollection = {
    add(value: any): Promise<string>;
    get(id: string): Promise<any>;
    find(query: (item: any) => boolean): Promise<any[]>;
    set(id: string, value: any): Promise<void>;
    update(id: string, value: any): Promise<void>;
    remove(id: string): Promise<boolean>;
  };
}
