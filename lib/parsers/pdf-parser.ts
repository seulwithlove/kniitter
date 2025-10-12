/**
 * PDF 파일 파서
 * pdf2json 라이브러리 사용 (Node.js 환경 전용)
 */

export async function parsePDFFile(file: File): Promise<string> {
  try {
    // 동적 import로 pdf2json 로드 (서버 사이드 전용)
    const PDFParser = (await import("pdf2json")).default;

    // File 객체를 Buffer로 변환
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // PDF 파싱을 위한 Promise 래퍼
    return new Promise<string>((resolve, reject) => {
      const pdfParser = new PDFParser();

      // 에러 핸들링
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF 파싱 오류:", errData.parserError);
        reject(new Error("PDF 파일을 파싱할 수 없습니다."));
      });

      // 성공 핸들링
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
        try {
          // pdf2json 데이터에서 텍스트 추출
          let extractedText = "";

          if (pdfData && pdfData.Pages && Array.isArray(pdfData.Pages)) {
            for (const page of pdfData.Pages) {
              if (page.Texts && Array.isArray(page.Texts)) {
                for (const textElement of page.Texts) {
                  if (textElement.R && Array.isArray(textElement.R)) {
                    for (const textRun of textElement.R) {
                      if (textRun.T) {
                        extractedText += decodeURIComponent(textRun.T) + " ";
                      }
                    }
                  }
                }
              }
              extractedText += "\n"; // 페이지 구분
            }
          }

          if (!extractedText.trim()) {
            reject(new Error("PDF에서 텍스트를 추출할 수 없습니다."));
            return;
          }

          console.log(
            `PDF 파싱 완료: ${pdfData.Pages?.length || 0}페이지, ${extractedText.length}자`,
          );
          resolve(extractedText.trim());
        } catch (error) {
          console.error("텍스트 추출 오류:", error);
          reject(new Error("PDF 텍스트 추출 중 오류가 발생했습니다."));
        }
      });

      // PDF 로드 및 파싱 시작
      pdfParser.parseBuffer(buffer);
    });
  } catch (error) {
    console.error("PDF 파싱 초기화 오류:", error);

    if (error instanceof Error) {
      if (error.message.includes("Invalid PDF")) {
        throw new Error("유효하지 않은 PDF 파일입니다.");
      }
      if (error.message.includes("encrypted")) {
        throw new Error("암호화된 PDF는 지원하지 않습니다.");
      }
      throw new Error(`PDF 파싱 실패: ${error.message}`);
    }

    throw new Error("PDF 파일을 파싱할 수 없습니다.");
  }
}
