import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { mkdirSync } from "node:fs";
import dotenv from "dotenv";
import routes from "./routes";
import { dirname } from "path";

// 環境変数の読み込み
dotenv.config();

// ログファイルのディレクトリを作成
const logFilePath = process.env.LOG_FILE_PATH || "/logs/backend.log";
mkdirSync(dirname(logFilePath), { recursive: true });

// Fastifyインスタンスの作成
const fastify = Fastify({
  logger: {
    level: "debug",
    file: logFilePath,
    formatters: {
      // levelを文字列にする（"info", "warn", "error"）
      level: (label: string) => {
        return { level: label };
      },
    },
    // timestampをISO8601形式に設定
    timestamp: () => `,"time":"${new Date().toISOString()}"`,
    base: null, // pid, hostname等を削除
  },
});

// サーバー起動処理を関数にまとめる
const startServer = async () => {
  // CORSの設定
  await fastify.register(cors, {
    origin: [process.env.FRONTEND_URL ?? "http://localhost:3000"],
  });

  // WebSocketプラグインの登録
  await fastify.register(websocket);

  // REST APIルートの登録
  await fastify.register(routes);

  // ルートヘルスチェック
  fastify.get("/", (request, reply) => {
    reply.send({ status: "ok", message: "Pong game server is running" });
  });

  try {
    // サーバー起動
    const port = Number(process.env.PORT) || 3001;
    await fastify.listen({ port: port, host: "0.0.0.0" });
    console.log(`Server running at http://localhost:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// サーバーを起動
startServer();
