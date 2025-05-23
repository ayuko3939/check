"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = userRoutes;
const db_1 = require("../../db");
const schema_1 = require("../../../drizzle/schema");
const drizzle_orm_1 = require("drizzle-orm");
async function userRoutes(fastify) {
    fastify.get("/:id", async (request, reply) => {
        try {
            const { id } = request.params;
            const foundUser = await db_1.db.select().from(schema_1.user).where((0, drizzle_orm_1.eq)(schema_1.user.id, id));
            if (!foundUser) {
                return reply.status(404).send({ error: "ユーザーが見つかりません" });
            }
            return { user: foundUser };
        }
        catch (error) {
            fastify.log.error(`ユーザー取得エラー(ID: ${request.params.id}): ${error}`);
            return reply
                .status(500)
                .send({ error: "ユーザーの取得中にエラーが発生しました" });
        }
    });
}
