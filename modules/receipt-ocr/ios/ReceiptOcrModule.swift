import ExpoModulesCore
import Vision
import UIKit

/// One recognized line. The box is normalized (0–1) with a TOP-left origin
/// (Vision gives bottom-left — converted below) so JS can lay it out like views.
struct RecognizedLine: Record {
  @Field var text: String = ""
  @Field var confidence: Double = 0
  @Field var x: Double = 0
  @Field var y: Double = 0
  @Field var width: Double = 0
  @Field var height: Double = 0
}

public class ReceiptOcrModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ReceiptOcr")

    // Reads text from an image file via Apple Vision (public API, no entitlement
    // required for file-based OCR). Work runs off the main thread; the Promise
    // resolves with an array of RecognizedLine.
    AsyncFunction("recognizeText") { (fileUri: String, promise: Promise) in
      guard let url = URL(string: fileUri) else {
        promise.reject("ERR_INVALID_URI", "Invalid file URI: \(fileUri)")
        return
      }
      let path = url.isFileURL ? url.path : fileUri
      guard FileManager.default.fileExists(atPath: path) else {
        promise.reject("ERR_FILE_NOT_FOUND", "No file at path: \(path)")
        return
      }
      guard let image = UIImage(contentsOfFile: path), let cgImage = image.cgImage else {
        promise.reject("ERR_UNREADABLE", "Could not decode image at path: \(path)")
        return
      }

      let request = VNRecognizeTextRequest { request, error in
        if let error = error {
          promise.reject("ERR_OCR_FAILED", error.localizedDescription)
          return
        }
        guard let observations = request.results as? [VNRecognizedTextObservation] else {
          promise.resolve([RecognizedLine]())
          return
        }
        let lines: [RecognizedLine] = observations.compactMap { observation in
          guard let candidate = observation.topCandidates(1).first else { return nil }
          let box = observation.boundingBox // normalized, bottom-left origin
          let line = RecognizedLine()
          line.text = candidate.string
          line.confidence = Double(candidate.confidence)
          line.x = Double(box.origin.x)
          // bottom-left → top-left: y_top = 1 - (y + height).
          line.y = Double(1.0 - box.origin.y - box.size.height)
          line.width = Double(box.size.width)
          line.height = Double(box.size.height)
          return line
        }
        promise.resolve(lines)
      }

      request.recognitionLevel = .accurate
      request.usesLanguageCorrection = true
      request.recognitionLanguages = ["en-US", "de-DE"]

      DispatchQueue.global(qos: .userInitiated).async {
        let handler = VNImageRequestHandler(
          cgImage: cgImage,
          orientation: cgOrientation(from: image.imageOrientation),
          options: [:]
        )
        do {
          try handler.perform([request])
        } catch {
          promise.reject("ERR_OCR_FAILED", error.localizedDescription)
        }
      }
    }
  }
}

/// Maps a UIImage EXIF orientation → CGImagePropertyOrientation expected by Vision.
private func cgOrientation(from orientation: UIImage.Orientation) -> CGImagePropertyOrientation {
  switch orientation {
  case .up: return .up
  case .down: return .down
  case .left: return .left
  case .right: return .right
  case .upMirrored: return .upMirrored
  case .downMirrored: return .downMirrored
  case .leftMirrored: return .leftMirrored
  case .rightMirrored: return .rightMirrored
  @unknown default: return .up
  }
}
