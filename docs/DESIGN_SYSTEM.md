# 디자인 시스템

## 컬러 팔레트
```css
/* Light Mode */
--primary: 239 84% 67%;              /* #6366F1 Indigo */
--primary-foreground: 0 0% 100%;

--background: 0 0% 100%;
--foreground: 222.2 84% 4.9%;

--card: 0 0% 100%;
--card-foreground: 222.2 84% 4.9%;

--border: 214.3 31.8% 91.4%;
--input: 214.3 31.8% 91.4%;

/* Dark Mode */
--primary: 239 84% 67%;
--primary-foreground: 0 0% 100%;

--background: 222.2 84% 4.9%;
--foreground: 210 40% 98%;

--card: 222.2 84% 4.9%;
--card-foreground: 210 40% 98%;

--border: 217.2 32.6% 17.5%;
--input: 217.2 32.6% 17.5%;
```

## 타이포그래피

- 제목: 24px, Font Weight 700
- 본문: 16px, Font Weight 400
- 단계 텍스트: 18px, Font Weight 500

## 컴포넌트 스타일
### 버튼

- Border Radius: 8px
- Primary: Indigo 배경, 흰색 텍스트
- Outline: 투명 배경, Indigo 보더

### 체크박스
- 크기: 20x20px
- 체크 시: Primary color
- Border: 2px

### 카드
- Border Radius: 12px
- Shadow: subtle
- Padding: 24px

## 화면별 레이아웃
### 메인 화면 (업로드 전)
- 중앙 정렬
- 최대 너비: 600px
- 업로드 영역: 점선 보더, 최소 높이 200px

### 작업 화면 (업로드 후)
- 최대 너비: 800px
- 상단: 진행률 바 + 사이즈 선택
- 하단: 스크롤 가능한 단계 리스트