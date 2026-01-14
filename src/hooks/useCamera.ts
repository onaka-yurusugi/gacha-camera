'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type FacingMode = 'user' | 'environment';
type SourceMode = 'camera' | 'file';

interface UseCameraReturn {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  stream: MediaStream | null;
  isReady: boolean;
  error: string | null;
  facingMode: FacingMode;
  sourceMode: SourceMode;
  switchCamera: () => void;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  loadFile: (file: File) => Promise<void>;
  switchToCamera: () => void;
}

export const useCamera = (): UseCameraReturn => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<FacingMode>('environment');
  const [sourceMode, setSourceMode] = useState<SourceMode>('camera');

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsReady(false);
    }
  }, [stream]);

  const startCamera = useCallback(async () => {
    try {
      setError(null);

      if (stream) {
        stopCamera();
      }

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
        setIsReady(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'カメラの起動に失敗しました';
      setError(errorMessage);
      setIsReady(false);
    }
  }, [facingMode, stream, stopCamera]);

  const switchCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'));
  }, []);

  const loadFile = useCallback(async (file: File) => {
    try {
      setError(null);

      // カメラが動いていたら停止
      if (stream) {
        stopCamera();
      }

      // 既存のObject URLを解放
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      // ファイルからURLを作成
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;

      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.src = url;
        videoRef.current.loop = true;

        // 画像の場合は静止画として表示
        if (file.type.startsWith('image/')) {
          videoRef.current.poster = url;
          await videoRef.current.play().catch(() => {
            // 画像の場合は再生エラーを無視
          });
        } else {
          // 動画の場合は再生
          await videoRef.current.play();
        }

        setSourceMode('file');
        setIsReady(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'ファイルの読み込みに失敗しました';
      setError(errorMessage);
      setIsReady(false);
    }
  }, [stream, stopCamera]);

  const switchToCamera = useCallback(() => {
    if (sourceMode === 'file') {
      // Object URLを解放
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      // ファイルモードからカメラに戻る
      if (videoRef.current) {
        videoRef.current.src = '';
        videoRef.current.poster = '';
      }
      setSourceMode('camera');
      startCamera();
    }
  }, [sourceMode, startCamera]);

  useEffect(() => {
    startCamera();

    return () => {
      // Object URLを解放
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  return {
    videoRef,
    stream,
    isReady,
    error,
    facingMode,
    sourceMode,
    switchCamera,
    startCamera,
    stopCamera,
    loadFile,
    switchToCamera,
  };
};
