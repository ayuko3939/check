"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = gameIdRoute;
const index_1 = require("../../services/game/index");
async function gameIdRoute(fastify) {
    fastify.get("/", { websocket: true }, (connection, req) => {
        (0, index_1.handleGameConnection)(connection, req, fastify);
    });
    fastify.get("/:roomId", { websocket: true }, (connection, req) => {
        (0, index_1.handleGameConnectionWithRoomId)(connection, req, fastify);
    });
}
