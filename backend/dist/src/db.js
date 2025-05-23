"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = exports.client = void 0;
const libsql_1 = require("drizzle-orm/libsql");
const client_1 = require("@libsql/client");
const node_path_1 = __importDefault(require("node:path"));
require("dotenv/config");
const databaseFileName = `file:${node_path_1.default.join(process.env.DB_FILE_DIR ?? "../database", process.env.DB_FILE_NAME ?? "database.db")}`;
exports.client = (0, client_1.createClient)({
    url: databaseFileName,
});
exports.db = (0, libsql_1.drizzle)(exports.client, { logger: true });
