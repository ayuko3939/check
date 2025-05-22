// ===========================================
// ゲーム設定モーダルコンポーネント
// ===========================================

import { useState } from 'react';
import type { GameSettingsProps } from '../../../../types/ui';
import type { GameSettings } from '../../../../../shared/types/game';
import { BALL, GAME } from '../../../../../shared/types/constants';
import styles from '../game.module.css';

interface Props {
  isOpen: boolean;
  onConfirm: (settings: GameSettings) => void;
  onCancel: () => void;
}

export default function GameSettingsModal({ isOpen, onConfirm, onCancel }: Props) {
  const [ballSpeed, setBallSpeed] = useState(BALL.DEFAULT_SPEED);
  const [winningScore, setWinningScore] = useState(GAME.DEFAULT_WINNING_SCORE);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm({
      ballSpeed,
      winningScore,
    });
  };

  const handleCancel = () => {
    // 設定をリセット
    setBallSpeed(BALL.DEFAULT_SPEED);
    setWinningScore(GAME.DEFAULT_WINNING_SCORE);
    onCancel();
  };

  return (
    <div className={styles.settingsOverlay}>
      <div className={styles.settingsModal}>
        <h2 className={styles.settingsTitle}>
          ゲーム設定
        </h2>
        
        <div className={styles.settingItem}>
          <label htmlFor="ballSpeed" className={styles.settingLabel}>
            ボール速度:
          </label>
          <select
            id="ballSpeed"
            value={ballSpeed}
            onChange={(e) => setBallSpeed(parseInt(e.target.value))}
            className={styles.settingSelect}
          >
            {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
              <option key={value} value={value}>
                {value} {value === BALL.DEFAULT_SPEED && '(標準)'}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.settingItem}>
          <label htmlFor="winningScore" className={styles.settingLabel}>
            勝利点数:
          </label>
          <select
            id="winningScore"
            value={winningScore}
            onChange={(e) => setWinningScore(parseInt(e.target.value))}
            className={styles.settingSelect}
          >
            {GAME.WINNING_SCORE_OPTIONS.map((value) => (
              <option key={value} value={value}>
                {value}点 {value === GAME.DEFAULT_WINNING_SCORE && '(標準)'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleConfirm}
            className={styles.settingsButton}
          >
            OK
          </button>
          <button
            onClick={handleCancel}
            className={`${styles.settingsButton} opacity-60 hover:opacity-80`}
          >
            キャンセル
          </button>
        </div>
      </div>
    </div>
  );
}
