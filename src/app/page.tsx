'use client';

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { CameraView } from '@/components/Camera/CameraView';
import { GachaOverlay } from '@/components/Gacha/GachaOverlay';
import { TapToSummon } from '@/components/UI/TapToSummon';
import { Header } from '@/components/UI/Header';
import { useCamera } from '@/hooks/useCamera';
import { useGacha } from '@/hooks/useGacha';
import { soundManager } from '@/lib/sounds';

export default function Home() {
  const { videoRef, isReady, error, switchCamera } = useCamera();
  const { result, isPlaying, pull, reset } = useGacha();
  const [isMuted, setIsMuted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (!isInitialized && typeof window !== 'undefined') {
      soundManager.init();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const handleTap = useCallback(() => {
    if (!isPlaying && isReady) {
      pull();
    }
  }, [isPlaying, isReady, pull]);

  const handleComplete = useCallback(() => {
    reset();
  }, [reset]);

  const handleMuteToggle = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
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
    </main>
  );
}
