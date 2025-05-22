// ===========================================
// ゲーム状態管理のみを担当
// ===========================================

import { CANVAS, GAME } from '../../../../shared/types/constants';
import type { GameStatus } from '../../../../shared/types/game';
import type { GameRoom } from '../../types/server';
import { resetBallPosition } from './GameConfig';

// エラーハンドリング
function handleError(error: unknown, context: string): void {
  console.error(`[GameStateManager] ${context}:`, error);
}

// カウントダウン開始
export function startCountdown(room: GameRoom): void {
  try {
    let countdown = GAME.COUNTDOWN_SECONDS;
    room.state.status = 'countdown';

    const countdownInterval = setInterval(() => {
      // プレイヤーが両方いるかチェック
      if (!room.players.left || !room.players.right) {
        clearInterval(countdownInterval);
        return;
      }

      // カウントダウンメッセージを送信
      const countdownMessage = JSON.stringify({
        type: 'countdown',
        count: countdown,
      });

      room.players.left.send(countdownMessage);
      room.players.right.send(countdownMessage);

      countdown--;

      // カウントダウン終了でゲーム開始
      if (countdown < 0) {
        clearInterval(countdownInterval);
        startGame(room);
      }
    }, 1000);

    // タイマーを保存
    room.timers.countdown = countdownInterval;
  } catch (error) {
    handleError(error, 'Countdown start');
  }
}

// ゲーム開始
export function startGame(room: GameRoom): void {
  try {
    room.state.status = 'playing';
    
    // カスタム設定でボール速度を設定
    resetBallPosition(room.state, room.settings.ballSpeed);

    // ゲーム開始メッセージを送信
    const gameStartMessage = JSON.stringify({
      type: 'gameStart',
      state: room.state,
    });

    if (room.players.left) {
      room.players.left.send(gameStartMessage);
    }
    if (room.players.right) {
      room.players.right.send(gameStartMessage);
    }

    // ゲームループを開始
    startGameLoop(room);
  } catch (error) {
    handleError(error, 'Game start');
  }
}

// ゲームループ開始
function startGameLoop(room: GameRoom): void {
  const gameInterval = setInterval(() => {
    try {
      // プレイヤーが両方いるかチェック
      if (!room.players.left || !room.players.right || room.state.status !== 'playing') {
        clearInterval(gameInterval);
        return;
      }

      // ゲーム物理演算を更新
      updateGamePhysics(room);

      // 両プレイヤーに状態を送信
      const stateMessage = JSON.stringify({
        type: 'gameState',
        state: room.state,
      });

      room.players.left.send(stateMessage);
      room.players.right.send(stateMessage);

      // ゲーム終了チェック
      if (room.state.status as GameStatus === 'finished') {
        handleGameEnd(room);
        clearInterval(gameInterval);
        return;
      }
    } catch (error) {
      handleError(error, 'Game loop');
      clearInterval(gameInterval);
    }
  }, 1000 / GAME.FPS);

  // タイマーを保存
  room.timers.game = gameInterval;
}

// ゲーム物理演算の更新
function updateGamePhysics(room: GameRoom): void {
  const { ball, paddleLeft, paddleRight, score } = room.state;

  // ボール移動
  ball.x += ball.dx;
  ball.y += ball.dy;

  // 上下の壁との衝突
  if (ball.y <= 0 || ball.y >= CANVAS.HEIGHT) {
    ball.dy *= -1;
  }

  // パドルとの衝突判定
  // 左パドル
  if (
    ball.dx < 0 &&
    ball.x <= paddleLeft.x + paddleLeft.width &&
    ball.x >= paddleLeft.x &&
    ball.y >= paddleLeft.y &&
    ball.y <= paddleLeft.y + paddleLeft.height
  ) {
    ball.dx *= -1;
  }

  // 右パドル
  if (
    ball.dx > 0 &&
    ball.x >= paddleRight.x &&
    ball.x <= paddleRight.x + paddleRight.width &&
    ball.y >= paddleRight.y &&
    ball.y <= paddleRight.y + paddleRight.height
  ) {
    ball.dx *= -1;
  }

  // 得点判定
  if (ball.x <= 0) {
    // 右プレイヤーの得点
    score.right++;
    resetBallPosition(room.state, room.settings.ballSpeed);
  } else if (ball.x >= CANVAS.WIDTH) {
    // 左プレイヤーの得点
    score.left++;
    resetBallPosition(room.state, room.settings.ballSpeed);
  }

  // 勝利判定
  if (score.left >= room.state.winningScore) {
    room.state.status = 'finished';
    room.state.winner = 'left';
  } else if (score.right >= room.state.winningScore) {
    room.state.status = 'finished';
    room.state.winner = 'right';
  }
}

// ゲーム終了処理
function handleGameEnd(room: GameRoom): void {
  try {
    const gameOverMessage = JSON.stringify({
      type: 'gameOver',
      result: {
        winner: room.state.winner,
        finalScore: room.state.score,
        reason: 'completed',
        message: 'ゲーム終了',
      },
    });

    if (room.players.left) {
      room.players.left.send(gameOverMessage);
    }
    if (room.players.right) {
      room.players.right.send(gameOverMessage);
    }

    // タイマー停止
    if (room.timers.game) {
      clearInterval(room.timers.game);
      room.timers.game = undefined;
    }
  } catch (error) {
    handleError(error, 'Game end');
  }
}
