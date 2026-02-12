import Anthropic from '@anthropic-ai/sdk';
import { Rarity } from '@/types/gacha';

export interface AIAnalysisResult {
  rarity: Rarity;
  name: string;
  serifs: string[];
}

/**
 * カメラ/画像から人物を分析してガチャキャラクターを生成
 * @param imageDataUrl - base64エンコードされた画像データURL (data:image/...)
 * @returns AI判定結果 (レアリティ、名前、セリフ)
 */
export async function analyzeImageForGacha(
  imageDataUrl: string
): Promise<AIAnalysisResult> {
  const apiKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Anthropic API key not found. Please set NEXT_PUBLIC_ANTHROPIC_API_KEY in .env.local'
    );
  }

  // data:image/jpeg;base64,... から base64部分とメディアタイプを抽出
  const matches = imageDataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error('Invalid image data URL format');
  }

  const mediaType = matches[1] as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp';
  const base64Data = matches[2];

  const client = new Anthropic({
    apiKey,
    dangerouslyAllowBrowser: true, // クライアントサイドでの使用を許可
  });

  const prompt = `あなたはガチャゲームのキャラクター判定AIです。画像に写っている人物を分析して、以下の情報を生成してください:

1. **レアリティ判定** (SSR/SR/R/N):
   - SSR: 非常に個性的、カリスマ性がある、オーラがある、美しい、特別な雰囲気
   - SR: 個性的、印象的な特徴がある、魅力的
   - R: 標準的だが好感が持てる、普通
   - N: ごく一般的、どこにでもいそう

2. **キャラクター名**: その人の見た目や雰囲気から連想される、面白くて個性的な名前（日本語で2〜6文字、ユーモアのある命名）

3. **セリフ2つ**: そのキャラクターが言いそうな、レアリティに合った印象的なセリフ（各20文字以内、ユーモアや個性を重視）

**重要**: 以下のJSON形式で必ず出力してください:
\`\`\`json
{
  "rarity": "SSR" | "SR" | "R" | "N",
  "name": "キャラクター名",
  "serifs": ["セリフ1", "セリフ2"]
}
\`\`\`

JSON以外のテキストは出力しないでください。`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64Data,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
    });

    // レスポンスからテキストを抽出
    const textContent = response.content.find((block) => block.type === 'text');
    if (!textContent || textContent.type !== 'text') {
      throw new Error('No text response from AI');
    }

    // JSON部分を抽出（```json ... ``` または直接JSON）
    const text = textContent.text.trim();
    let jsonText = text;

    // コードブロックで囲まれている場合は中身を抽出
    const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
    if (codeBlockMatch) {
      jsonText = codeBlockMatch[1].trim();
    }

    const result = JSON.parse(jsonText) as AIAnalysisResult;

    // バリデーション
    if (
      !result.rarity ||
      !['SSR', 'SR', 'R', 'N'].includes(result.rarity) ||
      !result.name ||
      !Array.isArray(result.serifs) ||
      result.serifs.length < 2
    ) {
      throw new Error('Invalid AI response format');
    }

    return result;
  } catch (error) {
    console.error('AI analysis error:', error);
    throw new Error(
      `AI分析に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}

/**
 * video要素またはimg要素から画像データURLを取得
 */
export function captureImageDataUrl(
  source: HTMLVideoElement | HTMLImageElement
): string {
  const canvas = document.createElement('canvas');

  if (source instanceof HTMLVideoElement) {
    canvas.width = source.videoWidth;
    canvas.height = source.videoHeight;
  } else {
    canvas.width = source.naturalWidth;
    canvas.height = source.naturalHeight;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }

  ctx.drawImage(source, 0, 0);
  return canvas.toDataURL('image/jpeg', 0.9);
}
