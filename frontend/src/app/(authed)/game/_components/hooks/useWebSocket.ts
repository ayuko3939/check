// ===========================================
// WebSocket接続管理フック
// ===========================================

import { useState, useRef, useCallback } from 'react';

import type { 
  ServerMessage, 
  ClientMessage 
} from '../../../../../../shared/types/game';
import { ERROR_MESSAGES } from '../../../../../../shared/types/messages';

interface UseWebSocketReturn {
  isConnected: boolean;
  error: string | null;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (message: ClientMessage) => void;
}

export function useWebSocket(onMessage: (data: ServerMessage) => void): UseWebSocketReturn {
  const wsRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // WebSocket接続
  const connect = useCallback((url: string) => {
    try {
      // プロトコル調整
      const wsUrl = url.startsWith('/') 
        ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}${url}`
        : url;

      // 既存接続があれば閉じる
      if (wsRef.current) {
        wsRef.current.close();
      }

      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log('WebSocket接続が確立されました');
        setIsConnected(true);
        setError(null);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onMessage(data);
        } catch (parseError) {
          console.error('メッセージ解析エラー:', parseError);
          setError(ERROR_MESSAGES.MESSAGE_PARSE_FAILED);
        }
      };

      wsRef.current.onerror = (event) => {
        console.error('WebSocket接続エラー:', event);
        setError(ERROR_MESSAGES.CONNECTION_FAILED);
        setIsConnected(false);
      };

      wsRef.current.onclose = (event) => {
        console.log(`WebSocket接続が閉じられました: ${event.code} - ${event.reason}`);
        setIsConnected(false);
        
        // 異常終了の場合はエラーを設定
        if (event.code !== 1000) {
          setError(`${ERROR_MESSAGES.CONNECTION_LOST} (${event.code})`);
        }
      };
    } catch (initError) {
      console.error('WebSocket初期化エラー:', initError);
      setError(ERROR_MESSAGES.CONNECTION_INIT_FAILED);
    }
  }, [onMessage]);

  // WebSocket切断
  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close(1000, 'Normal closure');
      wsRef.current = null;
    }
    setIsConnected(false);
    setError(null);
  }, []);

  // メッセージ送信
  const sendMessage = useCallback((message: ClientMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (sendError) {
        console.error('メッセージ送信エラー:', sendError);
        setError(ERROR_MESSAGES.MESSAGE_SEND_FAILED);
      }
    } else {
      console.warn('WebSocket未接続のため送信できません');
      setError(ERROR_MESSAGES.CONNECTION_FAILED);
    }
  }, []);

  return {
    isConnected,
    error,
    connect,
    disconnect,
    sendMessage,
  };
}
