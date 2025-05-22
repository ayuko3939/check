// ===========================================
// ルーム管理のみを担当
// ===========================================

import { v4 as uuidv4 } from 'uuid';
import type { 
  GameRoom, 
  GameRoomsMap 
} from '../../types/server';
import { createInitialGameState } from './GameConfig';

// エラーハンドリング
function handleError(error: unknown, context: string): void {
  console.error(`[RoomManager] ${context}:`, error);
}

// 新しいゲームルームを作成
export function createGameRoom(roomId?: string): GameRoom {
  try {
    const id = roomId || uuidv4();
    
    const room: GameRoom = {
      id,
      players: {},
      state: createInitialGameState(),
      chats: [],
      settings: {
        ballSpeed: 3,
        winningScore: 10,
      },
      timers: {},
      leftPlayerReady: false,
    };

    console.log(`[RoomManager] Created new room: ${id}`);
    return room;
  } catch (error) {
    handleError(error, 'Room creation');
    throw new Error('ルームの作成に失敗しました');
  }
}

// 利用可能なルームを検索（空きがあるルーム）
export function findAvailableRoom(gameRooms: GameRoomsMap): { roomId: string; room: GameRoom } {
  try {
    // 既存のルームで空きがあるものを探す
    for (const [roomId, room] of gameRooms.entries()) {
      if (!room.players.left || !room.players.right) {
        console.log(`[RoomManager] Found available room: ${roomId}`);
        return { roomId, room };
      }
    }

    // 空きルームがない場合は新規作成
    const newRoomId = uuidv4();
    const newRoom = createGameRoom(newRoomId);
    gameRooms.set(newRoomId, newRoom);

    console.log(`[RoomManager] Created new room for player: ${newRoomId}`);
    return { roomId: newRoomId, room: newRoom };
  } catch (error) {
    handleError(error, 'Room search');
    throw new Error('利用可能なルームの検索に失敗しました');
  }
}

// 指定IDのルームを取得または作成
export function getOrCreateRoom(roomId: string, gameRooms: GameRoomsMap): { roomId: string; room: GameRoom } {
  try {
    const existingRoom = gameRooms.get(roomId);
    
    if (existingRoom) {
      console.log(`[RoomManager] Found existing room: ${roomId}`);
      return { roomId, room: existingRoom };
    }

    // 指定IDで新規作成
    const newRoom = createGameRoom(roomId);
    gameRooms.set(roomId, newRoom);

    console.log(`[RoomManager] Created room with specified ID: ${roomId}`);
    return { roomId, room: newRoom };
  } catch (error) {
    handleError(error, 'Room get or create');
    throw new Error('ルームの取得または作成に失敗しました');
  }
}

// ルームが満員かチェック
export function isRoomFull(room: GameRoom): boolean {
  return !!(room.players.left && room.players.right);
}

// ルーム状態の統計情報取得（デバッグ用）
export function getRoomStats(gameRooms: GameRoomsMap): { 
  totalRooms: number; 
  emptyRooms: number; 
  fullRooms: number; 
  playingRooms: number; 
} {
  try {
    let emptyRooms = 0;
    let fullRooms = 0;
    let playingRooms = 0;

    for (const room of gameRooms.values()) {
      const playerCount = (room.players.left ? 1 : 0) + (room.players.right ? 1 : 0);
      
      if (playerCount === 0) {
        emptyRooms++;
      } else if (playerCount === 2) {
        fullRooms++;
        if (room.state.status === 'playing') {
          playingRooms++;
        }
      }
    }

    return {
      totalRooms: gameRooms.size,
      emptyRooms,
      fullRooms,
      playingRooms,
    };
  } catch (error) {
    handleError(error, 'Room stats');
    return { totalRooms: 0, emptyRooms: 0, fullRooms: 0, playingRooms: 0 };
  }
}
