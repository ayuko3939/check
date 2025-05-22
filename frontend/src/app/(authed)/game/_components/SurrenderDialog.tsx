// ===========================================
// 中断確認ダイアログコンポーネント
// ===========================================

import type { ConfirmDialogProps } from '../../../../types/ui';
import { USER_MESSAGES } from '../../../../../shared/types/messages';

import styles from '../game.module.css';

interface Props {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function SurrenderDialog({ isOpen, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.dialogOverlay}>
      <div className={styles.dialog}>
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          ゲームを中断しますか？
        </h3>
        
        <p className={styles.dialogText}>
          {USER_MESSAGES.SURRENDER_CONFIRM}
        </p>
        
        <div className={styles.dialogButtons}>
          <button
            onClick={onConfirm}
            className={`${styles.dialogButton} ${styles.confirmButton}`}
          >
            はい、中断する
          </button>
          <button
            onClick={onCancel}
            className={`${styles.dialogButton} ${styles.cancelButton}`}
          >
            いいえ、続行する
          </button>
        </div>
      </div>
    </div>
  );
}
