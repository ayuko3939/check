// ===========================================
// メッセージ処理のみを担当
// ===========================================

import type { 
  ClientMessage, 
  PlayerSide 
} from '../../../../shared/types/game';
import type { 
  GameRoom, 
  MessageContext 
} from '../../types/server';

// メッセージ処理の統一エラーハンドリング
function handleError(error: unknown, context: string): void {
  console.error(`[MessageHandler] ${context}:`, error);
}

// チャットメッセージの処理
export function handleChatMessage(
  message: Extract<ClientMessage, { type: 'chat' }>,
  context: MessageContext
): void {
  try {
    const { room, playerSide } = context;
    
    // チャットメッセージを履歴に追加
    room.chats.push({
      name: message.name,
      message: message.message,
    });

    // 両プレイヤーにチャット更新を送信
    const chatUpdate = JSON.stringify({
      type: 'chatUpdate',
      messages: room.chats,
    });

    if (room.players.left) {
      room.players.left.send(chatUpdate);
    }
    if (room.players.right) {
      room.players.right.send(chatUpdate);
    }
  } catch (error) {
    handleError(error, 'Chat message processing');
  }
}

// パドル移動の処理
export function handlePaddleMove(
  message: Extract<ClientMessage, { type: 'paddleMove' }>,
  context: MessageContext
): void {
  try {
    const { room, playerSide } = context;
    
    // パドル位置を更新
    if (playerSide === 'left') {
      room.state.paddleLeft.y = message.y;
    } else if (playerSide === 'right') {
      room.state.paddleRight.y = message.y;
    }

    // 相手プレイヤーに状態更新を送信
    const opponent = playerSide === 'left' ? room.players.right : room.players.left;
    if (opponent) {
      const stateUpdate = JSON.stringify({
        type: 'gameState',
        state: room.state,
      });
      opponent.send(stateUpdate);
    }
  } catch (error) {
    handleError(error, 'Paddle move processing');
  }
}

// ゲーム設定の処理
export function handleGameSettings(
  message: Extract<ClientMessage, { type: 'gameSettings' }>,
  context: MessageContext
): void {
  try {
    const { room, playerSide } = context;
    
    // 左プレイヤーのみ設定変更可能
    if (playerSide !== 'left') {
      console.warn('[MessageHandler] Only left player can change settings');
      return;
    }

    // 設定を更新
    room.settings = {
      ballSpeed: message.ballSpeed,
      winningScore: message.winningScore,
    };
    
    // ゲーム状態にも反映
    room.state.winningScore = message.winningScore;
    
    // 左プレイヤーの準備完了
    room.leftPlayerReady = true;
    
    console.log(`[MessageHandler] Game settings updated: speed=${message.ballSpeed}, score=${message.winningScore}`);
  } catch (error) {
    handleError(error, 'Game settings processing');
  }
}

// 中断処理
export function handleSurrender(
  message: Extract<ClientMessage, { type: 'surrender' }>,
  context: MessageContext
): void {
  try {
    const { room, playerSide } = context;
    
    // ゲームが開始されていない場合は何もしない
    if (room.state.status !== 'playing') {
      return;
    }

    console.log(`[MessageHandler] Player ${playerSide} surrendered`);

    // 相手を勝者にする
    const winner = playerSide === 'left' ? 'right' : 'left';
    
    // ゲーム状態を更新
    room.state.status = 'finished';
    room.state.winner = winner;
    
    // 勝者のスコアを勝利点数に設定
    if (winner === 'left') {
      room.state.score.left = room.state.winningScore;
    } else {
      room.state.score.right = room.state.winningScore;
    }

    // 両プレイヤーにゲーム終了を通知
    const gameOverMessage = JSON.stringify({
      type: 'gameOver',
      result: {
        winner,
        finalScore: room.state.score,
        reason: 'surrendered',
        message: playerSide === winner ? 
          '相手プレイヤーが中断しました。あなたの勝利です！' :
          'あなたは中断して敗北しました。',
      },
    });

    if (room.players.left) {
      room.players.left.send(gameOverMessage);
    }
    if (room.players.right) {
      room.players.right.send(gameOverMessage);
    }

    // ゲームタイマーを停止
    if (room.timers.game) {
      clearInterval(room.timers.game);
      room.timers.game = undefined;
    }
  } catch (error) {
    handleError(error, 'Surrender processing');
  }
}
