// ===========================================
// Canvas描画管理フック
// ===========================================

import { useRef, useCallback } from 'react';
import type { GameState } from '../../../../../../shared/types/game';
import { CANVAS } from '../../../../../../shared/types/constants';

interface UseCanvasReturn {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  startRendering: (gameState: GameState) => void;
  stopRendering: () => void;
}

export function useCanvas(): UseCanvasReturn {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const gameStateRef = useRef<GameState | null>(null);

  // Canvas描画処理
  const renderFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const gameState = gameStateRef.current;
    
    if (!canvas || !gameState) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // キャンバスクリア
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);

    // パドル描画
    ctx.fillStyle = 'white';
    ctx.fillRect(
      gameState.paddleLeft.x,
      gameState.paddleLeft.y,
      gameState.paddleLeft.width,
      gameState.paddleLeft.height
    );
    ctx.fillRect(
      gameState.paddleRight.x,
      gameState.paddleRight.y,
      gameState.paddleRight.width,
      gameState.paddleRight.height
    );

    // ボール描画
    ctx.beginPath();
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // スコア描画
    ctx.font = '48px Arial';
    ctx.fillText(gameState.score.left.toString(), CANVAS.WIDTH / 4, 50);
    ctx.fillText(gameState.score.right.toString(), (3 * CANVAS.WIDTH) / 4, 50);

    // 中央線描画
    ctx.setLineDash([5, 15]);
    ctx.beginPath();
    ctx.moveTo(CANVAS.WIDTH / 2, 0);
    ctx.lineTo(CANVAS.WIDTH / 2, CANVAS.HEIGHT);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.setLineDash([]); // リセット

    // 次のフレームをスケジュール
    animationRef.current = requestAnimationFrame(renderFrame);
  }, []);

  // 描画開始
  const startRendering = useCallback((gameState: GameState) => {
    gameStateRef.current = gameState;
    
    // 既存のアニメーションがあれば停止
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    // 描画開始
    renderFrame();
  }, [renderFrame]);

  // 描画停止
  const stopRendering = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    gameStateRef.current = null;
  }, []);

  return {
    canvasRef,
    startRendering,
    stopRendering,
  };
}
