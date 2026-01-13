'use client';

import { RefObject } from 'react';

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isReady: boolean;
  error: string | null;
}

export const CameraView = ({ videoRef, isReady, error }: CameraViewProps) => {
  return (
    <div className="fixed inset-0 bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-full w-full object-cover"
      />

      {!isReady && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white">
            <div className="mb-4 h-12 w-12 mx-auto animate-spin rounded-full border-4 border-white border-t-transparent" />
            <p>カメラを起動中...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80">
          <div className="text-center text-white p-4">
            <p className="text-red-400 mb-2">カメラエラー</p>
            <p className="text-sm text-gray-300">{error}</p>
            <p className="text-xs text-gray-500 mt-4">
              カメラへのアクセスを許可してください
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
