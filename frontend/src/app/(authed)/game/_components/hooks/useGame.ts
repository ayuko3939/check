// ===========================================
// ゲーム状態管理フック（簡素化版）
// ===========================================

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { 
  GameState, 
  PlayerSide, 
  ChatMessage, 
  GameResult,
  GameSettings,
  ServerMessage
} from '../../../../../../shared/types/game';
import { CANVAS, BALL, PADDLE, GAME } from '../../../../../../shared/types/constants';
import type { UseGameHook } from '../../../../../types/ui';
import { useWebSocket } from './useWebSocket';
import { useCanvas } from './useCanvas';

// 初期ゲーム状態
const createInitialGameState = (): GameState => ({
  ball: {
    x: CANVAS.WIDTH / 2,
    y: CANVAS.HEIGHT / 2,
    dx: BALL.DEFAULT_SPEED,
    dy: BALL.DEFAULT_SPEED,
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
});

export function useGame(): UseGameHook {
  const router = useRouter();
  
  // ゲーム状態
  const [gameState, setGameState] = useState<GameState>(createInitialGameState);
  const [playerSide, setPlayerSide] = useState<PlayerSide>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  // 制御状態
  const [isWaitingForPlayer, setIsWaitingForPlayer] = useState(false);
  const [isCountdown, setIsCountdown] = useState(false);
  const [countdownValue, setCountdownValue] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  // UI状態
  const [showSettings, setShowSettings] = useState(false);
  const [showSurrenderDialog, setShowSurrenderDialog] = useState(false);
  const [settingsConfirmed, setSettingsConfirmed] = useState(false);
  const [chatInput, setChatInput] = useState('');

  // WebSocketメッセージ処理
  const handleWebSocketMessage = useCallback((data: ServerMessage) => {
    switch (data.type) {
      case 'init':
        setPlayerSide(data.side);
        setGameState(data.state);
        // 左プレイヤーは設定画面を表示
        if (data.side === 'left') {
          setShowSettings(true);
        }
        break;

      case 'waitingForPlayer':
        setIsWaitingForPlayer(true);
        break;

      case 'gameState':
        setGameState(data.state);
        break;

      case 'countdown':
        setIsCountdown(true);
        setCountdownValue(data.count);
        setIsWaitingForPlayer(false);
        break;

      case 'gameStart':
        setIsCountdown(false);
        setGameState(data.state);
        break;

      case 'gameOver':
        setIsGameOver(true);
        setGameResult(data.result);
        canvas.stopRendering();
        break;

      case 'chatUpdate':
        setChatMessages(data.messages);
        break;

      default:
        console.warn('不明なメッセージタイプ:', (data as any).type);
    }
  }, []);

  // WebSocketとCanvas管理
  const webSocket = useWebSocket(handleWebSocketMessage);
  const canvas = useCanvas();

  // ゲーム状態の変化を監視して描画を更新
  useEffect(() => {
    if (gameState.status === 'playing') {
      canvas.startRendering(gameState);
    } else {
      canvas.stopRendering();
    }
  }, [gameState.status, canvas]);

  // ゲーム状態更新時にCanvas描画を更新
  useEffect(() => {
    if (gameState.status === 'playing') {
      canvas.startRendering(gameState);
    }
  }, [gameState, canvas]);

  // アクション関数
  const sendPaddleMove = useCallback((y: number) => {
    webSocket.sendMessage({ type: 'paddleMove', y });
  }, [webSocket]);

  const sendChatMessage = useCallback((name: string, message: string) => {
    webSocket.sendMessage({ type: 'chat', name, message });
  }, [webSocket]);

  const sendGameSettings = useCallback((settings: GameSettings) => {
    webSocket.sendMessage({ 
      type: 'gameSettings', 
      ballSpeed: settings.ballSpeed,
      winningScore: settings.winningScore
    });
    setSettingsConfirmed(true);
    setShowSettings(false);
  }, [webSocket]);

  const sendSurrender = useCallback(() => {
    webSocket.sendMessage({ type: 'surrender' });
    setShowSurrenderDialog(false);
  }, [webSocket]);

  const handleBackToHome = useCallback(() => {
    webSocket.disconnect();
    canvas.stopRendering();
    router.push('/');
  }, [webSocket, canvas, router]);

  const clearError = useCallback(() => {
    // WebSocketのエラーは自動的にクリアされる
  }, []);

  // コンポーネントアンマウント時のクリーンアップ
  useEffect(() => {
    return () => {
      webSocket.disconnect();
      canvas.stopRendering();
    };
  }, [webSocket, canvas]);

  return {
    // 状態
    gameState,
    playerSide,
    controlState: {
      isConnected: webSocket.isConnected,
      isWaitingForPlayer,
      isCountdown,
      countdownValue,
      isPlaying: gameState.status === 'playing',
      isGameOver,
    },
    uiState: {
      showSettings,
      showSurrenderDialog,
      settingsConfirmed,
      chatInput,
    },
    errorState: {
      hasError: !!webSocket.error,
      errorMessage: webSocket.error || '',
    },
    chatMessages,
    gameResult,
    
    // アクション
    sendPaddleMove,
    sendChatMessage,
    sendGameSettings,
    sendSurrender,
    
    // UI操作
    setShowSettings,
    setShowSurrenderDialog,
    setChatInput,
    clearError,
    
    // WebSocket操作
    connect: webSocket.connect,
    disconnect: webSocket.disconnect,
    isConnected: webSocket.isConnected,
    
    // Canvas操作
    canvasRef: canvas.canvasRef,
    isRendering: gameState.status === 'playing',
    startRendering: canvas.startRendering,
    stopRendering: canvas.stopRendering,
  };
}
