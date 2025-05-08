export type TableSchema = {
    name: string,
    key: string,
    indexes?: string[]
}

export interface DatabaseSchema {
    version: number
    name: string
    tables: TableSchema[]
}

//
// export class DatabaseSchema {
//     version: number = 3
//     name: string = 'LumoDb'
//
//     FILES: StoreSchema = {
//         name: 'files',
//         key: 'fullPath',
//         indexes: ['name', 'extension', 'path', 'fullPath']
//     }
//
//     FILES_CONTENT: StoreSchema = {
//         name: 'files_content',
//         key: 'fullPath',
//         indexes: ['fullPath']
//     }
//
//
//     RECORDER: StoreSchema = {
//         name: 'recorder',
//         key: 'name',
//         indexes: []
//     }
//
//     PLUGINS: StoreSchema = {
//         name: 'plugins',
//         key: 'id',
//         indexes: []
//     }
//
//     stores(): StoreSchema[] {
//         return [this.FILES, this.FILES_CONTENT, this.RECORDER, this.PLUGINS]
//     }
// }
//
// export const LumoDbSchemaV1 = new DatabaseSchema()
