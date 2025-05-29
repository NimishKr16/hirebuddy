import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractTextFromBuffer(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    if (data.text.trim()) {
      return data.text;
    }
  } catch (e) {
    console.warn("PDF parsing failed, trying DOCX:", e);
  }

  try {
    const { value } = await mammoth.extractRawText({ buffer });
    if (value.trim()) {
      return value;
    }
  } catch (e) {
    console.warn("DOCX parsing failed:", e);
  }

  return "";
}