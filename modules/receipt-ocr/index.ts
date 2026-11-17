import { requireOptionalNativeModule } from 'expo';

import type { RecognizedLine } from './src/ReceiptOcr.types';

export type { RecognizedLine };

type ReceiptOcrNativeModule = {
  recognizeText(fileUri: string): Promise<RecognizedLine[]>;
};

// requireOptionalNativeModule returns null (instead of throwing) when the native
// part isn't linked — exactly what an iOS-only module needs so the JS bundle
// doesn't crash on Android or in a build without the native code linked.
const ReceiptOcrModule = requireOptionalNativeModule<ReceiptOcrNativeModule>('ReceiptOcr');

/** true only when the Swift module is linked into this build (iOS dev build). */
export const isReceiptOcrAvailable = ReceiptOcrModule != null;

/**
 * Runs Apple Vision OCR on an image file. `fileUri` is a `file://` path
 * (what expo-image-picker / expo-file-system give you), NEVER base64, so the
 * full image never crosses the JS bridge.
 */
export function recognizeText(fileUri: string): Promise<RecognizedLine[]> {
  if (!ReceiptOcrModule) {
    throw new Error('receipt-ocr is not available on this platform.');
  }
  return ReceiptOcrModule.recognizeText(fileUri);
}
