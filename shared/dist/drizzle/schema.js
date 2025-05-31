"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationToken = exports.user = exports.userPassword = exports.tournaments = exports.tournamentParticipants = exports.tournamentMatches = exports.session = exports.players = exports.games = exports.authenticator = exports.account = void 0;
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
exports.games = (0, sqlite_core_1.sqliteTable)("games", {
    id: (0, sqlite_core_1.text)().primaryKey().notNull(),
    startedAt: (0, sqlite_core_1.integer)("started_at").notNull(),
    endedAt: (0, sqlite_core_1.integer)("ended_at"),
    ballSpeed: (0, sqlite_core_1.integer)("ball_speed").notNull(),
    winningScore: (0, sqlite_core_1.integer)("winning_score").notNull(),
    endReason: (0, sqlite_core_1.text)("end_reason"),
    status: (0, sqlite_core_1.text)().default("in_progress").notNull(),
    createdAt: (0, sqlite_core_1.integer)("created_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
    updatedAt: (0, sqlite_core_1.integer)("updated_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
});
exports.players = (0, sqlite_core_1.sqliteTable)("players", {
    id: (0, sqlite_core_1.text)().primaryKey().notNull(),
    gameId: (0, sqlite_core_1.text)("game_id").notNull().references(() => exports.games.id, { onDelete: "cascade" }),
    userId: (0, sqlite_core_1.text)("user_id").notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    side: (0, sqlite_core_1.text)().notNull(),
    score: (0, sqlite_core_1.integer)().default(0).notNull(),
    result: (0, sqlite_core_1.text)().notNull(),
    createdAt: (0, sqlite_core_1.integer)("created_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
    updatedAt: (0, sqlite_core_1.integer)("updated_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => [
    (0, sqlite_core_1.uniqueIndex)("players_game_side_unique").on(table.gameId, table.side),
]);
exports.session = (0, sqlite_core_1.sqliteTable)("session", {
    sessionToken: (0, sqlite_core_1.text)().primaryKey().notNull(),
    userId: (0, sqlite_core_1.text)().notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    expires: (0, sqlite_core_1.integer)().notNull(),
});
exports.tournamentMatches = (0, sqlite_core_1.sqliteTable)("tournament_matches", {
    id: (0, sqlite_core_1.text)().primaryKey().notNull(),
    tournamentId: (0, sqlite_core_1.text)("tournament_id").notNull().references(() => exports.tournaments.id, { onDelete: "cascade" }),
    round: (0, sqlite_core_1.integer)().notNull(),
    matchNumber: (0, sqlite_core_1.integer)("match_number").notNull(),
    player1Id: (0, sqlite_core_1.text)("player1_id").notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    player2Id: (0, sqlite_core_1.text)("player2_id").notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    winnerId: (0, sqlite_core_1.text)("winner_id").references(() => exports.user.id),
    gameId: (0, sqlite_core_1.text)("game_id").references(() => exports.games.id),
    status: (0, sqlite_core_1.text)().default("pending").notNull(),
    scheduledAt: (0, sqlite_core_1.integer)("scheduled_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => [
    (0, sqlite_core_1.uniqueIndex)("tournament_round_match_unique").on(table.tournamentId, table.round, table.matchNumber),
]);
exports.tournamentParticipants = (0, sqlite_core_1.sqliteTable)("tournament_participants", {
    id: (0, sqlite_core_1.text)().primaryKey().notNull(),
    tournamentId: (0, sqlite_core_1.text)("tournament_id").notNull().references(() => exports.tournaments.id, { onDelete: "cascade" }),
    userId: (0, sqlite_core_1.text)("user_id").notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    status: (0, sqlite_core_1.text)().default("active").notNull(),
    eliminatedRound: (0, sqlite_core_1.integer)("eliminated_round"),
    joinedAt: (0, sqlite_core_1.integer)("joined_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
}, (table) => [
    (0, sqlite_core_1.uniqueIndex)("tournament_user_unique").on(table.tournamentId, table.userId),
]);
exports.tournaments = (0, sqlite_core_1.sqliteTable)("tournaments", {
    id: (0, sqlite_core_1.text)().primaryKey().notNull(),
    name: (0, sqlite_core_1.text)().notNull(),
    creatorId: (0, sqlite_core_1.text)("creator_id").notNull().references(() => exports.user.id, { onDelete: "cascade" }),
    status: (0, sqlite_core_1.text)().default("waiting").notNull(),
    maxParticipants: (0, sqlite_core_1.integer)("max_participants").notNull(),
    currentRound: (0, sqlite_core_1.integer)("current_round").default(0).notNull(),
    winnerId: (0, sqlite_core_1.text)("winner_id").references(() => exports.user.id),
    createdAt: (0, sqlite_core_1.integer)("created_at").default((0, drizzle_orm_1.sql) `(CURRENT_TIMESTAMP)`).notNull(),
    startedAt: (0, sqlite_core_1.integer)("started_at"),
    endedAt: (0, sqlite_core_1.integer)("ended_at"),
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
