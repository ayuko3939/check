// ===========================================
// ゲームサービスの統合エクスポート
// ===========================================

import type { FastifyInstance, FastifyRequest } from 'fastify';
import type { 
  ClientMessage,
  PlayerSide
} from '../../../../shared/types/game';
import type { 
  GameRoom, 
  MessageContext,
  GameRoomsMap
} from '../../types/server';

// 分割されたサービスをインポート
import {
  handleChatMessage,
  handlePaddleMove,
  handleGameSettings,
  handleSurrender,
} from './MessageHandler';
import { startCountdown } from './GameStateManager';
import { 
  assignPlayerToRoom, 
  canStartGame, 
  handlePlayerDisconnect 
} from './PlayerManager';
import { 
  findAvailableRoom, 
  getOrCreateRoom, 
  isRoomFull 
} from './RoomManager';
import { startCountdown } from './GameStateManager';

// ゲームルームのマップ（グローバル状態）
export const gameRooms: GameRoomsMap = new Map();

// エラーハンドリング
function handleError(error: unknown, context: string): void {
  console.error(`[GameService] ${context}:`, error);
}

// 統一メッセージハンドラー
function handlePlayerMessage(
  message: Buffer, 
  playerSide: PlayerSide, 
  room: GameRoom, 
  roomId: string
): void {
  try {
    const data = JSON.parse(message.toString()) as ClientMessage;
    
    const context: MessageContext = {
      room,
      playerSide,
      roomId,
    };

    // メッセージタイプに応じて適切なハンドラーを呼び出し
    switch (data.type) {
      case 'chat':
        handleChatMessage(data, context);
        break;
      case 'paddleMove':
        handlePaddleMove(data, context);
        break;
      case 'gameSettings':
        handleGameSettings(data, context);
        // 設定後にゲーム開始条件をチェック
        if (canStartGame(room)) {
          startCountdown(room);
        }
        break;
      case 'surrender':
        handleSurrender(data, context);
        break;
      default:
        console.warn(`[GameService] Unknown message type: ${(data as any).type}`);
    }
  } catch (error) {
    handleError(error, 'Message processing');
  }
}

// WebSocket接続処理（自動マッチング）
export function handleGameConnection(
  connection: WebSocket,
  req: FastifyRequest,
  fastify: FastifyInstance
): void {
  try {
    const { roomId, room } = findAvailableRoom(gameRooms);
    assignPlayerToConnection(connection, req, fastify, room, roomId);
  } catch (error) {
    handleError(error, 'Game connection');
    connection.close(1011, 'サーバーエラーが発生しました');
  }
}

// WebSocket接続処理（ルームID指定）
export function handleGameConnectionWithRoomId(
  connection: WebSocket,
  req: FastifyRequest,
  fastify: FastifyInstance
): void {
  try {
    const { roomId } = req.params as { roomId: string };
    
    if (!roomId) {
      connection.close(1003, 'ルームIDが無効です');
      return;
    }

    const { room } = getOrCreateRoom(roomId, gameRooms);
    
    if (isRoomFull(room)) {
      connection.close(1008, 'ルームが満員です');
      return;
    }

    assignPlayerToConnection(connection, req, fastify, room, roomId);
  } catch (error) {
    handleError(error, 'Room connection');
    connection.close(1011, 'サーバーエラーが発生しました');
  }
}

// プレイヤーを接続に割り当て
function assignPlayerToConnection(
  connection: WebSocket,
  req: FastifyRequest,
  fastify: FastifyInstance,
  room: GameRoom,
  roomId: string
): void {
  try {
    // プレイヤーをルームに配置
    const side = assignPlayerToRoom(room, connection);
    
    if (!side) {
      connection.close(1008, 'プレイヤーの配置に失敗しました');
      return;
    }

    // メッセージ処理のイベントリスナーを設定
    connection.on('message', (message: Buffer) => {
      handlePlayerMessage(message, side, room, roomId);
    });

    // 切断処理のイベントリスナーを設定
    connection.on('close', () => {
      handlePlayerDisconnect(side, roomId, gameRooms);
    });

    // 初期化メッセージを送信
    const initMessage = JSON.stringify({
      type: 'init',
      side,
      state: room.state,
      roomId,
    });
    connection.send(initMessage);

    // 待機状態の通知（右プレイヤーがまだいない場合）
    if (side === 'left' && !room.players.right) {
      const waitingMessage = JSON.stringify({
        type: 'waitingForPlayer',
      });
      connection.send(waitingMessage);
    }

    // 右プレイヤー配置後にゲーム開始条件をチェック
    if (side === 'right' && canStartGame(room)) {
      startCountdown(room);
    }
  } catch (error) {
    handleError(error, 'Player assignment');
    connection.close(1011, 'プレイヤー配置エラー');
  }
}
