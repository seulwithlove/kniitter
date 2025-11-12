# 개발 체크리스트

## Phase 1: 기본 구조 및 테마 설정 ✅
- [x] 프로젝트 세팅 (Next.js, pnpm, Biome, shadcn/ui)
- [x] next-themes 설정
- [x] ThemeProvider 설정
- [x] ThemeToggle 컴포넌트 생성
- [x] Primary color 커스터마이징 (#6366F1)
- [x] 폴더 구조 생성
- [x] 타입 정의
- [x] 기본 레이아웃 및 라우팅
- [x] Pretendard 폰트 추가
- [ ] logo 추가: gpt활용

## Phase 2: UI 컴포넌트 (shadcn 활용) ✅
- [x] PatternUpload 컴포넌트 (Card, Button 사용)
- [x] SizeSelector 컴포넌트 (Button, Badge 사용)
- [x] PatternViewer 컴포넌트 (Card, Checkbox, Separator 사용)
- [x] ProgressBar (shadcn Progress 사용)
- [x] Toast 알림 (Toaster 추가)

## Phase 3: 파싱 로직 ✅
- [x] PDF 파서 (pdf-parser.ts, pdf2json 라이브러리)
- [ ] 사이즈 패턴 인식 로직 (size-pattern-recognizer.ts)
- [ ] 단계 분리 로직 (step-separator.ts)
- [x] PatternUpload 컴포넌트에 파싱 연동
- [x] 메인 페이지에 전체 플로우 연결

## Phase 4: 상태 관리
- [ ] 체크박스 상태 관리
    - [x] 상태 저장
    - [x] 상태 로드:projectbox page
    - [ ] 완료한 프로젝트 ui 표시
- [x] 다크모드 상태 관리
- [x] 프로젝트 수정 관리 - dialog 활용

## Phase 5: 통합 및 테스트
- [ ] 전체 플로우 연결
- [ ] 에러 핸들링 (Alert 컴포넌트 사용)
- [x] 라이트/다크 모드 테스트
- [ ] 반응형 디자인
- [ ] 실제 도안으로 테스트


## Phase 6: 고도화
- [x] UI 디자인 수정 
- [ ] 형광펜 기능
- [ ] 검색 기능 : 특정 기법에 대해
- [ ] 커뮤니티 기능
- [ ] 텍스트 복사 금지 기능 : 복제 방지