/**
 * TTS Manager using Web Speech API
 * イケボ（cool male voice）設定で日本語テキストを読み上げます
 */

class TTSManager {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isMuted: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();

      // 音声リストの読み込みが完了したら更新
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  /**
   * イケボ設定で最適な日本語音声を選択
   * 優先順位:
   * 1. 日本語男性音声（ja-JP + male）
   * 2. 日本語音声（ja-JP）
   * 3. デフォルト音声
   */
  private selectVoice(): SpeechSynthesisVoice | null {
    if (this.voices.length === 0) {
      this.loadVoices();
    }

    // 日本語男性音声を優先的に探す
    const maleVoice = this.voices.find(
      (voice) =>
        voice.lang.startsWith('ja') &&
        (voice.name.toLowerCase().includes('male') ||
          voice.name.toLowerCase().includes('man') ||
          voice.name.toLowerCase().includes('masculine') ||
          voice.name.includes('Keita') || // Google日本語男性音声
          voice.name.includes('Otoya')) // Microsoft日本語男性音声
    );

    if (maleVoice) return maleVoice;

    // 日本語音声を探す
    const japaneseVoice = this.voices.find((voice) =>
      voice.lang.startsWith('ja')
    );

    if (japaneseVoice) return japaneseVoice;

    // デフォルト音声
    return this.voices[0] || null;
  }

  /**
   * テキストを読み上げる
   * @param text 読み上げるテキスト
   * @param options オプション設定
   */
  speak(
    text: string,
    options: {
      rate?: number; // 速度 (0.1-10, デフォルト: 1.0)
      pitch?: number; // 音程 (0-2, デフォルト: 0.8 for イケボ)
      volume?: number; // 音量 (0-1, デフォルト: 0.8)
    } = {}
  ): void {
    if (!this.synth || this.isMuted) return;

    // 既存の読み上げを停止
    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const voice = this.selectVoice();

    if (voice) {
      utterance.voice = voice;
    }

    // イケボ設定：低めの音程、適度な速度
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 0.8; // 低めの音程
    utterance.volume = options.volume ?? 0.8;
    utterance.lang = 'ja-JP';

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  /**
   * 読み上げを停止
   */
  stop(): void {
    if (!this.synth) return;

    if (this.synth.speaking) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }

  /**
   * ミュート設定
   * @param muted ミュートするかどうか
   */
  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stop();
    }
  }

  /**
   * Web Speech APIが利用可能かチェック
   */
  isSupported(): boolean {
    return this.synth !== null;
  }

  /**
   * 利用可能な音声リストを取得（デバッグ用）
   */
  getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// シングルトンインスタンス
export const ttsManager = new TTSManager();
