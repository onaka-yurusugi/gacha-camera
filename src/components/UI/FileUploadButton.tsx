'use client';

import { useRef } from 'react';
import { Upload } from 'lucide-react';

interface FileUploadButtonProps {
  onFileSelected: (file: File) => void;
  isVisible: boolean;
}

export const FileUploadButton = ({ onFileSelected, isVisible }: FileUploadButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  if (!isVisible) return null;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={handleClick}
        className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg transition-all hover:bg-white/30 active:scale-95"
        aria-label="画像・動画をアップロード"
      >
        <Upload className="h-6 w-6 text-white" />
      </button>
    </>
  );
};
