// ===========================================
// メインゲームコンポーネント（統合・分割版）
// ===========================================

"use client";

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PADDLE } from '../../../../../shared/types/constants';
import type { PongGameProps } from '../../../../types/ui';

// 分割されたコンポーネントをインポート
import { useGame } from './hooks/useGame';
import GameCanvas from './GameCanvas';
import GameSettings from './GameSettings';
import GameChat from './GameChat';
import SurrenderDialog from './SurrenderDialog';
import GameResult from './GameResult';
import WaitingScreen from './WaitingScreen';
import styles from '../game.module.css';

interface Props {
  roomId?: string;
}

export default function PongGame({ roomId }: Props) {
  const { data: session } = useSession();
  
  // カスタムフックでゲーム状態を管理
  const game = useGame();

  // WebSocket接続開始
  useEffect(() => {
    const wsUrl = roomId ? `/api/ws-proxy/${roomId}` : '/api/ws-proxy';
    game.connect(wsUrl);
    
    return () => {
      game.disconnect();
    };
  }, [roomId]);

  // キーボード操作（パドル移動）
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!game.playerSide || game.gameState.status !== 'playing') return;

    const paddle = game.playerSide === 'left' 
      ? game.gameState.paddleLeft 
      : game.gameState.paddleRight;

    let newY = paddle.y;
    const moveSpeed = PADDLE.MOVE_SPEED;

    // キー判定
    if ((event.key === 'ArrowUp' || event.key === 'w' || event.key === 'W') && paddle.y > 0) {
      newY = Math.max(0, paddle.y - moveSpeed);
    } else if (
      (event.key === 'ArrowDown' || event.key === 's' || event.key === 'S') && 
      paddle.y < 600 - paddle.height
    ) {
      newY = Math.min(600 - paddle.height, paddle.y + moveSpeed);
    }

    // 位置変更があった場合のみ送信
    if (newY !== paddle.y) {
      game.sendPaddleMove(newY);
    }
  };

  // チャット送信
  const handleChatSend = (message: string) => {
    const playerName = game.playerSide === 'left' ? 'プレイヤー1' : 'プレイヤー2';
    game.sendChatMessage(playerName, message);
  };

  return (
    <div className={styles.container}>
      {/* エラー表示 */}
      {game.errorState.hasError && (
        <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg z-50">
          <p>{game.errorState.errorMessage}</p>
          <button 
            onClick={game.clearError}
            className="mt-2 text-sm underline"
          >
            閉じる
          </button>
        </div>
      )}

      {/* 中断ボタン（ゲーム中のみ表示） */}
      {game.controlState.isPlaying && !game.controlState.isGameOver && (
        <div className={styles.surrenderButtonContainer}>
          <button 
            onClick={() => game.setShowSurrenderDialog(true)}
            className={styles.surrenderButton}
          >
            中断
          </button>
        </div>
      )}

      {/* メインゲーム画面 */}
      <GameCanvas
        canvasRef={game.canvasRef}
        countdownValue={game.controlState.isCountdown ? game.controlState.countdownValue : undefined}
        onKeyDown={handleKeyDown}
      />

      {/* 待機画面 */}
      {game.controlState.isWaitingForPlayer && (
        <WaitingScreen 
          playerSide={game.playerSide}
          roomId={roomId}
        />
      )}

      {/* ゲーム設定モーダル */}
      <GameSettings
        isOpen={game.uiState.showSettings && !game.uiState.settingsConfirmed}
        onConfirm={game.sendGameSettings}
        onCancel={() => game.setShowSettings(false)}
      />

      {/* 中断確認ダイアログ */}
      <SurrenderDialog
        isOpen={game.uiState.showSurrenderDialog}
        onConfirm={game.sendSurrender}
        onCancel={() => game.setShowSurrenderDialog(false)}
      />

      {/* ゲーム結果画面 */}
      {game.controlState.isGameOver && game.gameResult && (
        <GameResult
          result={game.gameResult}
          playerSide={game.playerSide}
          onBackToHome={game.handleBackToHome}
        />
      )}

      {/* チャット（ゲーム終了時は非表示） */}
      {!game.controlState.isGameOver && (
        <GameChat
          messages={game.chatMessages}
          currentInput={game.uiState.chatInput}
          onInputChange={game.setChatInput}
          onSendMessage={handleChatSend}
          disabled={!game.controlState.isConnected}
        />
      )}
    </div>
  );
}
