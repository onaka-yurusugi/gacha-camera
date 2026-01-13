'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  GachaSettings,
  GachaMode,
  Rarity,
  RARITY_CONFIG,
} from '@/types/gacha';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GachaSettings;
  onModeChange: (mode: GachaMode) => void;
  onRarityChange: (rarity: Rarity) => void;
  onNameChange: (name: string) => void;
  onSerifsChange: (serifs: string[]) => void;
}

const RARITIES: Rarity[] = ['N', 'R', 'SR', 'SSR'];

const ModeToggle = ({
  mode,
  onChange,
}: {
  mode: GachaMode;
  onChange: (mode: GachaMode) => void;
}) => (
  <div className="flex gap-1 bg-white/10 p-1 rounded-full">
    <button
      type="button"
      className={`flex-1 px-4 py-2 rounded-full transition-all text-sm font-medium ${
        mode === 'random'
          ? 'bg-white text-black'
          : 'text-white/70 hover:text-white'
      }`}
      onClick={() => onChange('random')}
    >
      ランダム
    </button>
    <button
      type="button"
      className={`flex-1 px-4 py-2 rounded-full transition-all text-sm font-medium ${
        mode === 'custom'
          ? 'bg-white text-black'
          : 'text-white/70 hover:text-white'
      }`}
      onClick={() => onChange('custom')}
    >
      カスタム
    </button>
  </div>
);

const RaritySelector = ({
  selected,
  onChange,
}: {
  selected: Rarity;
  onChange: (rarity: Rarity) => void;
}) => (
  <div className="grid grid-cols-4 gap-2">
    {RARITIES.map((rarity) => (
      <motion.button
        key={rarity}
        type="button"
        className={`
          py-3 rounded-lg font-bold text-white text-sm
          bg-gradient-to-r ${RARITY_CONFIG[rarity].color}
          transition-all
          ${selected === rarity ? 'ring-2 ring-white scale-105' : 'opacity-50'}
        `}
        onClick={() => onChange(rarity)}
        whileTap={{ scale: 0.95 }}
      >
        {rarity}
      </motion.button>
    ))}
  </div>
);

export const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  onModeChange,
  onRarityChange,
  onNameChange,
  onSerifsChange,
}: SettingsModalProps) => {
  const isCustomMode = settings.mode === 'custom';
  const { customSettings } = settings;

  // セリフを改行区切りのテキストとして扱う
  const serifsText = customSettings.serifs.join('\n');
  const handleSerifsTextChange = (text: string) => {
    // 改行で分割し、空行を除去しない（入力中に空行があっても許容）
    const lines = text.split('\n');
    onSerifsChange(lines);
  };

  const hasValidSerifs = customSettings.serifs.some((s) => s.trim() !== '');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-sm bg-black/90 backdrop-blur-md border border-white/30 rounded-2xl p-6 shadow-xl"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">設定</h2>
                <motion.button
                  type="button"
                  className="p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                  onClick={onClose}
                  whileTap={{ scale: 0.9 }}
                >
                  ✕
                </motion.button>
              </div>

              {/* Mode Toggle */}
              <div className="mb-6">
                <label className="block text-sm text-white/60 mb-2">モード</label>
                <ModeToggle mode={settings.mode} onChange={onModeChange} />
              </div>

              {/* Custom Settings (only shown in custom mode) */}
              <AnimatePresence>
                {isCustomMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    {/* Rarity Selector */}
                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        レアリティ
                      </label>
                      <RaritySelector
                        selected={customSettings.rarity}
                        onChange={onRarityChange}
                      />
                    </div>

                    {/* Name Input */}
                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        名前
                      </label>
                      <input
                        type="text"
                        value={customSettings.name}
                        onChange={(e) => onNameChange(e.target.value)}
                        placeholder="キャラクター名を入力..."
                        className="
                          w-full px-4 py-3 rounded-lg
                          bg-white/10 border border-white/20
                          text-white placeholder-white/40
                          focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30
                          transition-colors
                        "
                      />
                    </div>

                    {/* Serifs Input */}
                    <div>
                      <label className="block text-sm text-white/60 mb-2">
                        セリフ（複数行で順番に表示）
                      </label>
                      <textarea
                        value={serifsText}
                        onChange={(e) => handleSerifsTextChange(e.target.value)}
                        placeholder="1行目：最初のセリフ&#10;2行目：次のセリフ&#10;3行目：最後のセリフ"
                        rows={4}
                        className="
                          w-full px-4 py-3 rounded-lg
                          bg-white/10 border border-white/20
                          text-white placeholder-white/40
                          focus:border-white/50 focus:outline-none focus:ring-1 focus:ring-white/30
                          transition-colors resize-none
                        "
                      />
                      <p className="text-xs text-white/40 mt-1">
                        改行で区切ると複数のセリフが順番に表示されます
                      </p>
                    </div>

                    {/* Validation hint */}
                    {(!customSettings.name.trim() || !hasValidSerifs) && (
                      <p className="text-xs text-amber-400/80">
                        名前とセリフを入力してね
                      </p>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Current mode indicator */}
              <div className="mt-6 pt-4 border-t border-white/10">
                <p className="text-xs text-white/40 text-center">
                  {isCustomMode
                    ? customSettings.name && hasValidSerifs
                      ? `${RARITY_CONFIG[customSettings.rarity].label} 「${customSettings.name}」が出るよ`
                      : '設定を完了してね'
                    : 'タップでランダム召喚'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
