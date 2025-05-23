"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const websocket_1 = __importDefault(require("@fastify/websocket"));
const node_fs_1 = require("node:fs");
const dotenv_1 = __importDefault(require("dotenv"));
const routes_1 = __importDefault(require("./routes"));
// 環境変数の読み込み
dotenv_1.default.config();
// ログファイルのディレクトリを作成
(0, node_fs_1.mkdirSync)("logs", { recursive: true });
// Fastifyインスタンスの作成
const fastify = (0, fastify_1.default)({
    logger: {
        level: "debug",
        file: "logs/server.log",
    },
});
// サーバー起動処理を関数にまとめる
const startServer = async () => {
    // CORSの設定
    await fastify.register(cors_1.default, {
        origin: [process.env.FRONTEND_URL ?? "http://localhost:3000"],
    });
    // WebSocketプラグインの登録
    await fastify.register(websocket_1.default);
    // REST APIルートの登録
    await fastify.register(routes_1.default);
    // ルートヘルスチェック
    fastify.get("/", (request, reply) => {
        reply.send({ status: "ok", message: "Pong game server is running" });
    });
    try {
        // サーバー起動
        const port = Number(process.env.PORT) || 3001;
        await fastify.listen({ port: port, host: "0.0.0.0" });
        console.log(`Server running at http://localhost:${port}`);
    }
    catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
// サーバーを起動
startServer();
