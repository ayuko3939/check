// ===========================================
// プレイヤー管理のみを担当
// ===========================================

import type { 
  GameRoom, 
  GameRoomsMap
} from '../../types/server';
import type { PlayerSide } from '../../../../shared/types/game';

// エラーハンドリング
function handleError(error: unknown, context: string): void {
  console.error(`[PlayerManager] ${context}:`, error);
}

// プレイヤーをルームに配置
export function assignPlayerToRoom(room: GameRoom, socket: WebSocket): PlayerSide {
  try {
    if (!room.players.left) {
      // 左プレイヤーとして配置
      room.players.left = socket;
      console.log(`[PlayerManager] Left player connected to room ${room.id}`);
      return 'left';
    } else if (!room.players.right) {
      // 右プレイヤーとして配置
      room.players.right = socket;
      console.log(`[PlayerManager] Right player connected to room ${room.id}`);
      return 'right';
    }

    // 両方のスロットが埋まっている場合
    return null;
  } catch (error) {
    handleError(error, 'Player assignment');
    return null;
  }
}

// ゲーム開始可能かチェック
export function canStartGame(room: GameRoom): boolean {
  // 両プレイヤーが接続済み かつ 左プレイヤーが設定完了済み
  return !!(room.players.left && room.players.right && room.leftPlayerReady);
}

// プレイヤー切断処理
export function handlePlayerDisconnect(
  playerSide: PlayerSide,
  roomId: string,
  gameRooms: GameRoomsMap
): void {
  try {
    const room = gameRooms.get(roomId);
    if (!room) {
      return;
    }

    console.log(`[PlayerManager] Player ${playerSide} disconnected from room ${roomId}`);

    // プレイヤー接続を削除
    if (playerSide === 'left') {
      room.players.left = undefined;
    } else if (playerSide === 'right') {
      room.players.right = undefined;
    }

    // ゲーム中の切断は相手の勝利
    if (room.state.status === 'playing') {
      const winner = playerSide === 'left' ? 'right' : 'left';
      const remainingPlayer = playerSide === 'left' ? room.players.right : room.players.left;

      if (remainingPlayer) {
        // ゲーム状態を更新
        room.state.status = 'finished';
        room.state.winner = winner;
        
        // 勝者のスコアを勝利点数に
        if (winner === 'left') {
          room.state.score.left = room.state.winningScore;
        } else {
          room.state.score.right = room.state.winningScore;
        }

        // 勝利通知を送信
        const gameOverMessage = JSON.stringify({
          type: 'gameOver',
          result: {
            winner,
            finalScore: room.state.score,
            reason: 'disconnected',
            message: '相手プレイヤーが切断しました。あなたの勝利です！',
          },
        });
        
        remainingPlayer.send(gameOverMessage);
      }

      // ゲームタイマーを停止
      if (room.timers.game) {
        clearInterval(room.timers.game);
        room.timers.game = undefined;
      }
    }

    // カウントダウン中の切断はカウントダウン停止
    if (room.timers.countdown) {
      clearInterval(room.timers.countdown);
      room.timers.countdown = undefined;
    }

    // 両プレイヤーがいなくなった場合はルーム削除
    if (!room.players.left && !room.players.right) {
      cleanupRoom(room);
      gameRooms.delete(roomId);
      console.log(`[PlayerManager] Room ${roomId} deleted (empty)`);
    }
  } catch (error) {
    handleError(error, 'Player disconnect');
  }
}

// ルームのクリーンアップ
function cleanupRoom(room: GameRoom): void {
  try {
    // 全てのタイマーをクリア
    if (room.timers.countdown) {
      clearInterval(room.timers.countdown);
      room.timers.countdown = undefined;
    }
    if (room.timers.game) {
      clearInterval(room.timers.game);
      room.timers.game = undefined;
    }
  } catch (error) {
    handleError(error, 'Room cleanup');
  }
}
