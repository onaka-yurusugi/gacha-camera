'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CameraView } from '@/components/Camera/CameraView';
import { GachaOverlay } from '@/components/Gacha/GachaOverlay';
import { SummonGate } from '@/components/Gacha/SummonGate';
import { Header } from '@/components/UI/Header';
import { SettingsModal } from '@/components/UI/SettingsModal';
import { WelcomeModal } from '@/components/UI/WelcomeModal';
import { CoachMark } from '@/components/UI/CoachMark';
import { SourceModeTab } from '@/components/UI/SourceModeTab';
import { AIAnalyzing } from '@/components/UI/AIAnalyzing';
import { useCamera } from '@/hooks/useCamera';
import { useGacha } from '@/hooks/useGacha';
import { useGachaSettings } from '@/hooks/useGachaSettings';
import { soundManager } from '@/lib/sounds';

export default function Home() {
  const { videoRef, isReady, error, switchCamera, sourceMode, loadFile, switchToCamera } = useCamera();
  const { result, isPlaying, isAnalyzing, pull, reset, error: gachaError } = useGacha();
  const {
    settings,
    setMode,
    setRarity,
    setName,
    setSerifs,
    isCustomMode,
    isValidCustomSettings,
    showWelcome,
    showCoachMark,
    completeWelcome,
    completeCoachMark,
  } = useGachaSettings();
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      soundManager.init();
      setIsInitialized(true);
    }
  }, [isInitialized]);


  const handleTap = useCallback(async () => {
    if (!isPlaying && isReady) {
      // タップした瞬間に音を鳴らす（Reactのレンダリング待ちを回避）
      soundManager.play('gachaRoll');

      const isAIMode = settings.mode === 'ai';

      // AIモード: videoRefを渡してAI判定
      if (isAIMode) {
        await pull({
          useAI: true,
          videoElement: videoRef.current,
        });
      }
      // カスタムモードかつ有効な設定がある場合
      else if (isCustomMode && isValidCustomSettings) {
        await pull({
          useCustom: true,
          customSettings: settings.customSettings,
        });
      }
      // ランダムモード
      else {
        await pull();
      }
    }
  }, [isPlaying, isReady, pull, isCustomMode, isValidCustomSettings, settings.customSettings, settings.mode, videoRef]);

  const handleComplete = useCallback(() => {
    reset();
  }, [reset]);

  const handleRetry = useCallback(async () => {
    reset();
    // 少し待ってから再召喚
    setTimeout(async () => {
      const isAIMode = settings.mode === 'ai';

      if (isAIMode) {
        await pull({
          useAI: true,
          videoElement: videoRef.current,
        });
      } else if (isCustomMode && isValidCustomSettings) {
        await pull({
          useCustom: true,
          customSettings: settings.customSettings,
        });
      } else {
        await pull();
      }
    }, 100);
  }, [reset, pull, isCustomMode, isValidCustomSettings, settings.customSettings, settings.mode, videoRef]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
  }, []);

  const handleSettingsOpen = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleSettingsClose = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleFileSelected = useCallback((file: File) => {
    loadFile(file);
  }, [loadFile]);

  const handleSourceModeChange = useCallback((mode: 'camera' | 'file') => {
    if (mode === 'camera') {
      switchToCamera();
    }
  }, [switchToCamera]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-black">
      {/* Camera background */}
      <CameraView videoRef={videoRef} isReady={isReady} error={error} />

      {/* Header with controls */}
      <AnimatePresence>
        <Header
          onCameraSwitch={switchCamera}
          onMuteToggle={handleMuteToggle}
          onSettingsOpen={handleSettingsOpen}
          isMuted={isMuted}
          isVisible={!isPlaying}
        />
      </AnimatePresence>

      {/* Source mode tab (Camera / File) */}
      <AnimatePresence>
        <SourceModeTab
          currentMode={sourceMode}
          onModeChange={handleSourceModeChange}
          onFileSelected={handleFileSelected}
          isVisible={!isPlaying}
        />
      </AnimatePresence>

      {/* Summon Gate with door and crystal */}
      <AnimatePresence>
        <SummonGate
          isVisible={isReady && !isPlaying}
          onTap={handleTap}
        />
      </AnimatePresence>

      {/* Gacha animation overlay */}
      <AnimatePresence>
        <GachaOverlay
          isActive={isPlaying}
          result={result}
          onComplete={handleComplete}
          onRetry={handleRetry}
        />
      </AnimatePresence>

      {/* AI Analyzing Overlay */}
      <AnimatePresence>
        <AIAnalyzing isVisible={isAnalyzing} />
      </AnimatePresence>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleSettingsClose}
        settings={settings}
        onModeChange={setMode}
        onRarityChange={setRarity}
        onNameChange={setName}
        onSerifsChange={setSerifs}
      />

      {/* Tutorial: Welcome Modal */}
      <WelcomeModal isOpen={showWelcome} onComplete={completeWelcome} />

      {/* Tutorial: Coach Mark for Settings Button */}
      <CoachMark isVisible={showCoachMark} onDismiss={completeCoachMark} />

      {/* Error Toast */}
      <AnimatePresence>
        {gachaError && (
          <motion.div
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[110] max-w-sm mx-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="bg-red-500/90 backdrop-blur-sm text-white px-6 py-4 rounded-xl shadow-lg border border-red-400/50">
              <p className="text-sm font-medium">⚠️ エラー</p>
              <p className="text-xs mt-1 opacity-90">{gachaError}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
