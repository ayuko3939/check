"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationToken = exports.user = exports.userPassword = exports.session = exports.authenticator = exports.account = void 0;
const sqlite_core_1 = require("drizzle-orm/sqlite-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.account = (0, sqlite_core_1.sqliteTable)("account", {
    userId: (0, sqlite_core_1.text)().notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    type: (0, sqlite_core_1.text)().notNull(),
    provider: (0, sqlite_core_1.text)().notNull(),
    providerAccountId: (0, sqlite_core_1.text)().notNull(),
    refreshToken: (0, sqlite_core_1.text)("refresh_token"),
    accessToken: (0, sqlite_core_1.text)("access_token"),
    expiresAt: (0, sqlite_core_1.integer)("expires_at"),
    tokenType: (0, sqlite_core_1.text)("token_type"),
    scope: (0, sqlite_core_1.text)(),
    idToken: (0, sqlite_core_1.text)("id_token"),
    sessionState: (0, sqlite_core_1.text)("session_state"),
}, (table) => [
    (0, sqlite_core_1.primaryKey)({ columns: [table.provider, table.providerAccountId], name: "account_provider_providerAccountId_pk" })
]);
exports.authenticator = (0, sqlite_core_1.sqliteTable)("authenticator", {
    credentialId: (0, sqlite_core_1.text)().notNull(),
    userId: (0, sqlite_core_1.text)().notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    providerAccountId: (0, sqlite_core_1.text)().notNull(),
    credentialPublicKey: (0, sqlite_core_1.text)().notNull(),
    counter: (0, sqlite_core_1.integer)().notNull(),
    credentialDeviceType: (0, sqlite_core_1.text)().notNull(),
    credentialBackedUp: (0, sqlite_core_1.integer)().notNull(),
    transports: (0, sqlite_core_1.text)(),
}, (table) => [
    (0, sqlite_core_1.uniqueIndex)("authenticator_credentialID_unique").on(table.credentialId),
    (0, sqlite_core_1.primaryKey)({ columns: [table.credentialId, table.userId], name: "authenticator_credentialID_userId_pk" })
]);
exports.session = (0, sqlite_core_1.sqliteTable)("session", {
    sessionToken: (0, sqlite_core_1.text)().primaryKey().notNull(),
    userId: (0, sqlite_core_1.text)().notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    expires: (0, sqlite_core_1.integer)().notNull(),
});
exports.userPassword = (0, sqlite_core_1.sqliteTable)("user_password", {
    userId: (0, sqlite_core_1.text)("user_id").primaryKey().notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    passwordHash: (0, sqlite_core_1.text)("password_hash").notNull(),
    createdAt: (0, sqlite_core_1.integer)("created_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
    updatedAt: (0, sqlite_core_1.integer)("updated_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
});
exports.user = (0, sqlite_core_1.sqliteTable)("user", {
    id: (0, sqlite_core_1.text)().primaryKey().notNull(),
    name: (0, sqlite_core_1.text)(),
    email: (0, sqlite_core_1.text)(),
    emailVerified: (0, sqlite_core_1.integer)(),
    image: (0, sqlite_core_1.text)(),
}, (table) => [
    (0, sqlite_core_1.uniqueIndex)("user_email_unique").on(table.email),
]);
exports.verificationToken = (0, sqlite_core_1.sqliteTable)("verificationToken", {
    identifier: (0, sqlite_core_1.text)().notNull(),
    token: (0, sqlite_core_1.text)().notNull(),
    expires: (0, sqlite_core_1.integer)().notNull(),
}, (table) => [
    (0, sqlite_core_1.primaryKey)({ columns: [table.identifier, table.token], name: "verificationToken_identifier_token_pk" })
]);
