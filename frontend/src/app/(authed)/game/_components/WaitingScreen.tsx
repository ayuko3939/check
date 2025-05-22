// ===========================================
// 待機画面コンポーネント（改修：待機表示の改善）
// ===========================================

import type { WaitingScreenProps } from '../../../../types/ui';
import type { PlayerSide } from '../../../../../shared/types/game';
import { INFO_MESSAGES } from '../../../../../shared/types/messages';

interface Props {
  playerSide: PlayerSide;
  roomId?: string;
}

export default function WaitingScreen({ playerSide, roomId }: Props) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80">
      <div className="text-center">
        <div className="mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto"></div>
        </div>
        
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          {INFO_MESSAGES.WAITING_FOR_PLAYER}
        </h2>
        
        <p className="text-white mb-4">
          あなたは{playerSide === 'left' ? '左側' : '右側'}のプレイヤーです
        </p>
        
        {roomId && (
          <div className="bg-gray-800 p-3 rounded-lg border border-cyan-400">
            <p className="text-sm text-gray-300 mb-1">ルームID:</p>
            <p className="text-lg font-mono text-cyan-400">{roomId}</p>
            <p className="text-xs text-gray-400 mt-1">
              このIDを共有して友達を招待できます
            </p>
          </div>
        )}
        
        <div className="mt-6 text-sm text-gray-400">
          <p>• 相手プレイヤーが参加するまでお待ちください</p>
          <p>• ページを閉じると待機が解除されます</p>
        </div>
      </div>
    </div>
  );
}
