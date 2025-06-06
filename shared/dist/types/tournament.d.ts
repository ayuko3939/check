export interface Tournament {
    id: string;
    name: string;
    creatorId: string;
    status: "waiting" | "in_progress" | "completed" | "cancelled";
    maxParticipants: number;
    currentRound: number;
    winnerId?: string;
    createdAt: number;
    startedAt?: number;
    endedAt?: number;
}
export interface TournamentParticipant {
    id: string;
    tournamentId: string;
    userId: string;
    status: "active" | "eliminated" | "winner";
    eliminatedRound?: number;
    joinedAt: number;
}
export interface TournamentMatch {
    id: string;
    tournamentId: string;
    round: number;
    matchNumber: number;
    player1Id: string;
    player2Id: string;
    winnerId?: string | null;
    gameId?: string | null;
    status: "pending" | "in_progress" | "completed";
    scheduledAt: number;
}
export interface TournamentWithDetails extends Tournament {
    participants: Array<TournamentParticipant & {
        userName: string;
    }>;
    currentMatches?: TournamentMatch[];
}
export interface CreateTournamentRequest {
    name: string;
    maxParticipants: number;
}
export interface JoinTournamentRequest {
    tournamentId: string;
}
export interface StartTournamentRequest {
    tournamentId: string;
}
export interface TournamentStatus {
    tournament: TournamentWithDetails;
    currentUserStatus?: "not_joined" | "joined" | "eliminated" | "active" | "winner";
}
//# sourceMappingURL=tournament.d.ts.map