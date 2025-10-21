/**
 * 사이즈 패턴 인식 로직
 * 예: "20 (24) 28 (32)코" -> S, M, L, XL 사이즈 추출
 */

interface SizeInfo {
  name: string;
  label: string;
}

/**
 * 텍스트에서 사이즈 패턴을 감지합니다.
 * 예: "S (M) L (XL)" 또는 "85 (90) 95 (100)"
 */
export function detectSizes(text: string): SizeInfo[] {
  const sizePatterns = [
    // 패턴 1: 알파벳 사이즈 (예: S (M) L (XL))
    /\b([A-Z]+)\s*\(([A-Z]+)\)(?:\s+([A-Z]+)\s*\(([A-Z]+)\))?/g,
    // 패턴 2: 숫자 + 단위로 사이즈 표시 (예: 85cm (90cm) 95cm (100cm))
    /(\d+)\s*(?:cm|센치|사이즈)?\s*\((\d+)\s*(?:cm|센치|사이즈)?\)(?:\s+(\d+)\s*(?:cm|센치|사이즈)?\s*\((\d+)\s*(?:cm|센치|사이즈)?\))?/g,
  ];

  const sizes: SizeInfo[] = [];
  const defaultSizes = ["S", "M", "L", "XL"];

  for (const pattern of sizePatterns) {
    const matches = [...text.matchAll(pattern)];
    
    if (matches.length > 0) {
      const match = matches[0];
      const values = match.slice(1).filter(Boolean);
      
      // 알파벳 사이즈인 경우
      if (values[0] && /^[A-Z]+$/.test(values[0])) {
        values.forEach((value) => {
          if (!sizes.find((s) => s.name === value)) {
            sizes.push({ name: value, label: value });
          }
        });
        break;
      }
      
      // 숫자 사이즈인 경우 기본 라벨 사용
      if (values.length > 0) {
        values.forEach((value, index) => {
          const label = defaultSizes[index] || `Size${index + 1}`;
          sizes.push({ name: label, label: `${label} (${value})` });
        });
        break;
      }
    }
  }

  // 사이즈를 찾지 못한 경우, 숫자 패턴만 찾아서 추론
  if (sizes.length === 0) {
    const numberPattern = /(\d+)\s*\((\d+)\)/g;
    const matches = [...text.matchAll(numberPattern)];
    
    if (matches.length > 0) {
      // 첫 번째 매칭에서 사이즈 개수 추론
      const match = matches[0];
      const numbers = match.slice(1).filter(Boolean);
      
      if (numbers.length === 2) {
        // 2개 사이즈: S, M
        sizes.push(
          { name: "S", label: "S" },
          { name: "M", label: "M" },
        );
      }
    }
  }

  // 기본값: 사이즈를 전혀 찾지 못한 경우
  if (sizes.length === 0) {
    sizes.push(
      { name: "S", label: "S" },
      { name: "M", label: "M" },
      { name: "L", label: "L" },
      { name: "XL", label: "XL" },
    );
  }

  return sizes;
}

/**
 * 선택된 사이즈에 맞춰 텍스트를 변환합니다.
 * 예: "20 (24) 28 (32)코" + sizeIndex=0 -> "20코"
 */
export function applySize(text: string, sizeIndex: number): string {
  // 패턴: 숫자 (숫자) 숫자 (숫자)
  const pattern = /(\d+)\s*\((\d+)\)(?:\s+(\d+)\s*\((\d+)\))?/g;
  
  return text.replace(pattern, (match, n1, n2, n3, n4) => {
    const numbers = [n1, n2, n3, n4].filter(Boolean);
    
    if (sizeIndex < numbers.length) {
      return numbers[sizeIndex];
    }
    
    return match;
  });
}

