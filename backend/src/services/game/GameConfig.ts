// ===========================================
// ゲーム設定値（roomUtils.tsから移動）
// ===========================================

import { CANVAS, BALL, PADDLE, GAME } from '../../../../shared/types/constants';
import type { GameState } from '../../../../shared/types/game';

// ゲーム初期状態の作成
export function createInitialGameState(): GameState {
  return {
    ball: {
      x: CANVAS.WIDTH / 2,
      y: CANVAS.HEIGHT / 2,
      dx: BALL.DEFAULT_SPEED * (Math.random() > 0.5 ? 1 : -1),
      dy: BALL.DEFAULT_SPEED * (Math.random() > 0.5 ? 1 : -1),
      radius: BALL.RADIUS,
    },
    paddleLeft: {
      x: PADDLE.LEFT_X,
      y: CANVAS.HEIGHT / 2 - PADDLE.HEIGHT / 2,
      width: PADDLE.WIDTH,
      height: PADDLE.HEIGHT,
    },
    paddleRight: {
      x: PADDLE.RIGHT_X,
      y: CANVAS.HEIGHT / 2 - PADDLE.HEIGHT / 2,
      width: PADDLE.WIDTH,
      height: PADDLE.HEIGHT,
    },
    score: { left: 0, right: 0 },
    status: 'waiting',
    winner: null,
    winningScore: GAME.DEFAULT_WINNING_SCORE,
  };
}

// ボールをリセット（得点後など）
export function resetBallPosition(gameState: GameState, ballSpeed: number): void {
  gameState.ball = {
    x: CANVAS.WIDTH / 2,
    y: CANVAS.HEIGHT / 2,
    dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    dy: ballSpeed * (Math.random() > 0.5 ? 1 : -1),
    radius: BALL.RADIUS,
  };
}
