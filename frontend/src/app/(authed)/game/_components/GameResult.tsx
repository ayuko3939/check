// ===========================================
// ゲーム結果画面コンポーネント
// ===========================================

import type { GameResultProps } from '../../../../types/ui';
import type { GameResult, PlayerSide } from '../../../../../shared/types/game';
import styles from '../game.module.css';

interface Props {
  result: GameResult;
  playerSide: PlayerSide;
  onBackToHome: () => void;
}

export default function GameResultScreen({ result, playerSide, onBackToHome }: Props) {
  const isWinner = playerSide === result.winner;
  
  return (
    <div className={styles.gameOverOverlay}>
      <div className={styles.gameOverContent}>
        <h1 className={styles.resultTitle}>
          {isWinner ? 'WIN!' : 'LOSE'}
        </h1>
        
        <div className={styles.finalScore}>
          <span className={isWinner && result.winner === 'left' ? 'text-cyan-400' : ''}>
            {result.finalScore.left}
          </span>
          <span className={styles.scoreSeparator}>-</span>
          <span className={isWinner && result.winner === 'right' ? 'text-cyan-400' : ''}>
            {result.finalScore.right}
          </span>
        </div>
        
        {result.message && (
          <p className={styles.resultMessage}>
            {result.message}
          </p>
        )}
        
        {result.reason && (
          <div className="text-sm text-gray-400 mb-4">
            終了理由: {getReasonText(result.reason)}
          </div>
        )}
        
        <button 
          onClick={onBackToHome}
          className={styles.backButton}
        >
          ホームに戻る
        </button>
      </div>
    </div>
  );
}

// 終了理由を分かりやすいテキストに変換
function getReasonText(reason: string): string {
  switch (reason) {
    case 'completed':
      return 'ゲーム完了';
    case 'surrendered':
      return '中断';
    case 'disconnected':
      return '接続切断';
    default:
      return reason;
  }
}
