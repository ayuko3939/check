// ===========================================
// ゲームキャンバスコンポーネント
// ===========================================

import { useEffect } from 'react';
import type { GameCanvasProps } from '../../../../types/ui';
import { CANVAS } from '../../../../../shared/types/constants';
import styles from '../game.module.css';

interface Props {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  countdownValue?: number;
  onKeyDown: (event: KeyboardEvent) => void;
}

export default function GameCanvas({ canvasRef, countdownValue, onKeyDown }: Props) {
  
  // キーボードイベントリスナー設定
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 改修：特定のキーのみ処理（W/S/Arrow Keys）
      if (['ArrowUp', 'ArrowDown', 'w', 's', 'W', 'S'].includes(event.key)) {
        event.preventDefault(); // デフォルト動作を防止
        onKeyDown(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onKeyDown]);

  return (
    <div className={styles.canvasContainer}>
      <canvas
        ref={canvasRef}
        width={CANVAS.WIDTH}
        height={CANVAS.HEIGHT}
        className={styles.canvas}
        tabIndex={0} // フォーカス可能にする
      />
      
      {/* カウントダウンオーバーレイ */}
      {countdownValue !== undefined && countdownValue >= 0 && (
        <div className={styles.countdownOverlay}>
          <div className={styles.countdownText}>
            {countdownValue || 'START!'}
          </div>
        </div>
      )}
    </div>
  );
}
