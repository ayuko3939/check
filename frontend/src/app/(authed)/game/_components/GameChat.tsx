// ===========================================
// チャットコンポーネント（改修：キー操作競合回避）
// ===========================================

import type { ChatProps } from '../../../../types/ui';
import type { ChatMessage } from '../../../../../shared/types/game';
import styles from '../game.module.css';

interface Props {
  messages: ChatMessage[];
  currentInput: string;
  onInputChange: (input: string) => void;
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

export default function GameChat({ 
  messages, 
  currentInput, 
  onInputChange, 
  onSendMessage, 
  disabled = false 
}: Props) {

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // 改修：チャット入力中のW/Sキーの競合を防ぐ
    if (event.key === 'w' || event.key === 'W' || event.key === 's' || event.key === 'S') {
      event.stopPropagation(); // ゲームのキーハンドラーに伝播させない
    }
    
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = () => {
    if (currentInput.trim() && !disabled) {
      onSendMessage(currentInput.trim());
      onInputChange('');
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatMessages}>
        {messages.length === 0 ? (
          <div className="text-gray-400 text-sm text-center py-4">
            チャットメッセージはここに表示されます
          </div>
        ) : (
          messages.map((chat, index) => (
            <div key={index} className="mb-2">
              <span className="font-bold text-cyan-400">{chat.name}:</span>
              <span className="ml-2 text-white">{chat.message}</span>
            </div>
          ))
        )}
      </div>

      <div className={styles.chatInputContainer}>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          className={styles.chatInput}
          placeholder="メッセージを入力..."
          disabled={disabled}
          maxLength={100} // 長すぎるメッセージを防ぐ
        />
        <button
          onClick={handleSendMessage}
          type="button"
          className={styles.sendButton}
          disabled={disabled || !currentInput.trim()}
        >
          送信
        </button>
      </div>
    </div>
  );
}
