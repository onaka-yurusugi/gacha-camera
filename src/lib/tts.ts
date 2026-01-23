/**
 * TTS Manager using Web Speech API
 * Provides text-to-speech functionality for character dialogue
 */

interface TTSManager {
  isAvailable: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  speak: (text: string) => void;
  stop: () => void;
  setMute: (muted: boolean) => void;
  toggleMute: () => boolean;
}

class TTSManagerImpl implements TTSManager {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  public isAvailable = false;
  public isSpeaking = false;
  public isMuted = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isAvailable = true;
    }
  }

  /**
   * 男性的な声を優先的に選択
   */
  private selectVoice(): SpeechSynthesisVoice | null {
    if (!this.synth) return null;

    const voices = this.synth.getVoices();

    // 優先順位：
    // 1. 日本語の男性音声（Google、Microsoft等）
    // 2. 日本語の音声（性別不問）
    // 3. その他の音声

    // 日本語男性音声を探す
    const japaneseMaleVoice = voices.find(voice =>
      voice.lang.startsWith('ja') &&
      (voice.name.includes('Male') ||
       voice.name.includes('男') ||
       voice.name.includes('Otoya') || // Google男性音声の一つ
       voice.name.includes('Ichiro') ||
       voice.name.includes('Keita'))
    );
    if (japaneseMaleVoice) return japaneseMaleVoice;

    // 日本語音声を探す（性別不問）
    const japaneseVoice = voices.find(voice => voice.lang.startsWith('ja'));
    if (japaneseVoice) return japaneseVoice;

    // どの音声でも良いので返す
    return voices[0] || null;
  }

  speak(text: string): void {
    if (!this.isAvailable || !this.synth || this.isMuted) return;

    // 現在読み上げ中の場合は停止
    this.stop();

    // 「」を削除（引用符は読み上げない）
    const cleanText = text.replace(/「|」/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // 声を設定
    const voice = this.selectVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // 読み上げ設定
    utterance.lang = 'ja-JP';
    utterance.rate = 1.0;  // 読み上げ速度（0.1-10、1が標準）
    utterance.pitch = 0.8; // ピッチ（0-2、1が標準、低めにしてイケボ風に）
    utterance.volume = 0.8; // ボリューム（0-1）

    utterance.onstart = () => {
      this.isSpeaking = true;
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
    };

    utterance.onerror = () => {
      this.isSpeaking = false;
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop(): void {
    if (!this.synth) return;

    this.synth.cancel();
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  setMute(muted: boolean): void {
    this.isMuted = muted;
    if (muted && this.isSpeaking) {
      this.stop();
    }
  }

  toggleMute(): boolean {
    this.setMute(!this.isMuted);
    return this.isMuted;
  }
}

// シングルトンインスタンスをエクスポート
export const ttsManager: TTSManager = new TTSManagerImpl();
