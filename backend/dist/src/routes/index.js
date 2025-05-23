"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = routes;
const user_1 = __importDefault(require("./user/user"));
const socket_1 = __importDefault(require("./game/socket"));
async function routes(fastify) {
    fastify.register(user_1.default, { prefix: "/user" });
    fastify.register(socket_1.default, { prefix: "/game" });
}
