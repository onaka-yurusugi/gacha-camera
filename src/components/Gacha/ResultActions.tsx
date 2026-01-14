'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { domToBlob } from 'modern-screenshot';
import { GachaResult } from '@/types/gacha';

interface ResultActionsProps {
  result: GachaResult;
  onRetry: () => void;
  isVisible: boolean;
}

export const ResultActions = ({ result, onRetry, isVisible }: ResultActionsProps) => {
  const [isCapturing, setIsCapturing] = useState(false);

  const character = result.character;

  // シェア用テキスト（全セリフを改行で連結）
  const serifsText = character.serifs.map(serif => `「${serif}」`).join('\n');
  const shareText = `【虹演出カメラ】\n${character.rarity}の「${character.name}」を引きました！\n${serifsText}`;
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

      // video要素を一時的にcanvasに置き換え（modern-screenshotもvideoを直接キャプチャできない）
      const video = document.querySelector('video');
      let tempCanvas: HTMLCanvasElement | null = null;
      let videoParent: ParentNode | null = null;

      if (video && video.parentNode) {
        videoParent = video.parentNode;

        // videoのフレームをcanvasに描画
        tempCanvas = document.createElement('canvas');

        // 画像がposterとして設定されている場合（アップロードされた画像）
        const posterUrl = video.poster;
        if (posterUrl && posterUrl !== '') {
          // posterから画像を取得してcanvasに描画
          const img = new Image();
          img.crossOrigin = 'anonymous';
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Image load failed'));
            img.src = posterUrl;
          });
          tempCanvas.width = img.naturalWidth || video.clientWidth;
          tempCanvas.height = img.naturalHeight || video.clientHeight;
          const ctx = tempCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
          }
        } else {
          // 動画またはカメラの場合
          const videoWidth = video.videoWidth || video.clientWidth;
          const videoHeight = video.videoHeight || video.clientHeight;
          tempCanvas.width = videoWidth;
          tempCanvas.height = videoHeight;

          const ctx = tempCanvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, videoWidth, videoHeight);
          }
        }

        // videoと同じスタイルを適用
        tempCanvas.className = video.className;
        tempCanvas.style.cssText = window.getComputedStyle(video).cssText;
        tempCanvas.style.width = video.style.width || '100%';
        tempCanvas.style.height = video.style.height || '100%';

        // videoを非表示にしてcanvasを挿入
        video.style.display = 'none';
        videoParent.insertBefore(tempCanvas, video);
      }

      // 少し待ってからキャプチャ（DOM更新を待つ）
      await new Promise(resolve => setTimeout(resolve, 100));

      // modern-screenshotでキャプチャ
      const blob = await domToBlob(document.body, {
        backgroundColor: '#000000',
        scale: 1,
        filter: (node) => {
          // video要素は無視（代わりにcanvasを使う）
          if (node instanceof Element && node.tagName === 'VIDEO') {
            return false;
          }
          return true;
        },
      });

      // video要素を復元
      if (video && tempCanvas && videoParent) {
        video.style.display = '';
        tempCanvas.remove();
      }

      // ボタンを再表示
      if (actionsElement) {
        actionsElement.style.visibility = 'visible';
      }

      return blob;
    } catch (error) {
      console.error('Screenshot failed:', error);
      // エラー時もボタンを再表示
      const actionsElement = document.getElementById('result-actions');
      if (actionsElement) {
        actionsElement.style.visibility = 'visible';
      }
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  // 画像をダウンロード
  const handleDownload = useCallback(async () => {
    const blob = await captureScreen();
    if (!blob) {
      console.error('Failed to capture screen');
      return;
    }

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `gacha-${character.rarity}-${character.name}-${Date.now()}.png`;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, [captureScreen, character.rarity, character.name]);

  // Web Share API対応チェック
  const canShare = typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator;

  // テキスト+URLシェア（Web Share API）
  // 注: filesとtext/urlを同時に渡すとtextが無視されるプラットフォームが多いため、テキストのみシェア
  const handleShare = useCallback(async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: '虹演出カメラ',
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // ユーザーがキャンセルした場合は無視
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Share failed:', error);
          // エラー時はX（Twitter）にフォールバック
          handleShareX();
        }
      }
    } else {
      // Web Share API非対応の場合はX（Twitter）にフォールバック
      handleShareX();
    }
  }, [canShare, shareText, shareUrl]);

  // X（Twitter）共有（フォールバック）
  const handleShareX = useCallback(() => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
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
      {/* シェア・保存ボタン */}
      <div className="flex gap-3">
        {/* ダウンロードボタン */}
        <motion.button
          onClick={handleDownload}
          disabled={isCapturing}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg disabled:opacity-50"
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
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          <span className="text-sm font-bold">保存</span>
        </motion.button>

        {/* メインシェアボタン（Web Share API / X fallback） */}
        <motion.button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          <span className="text-sm font-bold">シェア</span>
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
