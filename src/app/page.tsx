'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CameraView } from '@/components/Camera/CameraView';
import { GachaOverlay } from '@/components/Gacha/GachaOverlay';
import { TapToSummon } from '@/components/UI/TapToSummon';
import { Header } from '@/components/UI/Header';
import { SettingsModal } from '@/components/UI/SettingsModal';
import { useCamera } from '@/hooks/useCamera';
import { useGacha } from '@/hooks/useGacha';
import { useGachaSettings } from '@/hooks/useGachaSettings';
import { soundManager } from '@/lib/sounds';

export default function Home() {
  const { videoRef, isReady, error, switchCamera } = useCamera();
  const { result, isPlaying, pull, reset } = useGacha();
  const {
    settings,
    setMode,
    setRarity,
    setName,
    setSerif,
    isCustomMode,
    isValidCustomSettings,
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

      {/* Tap to summon prompt */}
      <AnimatePresence>
        <TapToSummon isVisible={isReady && !isPlaying} onTap={handleTap} />
      </AnimatePresence>

      {/* Gacha animation overlay */}
      <AnimatePresence>
        <GachaOverlay
          isActive={isPlaying}
          result={result}
          onComplete={handleComplete}
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
        onSerifChange={setSerif}
      />
    </main>
  );
}
