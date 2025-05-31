export declare const accountRelations: import("drizzle-orm/relations").Relations<"account", {
    user: import("drizzle-orm/relations").One<"user", true>;
}>;
export declare const userRelations: import("drizzle-orm/relations").Relations<"user", {
    accounts: import("drizzle-orm/relations").Many<"account">;
    authenticators: import("drizzle-orm/relations").Many<"authenticator">;
    players: import("drizzle-orm/relations").Many<"players">;
    sessions: import("drizzle-orm/relations").Many<"session">;
    tournamentMatches_winnerId: import("drizzle-orm/relations").Many<"tournament_matches">;
    tournamentMatches_player2Id: import("drizzle-orm/relations").Many<"tournament_matches">;
    tournamentMatches_player1Id: import("drizzle-orm/relations").Many<"tournament_matches">;
    tournamentParticipants: import("drizzle-orm/relations").Many<"tournament_participants">;
    tournaments_winnerId: import("drizzle-orm/relations").Many<"tournaments">;
    tournaments_creatorId: import("drizzle-orm/relations").Many<"tournaments">;
    userPasswords: import("drizzle-orm/relations").Many<"user_password">;
}>;
export declare const authenticatorRelations: import("drizzle-orm/relations").Relations<"authenticator", {
    user: import("drizzle-orm/relations").One<"user", true>;
}>;
export declare const playersRelations: import("drizzle-orm/relations").Relations<"players", {
    user: import("drizzle-orm/relations").One<"user", true>;
    game: import("drizzle-orm/relations").One<"games", true>;
}>;
export declare const gamesRelations: import("drizzle-orm/relations").Relations<"games", {
    players: import("drizzle-orm/relations").Many<"players">;
    tournamentMatches: import("drizzle-orm/relations").Many<"tournament_matches">;
}>;
export declare const sessionRelations: import("drizzle-orm/relations").Relations<"session", {
    user: import("drizzle-orm/relations").One<"user", true>;
}>;
export declare const tournamentMatchesRelations: import("drizzle-orm/relations").Relations<"tournament_matches", {
    game: import("drizzle-orm/relations").One<"games", false>;
    user_winnerId: import("drizzle-orm/relations").One<"user", false>;
    user_player2Id: import("drizzle-orm/relations").One<"user", true>;
    user_player1Id: import("drizzle-orm/relations").One<"user", true>;
    tournament: import("drizzle-orm/relations").One<"tournaments", true>;
}>;
export declare const tournamentsRelations: import("drizzle-orm/relations").Relations<"tournaments", {
    tournamentMatches: import("drizzle-orm/relations").Many<"tournament_matches">;
    tournamentParticipants: import("drizzle-orm/relations").Many<"tournament_participants">;
    user_winnerId: import("drizzle-orm/relations").One<"user", false>;
    user_creatorId: import("drizzle-orm/relations").One<"user", true>;
}>;
export declare const tournamentParticipantsRelations: import("drizzle-orm/relations").Relations<"tournament_participants", {
    user: import("drizzle-orm/relations").One<"user", true>;
    tournament: import("drizzle-orm/relations").One<"tournaments", true>;
}>;
export declare const userPasswordRelations: import("drizzle-orm/relations").Relations<"user_password", {
    user: import("drizzle-orm/relations").One<"user", true>;
}>;
//# sourceMappingURL=relations.d.ts.map