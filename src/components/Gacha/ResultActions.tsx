'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { GachaResult } from '@/types/gacha';

interface ResultActionsProps {
  result: GachaResult;
  onRetry: () => void;
  isVisible: boolean;
}

export const ResultActions = ({ result, onRetry, isVisible }: ResultActionsProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const character = result.character;

  // シェア用テキスト
  const shareText = `【ガチャカメラ】\n${character.rarity}の「${character.name}」を引きました！\n「${character.serifs[character.serifs.length - 1]}」`;
  const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://gacha-camera.vercel.app';

  // スクリーンショットを撮影
  const captureScreen = useCallback(async (): Promise<Blob | null> => {
    try {
      setIsCapturing(true);

      // ボタンを非表示にしてからキャプチャ
      const actionsElement = document.getElementById('result-actions');
      if (actionsElement) {
        actionsElement.style.visibility = 'hidden';
      }

      // 少し待ってからキャプチャ
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(document.body, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 1,
      });

      // ボタンを再表示
      if (actionsElement) {
        actionsElement.style.visibility = 'visible';
      }

      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/png');
      });
    } catch (error) {
      console.error('Screenshot failed:', error);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  // Web Share API対応チェック
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator;

  // 画像付きシェア（Web Share API）
  const handleShare = useCallback(async () => {
    const blob = await captureScreen();

    if (blob && canShare) {
      const file = new File([blob], 'gacha-result.png', { type: 'image/png' });
      const shareData = {
        title: 'ガチャカメラ',
        text: shareText,
        url: shareUrl,
        files: [file],
      };

      try {
        // ファイル付きシェアが可能かチェック
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          return;
        }
      } catch (error) {
        console.error('Share with image failed:', error);
      }

      // ファイル無しでシェア
      try {
        await navigator.share({
          title: 'ガチャカメラ',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      // Web Share API非対応の場合はX（Twitter）にフォールバック
      handleShareX();
    }
  }, [captureScreen, canShare, shareText, shareUrl]);

  // X（Twitter）共有（フォールバック）
  const handleShareX = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [shareText, shareUrl]);

  // LINE共有
  const handleShareLine = useCallback(() => {
    const url = `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  }, [shareText, shareUrl]);

  if (!isVisible) return null;

  return (
    <motion.div
      id="result-actions"
      className="fixed bottom-8 left-0 right-0 z-50 flex flex-col items-center gap-3 px-4"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
    >
      {/* シェアボタン */}
      <div className="flex gap-3">
        {/* メインシェアボタン（Web Share API / X fallback） */}
        <motion.button
          onClick={handleShare}
          disabled={isCapturing}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg disabled:opacity-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isCapturing ? (
            <motion.div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
          )}
          <span className="text-sm font-bold">
            {isCapturing ? '撮影中...' : 'シェア'}
          </span>
        </motion.button>

        {/* LINE共有 */}
        <motion.button
          onClick={handleShareLine}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#06C755] text-white rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
          </svg>
          <span className="text-sm font-bold">LINE</span>
        </motion.button>
      </div>

      {/* 再召喚ボタン */}
      <motion.button
        onClick={onRetry}
        className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold shadow-lg border border-white/20"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        もう1度召喚する
      </motion.button>
    </motion.div>
  );
};
