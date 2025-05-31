"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userPasswordRelations = exports.tournamentParticipantsRelations = exports.tournamentsRelations = exports.tournamentMatchesRelations = exports.sessionRelations = exports.gamesRelations = exports.playersRelations = exports.authenticatorRelations = exports.userRelations = exports.accountRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const schema_1 = require("./schema");
exports.accountRelations = (0, relations_1.relations)(schema_1.account, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [schema_1.account.userId],
        references: [schema_1.user.id]
    }),
}));
exports.userRelations = (0, relations_1.relations)(schema_1.user, ({ many }) => ({
    accounts: many(schema_1.account),
    authenticators: many(schema_1.authenticator),
    players: many(schema_1.players),
    sessions: many(schema_1.session),
    tournamentMatches_winnerId: many(schema_1.tournamentMatches, {
        relationName: "tournamentMatches_winnerId_user_id"
    }),
    tournamentMatches_player2Id: many(schema_1.tournamentMatches, {
        relationName: "tournamentMatches_player2Id_user_id"
    }),
    tournamentMatches_player1Id: many(schema_1.tournamentMatches, {
        relationName: "tournamentMatches_player1Id_user_id"
    }),
    tournamentParticipants: many(schema_1.tournamentParticipants),
    tournaments_winnerId: many(schema_1.tournaments, {
        relationName: "tournaments_winnerId_user_id"
    }),
    tournaments_creatorId: many(schema_1.tournaments, {
        relationName: "tournaments_creatorId_user_id"
    }),
    userPasswords: many(schema_1.userPassword),
}));
exports.authenticatorRelations = (0, relations_1.relations)(schema_1.authenticator, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [schema_1.authenticator.userId],
        references: [schema_1.user.id]
    }),
}));
exports.playersRelations = (0, relations_1.relations)(schema_1.players, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [schema_1.players.userId],
        references: [schema_1.user.id]
    }),
    game: one(schema_1.games, {
        fields: [schema_1.players.gameId],
        references: [schema_1.games.id]
    }),
}));
exports.gamesRelations = (0, relations_1.relations)(schema_1.games, ({ many }) => ({
    players: many(schema_1.players),
    tournamentMatches: many(schema_1.tournamentMatches),
}));
exports.sessionRelations = (0, relations_1.relations)(schema_1.session, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [schema_1.session.userId],
        references: [schema_1.user.id]
    }),
}));
exports.tournamentMatchesRelations = (0, relations_1.relations)(schema_1.tournamentMatches, ({ one }) => ({
    game: one(schema_1.games, {
        fields: [schema_1.tournamentMatches.gameId],
        references: [schema_1.games.id]
    }),
    user_winnerId: one(schema_1.user, {
        fields: [schema_1.tournamentMatches.winnerId],
        references: [schema_1.user.id],
        relationName: "tournamentMatches_winnerId_user_id"
    }),
    user_player2Id: one(schema_1.user, {
        fields: [schema_1.tournamentMatches.player2Id],
        references: [schema_1.user.id],
        relationName: "tournamentMatches_player2Id_user_id"
    }),
    user_player1Id: one(schema_1.user, {
        fields: [schema_1.tournamentMatches.player1Id],
        references: [schema_1.user.id],
        relationName: "tournamentMatches_player1Id_user_id"
    }),
    tournament: one(schema_1.tournaments, {
        fields: [schema_1.tournamentMatches.tournamentId],
        references: [schema_1.tournaments.id]
    }),
}));
exports.tournamentsRelations = (0, relations_1.relations)(schema_1.tournaments, ({ one, many }) => ({
    tournamentMatches: many(schema_1.tournamentMatches),
    tournamentParticipants: many(schema_1.tournamentParticipants),
    user_winnerId: one(schema_1.user, {
        fields: [schema_1.tournaments.winnerId],
        references: [schema_1.user.id],
        relationName: "tournaments_winnerId_user_id"
    }),
    user_creatorId: one(schema_1.user, {
        fields: [schema_1.tournaments.creatorId],
        references: [schema_1.user.id],
        relationName: "tournaments_creatorId_user_id"
    }),
}));
exports.tournamentParticipantsRelations = (0, relations_1.relations)(schema_1.tournamentParticipants, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [schema_1.tournamentParticipants.userId],
        references: [schema_1.user.id]
    }),
    tournament: one(schema_1.tournaments, {
        fields: [schema_1.tournamentParticipants.tournamentId],
        references: [schema_1.tournaments.id]
    }),
}));
exports.userPasswordRelations = (0, relations_1.relations)(schema_1.userPassword, ({ one }) => ({
    user: one(schema_1.user, {
        fields: [schema_1.userPassword.userId],
        references: [schema_1.user.id]
    }),
}));
