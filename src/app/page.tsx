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
import { useCamera } from '@/hooks/useCamera';
import { useGacha } from '@/hooks/useGacha';
import { useGachaSettings } from '@/hooks/useGachaSettings';
import { soundManager } from '@/lib/sounds';
import { ttsManager } from '@/lib/tts';

export default function Home() {
  const { videoRef, isReady, error, switchCamera, sourceMode, loadFile, switchToCamera } = useCamera();
  const { result, isPlaying, pull, reset } = useGacha();
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


  const handleTap = useCallback(() => {
    if (!isPlaying && isReady) {
      // タップした瞬間に音を鳴らす（Reactのレンダリング待ちを回避）
      soundManager.play('gachaRoll');

      // カスタムモードかつ有効な設定がある場合
      if (isCustomMode && isValidCustomSettings) {
        pull({
          useCustom: true,
          customSettings: settings.customSettings,
        });
      } else {
        pull();
      }
    }
  }, [isPlaying, isReady, pull, isCustomMode, isValidCustomSettings, settings.customSettings]);

  const handleComplete = useCallback(() => {
    reset();
  }, [reset]);

  const handleRetry = useCallback(() => {
    reset();
    // 少し待ってから再召喚
    setTimeout(() => {
      if (isCustomMode && isValidCustomSettings) {
        pull({
          useCustom: true,
          customSettings: settings.customSettings,
        });
      } else {
        pull();
      }
    }, 100);
  }, [reset, pull, isCustomMode, isValidCustomSettings, settings.customSettings]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
    // TTSもミュート状態を同期
    ttsManager.setMuted(newMuted);
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
    </main>
  );
}
