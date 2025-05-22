// ===========================================
// ユーザー向けメッセージ定数
// ===========================================

// エラーメッセージ
export const ERROR_MESSAGES = {
  // 接続関連
  CONNECTION_FAILED: '接続に失敗しました',
  CONNECTION_LOST: '接続が切断されました',
  CONNECTION_INIT_FAILED: '接続の初期化に失敗しました',
  WEBSOCKET_ERROR: 'WebSocketエラーが発生しました',
  
  // ルーム関連
  ROOM_FULL: 'ルームが満員です',
  ROOM_NOT_FOUND: 'ルームが見つかりません',
  INVALID_ROOM_ID: 'ルームIDが無効です',
  ROOM_CREATE_FAILED: 'ルームの作成に失敗しました',
  
  // ゲーム関連
  GAME_NOT_FOUND: 'ゲームが見つかりません',
  INVALID_MOVE: '無効な操作です',
  PLAYER_ASSIGNMENT_FAILED: 'プレイヤーの配置に失敗しました',
  GAME_START_FAILED: 'ゲームの開始に失敗しました',
  
  // メッセージ関連
  MESSAGE_PARSE_FAILED: 'メッセージの解析に失敗しました',
  MESSAGE_SEND_FAILED: 'メッセージの送信に失敗しました',
  INVALID_MESSAGE_TYPE: '不明なメッセージタイプです',
  
  // 一般的なエラー
  NETWORK_ERROR: 'ネットワークエラーが発生しました',
  SERVER_ERROR: 'サーバーエラーが発生しました',
  UNKNOWN_ERROR: '予期しないエラーが発生しました',
} as const;

// 成功メッセージ
export const SUCCESS_MESSAGES = {
  CONNECTED: '接続しました',
  GAME_STARTED: 'ゲームを開始します',
  PLAYER_JOINED: 'プレイヤーが参加しました',
  MESSAGE_SENT: 'メッセージを送信しました',
} as const;

// 情報メッセージ
export const INFO_MESSAGES = {
  WAITING_FOR_PLAYER: '相手プレイヤーを待機中...',
  GAME_OVER: 'ゲーム終了',
  COUNTDOWN_START: 'ゲーム開始まで',
  RECONNECTING: '再接続を試行中...',
} as const;

// ユーザー操作メッセージ
export const USER_MESSAGES = {
  SURRENDER_CONFIRM: '中断するとあなたは敗北となり、対戦記録に反映されます。本当に中断しますか？',
  GAME_WIN: 'あなたの勝利です！',
  GAME_LOSE: '敗北しました',
  OPPONENT_DISCONNECTED: '相手プレイヤーが切断しました。あなたの勝利です！',
  OPPONENT_SURRENDERED: '相手プレイヤーが中断しました。あなたの勝利です！',
  YOU_SURRENDERED: 'あなたは中断して敗北しました。',
} as const;
