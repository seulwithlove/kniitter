declare module "pdf-parse" {
  export type PdfParseResult = {
    text: string;
    numpages?: number;
    numrender?: number;
    info?: unknown;
    metadata?: unknown;
    version?: string;
  };

  export type PdfParseOptions = {
    pagerender?: (pageData: unknown) => Promise<string>;
    max?: number;
    version?: string;
  };

  export default function pdfParse(
    data: Buffer | Uint8Array | ArrayBuffer,
    options?: PdfParseOptions,
  ): Promise<PdfParseResult>;
}
