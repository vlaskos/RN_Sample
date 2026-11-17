// The single entry point through which the app imports the native OCR module.
// Hides the ugly relative path to modules/ in one place.
export { isReceiptOcrAvailable, recognizeText, type RecognizedLine } from '../../../modules/receipt-ocr';
