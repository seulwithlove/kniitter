# Knit Pattern Reader App - Design Guide

## 1. Product Overview

### 1.1 Product Concept
뜨개질 패턴 PDF를 업로드하면 단계별로 한 줄씩 분리하여 체크박스와 함께 표시하는 스마트 리더 애플리케이션

### 1.2 Core Value
- PDF 패턴을 작업하기 쉬운 형태로 자동 변환
- 진행 상황을 실시간으로 체크하며 작업
- 복잡한 패턴을 단순하고 명확하게 관리

## 2. Design System (참고 이미지 스타일 적용)

### 2.1 Layout Structure

#### Main Screen Layout
- **Header Area**: 앱 타이틀, 뒤로가기 버튼
- **Content Grid**: 2열 카드 레이아웃
- **Card System**: 각 프로젝트를 카드로 표시
- **Mobile-first**: 스마트폰 최적화 디자인

#### Pattern Reader Screen Layout
- **Header**: 패턴 제목, 진행률 표시
- **Row Display**: 현재 작업 중인 줄 강조 표시
- **Checkbox List**: 각 단계별 체크박스
- **Navigation**: 이전/다음 섹션 이동

### 2.2 Color Palette (참고 이미지 기반)

#### Primary Colors
- **Light Blue** (#ADD8E6): 기본 패턴, 평편뜨기
- **Purple** (#DA70D6): 무늬뜨기, 복잡한 패턴
- **Beige** (#F5E6D3): 완료된 섹션
- **Orange** (#FF8C42): 중요 표시, 주의 필요한 줄
- **Mint** (#B2E8D8): 반복 구간
- **Pink** (#E6B3E6): 증가/감소 구간

#### Functional Colors
- **White** (#FFFFFF): 배경, 카드
- **Black** (#000000): 주요 텍스트
- **Gray** (#808080): 보조 텍스트
- **Green** (#4CAF50): 완료된 항목 체크박스
- **Red** (#FF5252): 오류, 취소

### 2.3 Typography

#### Font Hierarchy
- **App Title**: 48-56pt, Bold, Sans-serif
- **Pattern Title**: 24-28pt, Bold
- **Section Header**: 18-20pt, Semibold
- **Row Text**: 16-18pt, Regular, 가독성 최우선
- **Row Number**: 14-16pt, Medium
- **Helper Text**: 12-14pt, Regular
- **Font Family**: 
  - Korean: Pretendard, Noto Sans KR
  - English: SF Pro, Roboto

### 2.4 Card Design (프로젝트 카드)

#### Card Structure
```
┌─────────────────────────┐
│  [Pattern Icon]         │
│                         │
│  Pattern Name     [|||] │
│                         │
│  Progress: 45/120 rows  │
│  ██████████░░░░░░  38%  │
└─────────────────────────┘
```

#### Card Specifications
- **Border Radius**: 12-16px
- **Padding**: 16-20px
- **Shadow**: 0 2px 8px rgba(0,0,0,0.1)
- **Aspect Ratio**: 정사각형 또는 4:3
- **Icon**: 패턴 유형별 기하학적 아이콘

#### Card Colors by Pattern Type
- **Basic**: Light Blue - 기본 패턴
- **Lace**: Purple - 레이스 패턴
- **Cable**: Orange - 케이블 패턴
- **Colorwork**: Pink - 색상 작업
- **Textured**: Mint - 질감 패턴
- **Custom**: Beige - 사용자 정의

### 2.5 Iconography

#### Essential Icons
- **Back Button**: 검은색 원형 버튼, 왼쪽 화살표
- **Audio/Pattern Indicator**: ||| (세로 막대 3개)
- **Checkbox**: ☐ (미완료), ☑ (완료)
- **Upload**: 📤 업로드 아이콘
- **Edit**: ✏️ 편집 아이콘
- **Delete**: 🗑️ 삭제 아이콘
- **Progress**: 진행률 바

## 3. Core Screens

### 3.1 Home Screen (프로젝트 목록)

#### Layout
```
┌──────────────────────────┐
│ ← Knit Pattern Reader    │
│                          │
│ Upload your knitting     │
│ pattern PDF to start     │
│                          │
│ ┌──────┐  ┌──────┐      │
│ │ Blue │  │Purple│      │
│ │ Basic│  │ Lace │  ||| │
│ │      │  │      │      │
│ │ 38%  │  │ 62%  │      │
│ └──────┘  └──────┘      │
│                          │
│ ┌──────┐  ┌──────┐      │
│ │Orange│  │ Mint │      │
│ │Cable │  │Text  │  ||| │
│ │      │  │      │      │
│ │ 15%  │  │ 89%  │      │
│ └──────┘  └──────┘      │
│                          │
│      [+ Upload PDF]      │
└──────────────────────────┘
```

#### Elements
- 헤더: 앱 이름, 뒤로가기
- 설명 텍스트: "Upload your knitting pattern PDF to start"
- 프로젝트 카드 그리드 (2열)
- 플로팅 업로드 버튼

### 3.2 Pattern Reader Screen (메인 작업 화면)

#### Layout
```
┌──────────────────────────┐
│ ← Cozy Sweater Pattern   │
│ Section 2: Yoke          │
│ ━━━━━━━━━━━━━━░░░  75%  │
│                          │
│ ┌─ Row 45 ─────────────┐ │
│ │ ☑ K2, P2 repeat to   │ │
│ │   end of row         │ │
│ └─────────────────────-─┘ │
│                          │
│ ┌─ Row 46 ─────────────┐ │ ← Current
│ │ ☐ P2, K2 repeat to   │ │ ← Highlighted
│ │   end of row         │ │
│ └─────────────────────-─┘ │
│                          │
│ ┌─ Row 47 ─────────────┐ │
│ │ ☐ K all stitches     │ │
│ └─────────────────────-─┘ │
│                          │
│ ┌─ Row 48 ─────────────┐ │
│ │ ☐ P all stitches     │ │
│ └─────────────────────-─┘ │
│                          │
│  [← Prev]      [Next →]  │
└──────────────────────────┘
```

#### Row Card Design
```
┌─ Row [Number] ──────────────────┐
│ [☐/☑] [Pattern Instructions]    │
│       [Additional details]       │
│                            [|||] │ ← Optional audio note
└─────────────────────────────────┘
```

#### Specifications
- **Current Row**: 강조 배경색 (연한 파란색 또는 선택된 테마 색상)
- **Completed Row**: 회색 텍스트, 체크된 박스
- **Upcoming Row**: 기본 표시
- **Row Height**: 최소 60px, 내용에 따라 확장
- **Checkbox Size**: 24x24px, 탭 영역 44x44px

### 3.3 Upload Screen

#### Layout
```
┌──────────────────────────┐
│ ←  Upload Pattern        │
│                          │
│ ┌──────────────────────┐ │
│ │                      │ │
│ │       📤             │ │
│ │                      │ │
│ │  Drag & Drop PDF     │ │
│ │  or tap to browse    │ │
│ │                      │ │
│ └──────────────────────┘ │
│                          │
│  Pattern Name:           │
│  ┌──────────────────────┐│
│  │ Enter pattern name   ││
│  └──────────────────────┘│
│                          │
│  Pattern Type:           │
│  ○ Basic  ○ Lace        │
│  ○ Cable  ○ Colorwork   │
│  ○ Custom               │
│                          │
│      [Process PDF]       │
└──────────────────────────┘
```

### 3.4 Pattern Processing Screen

#### Layout
```
┌──────────────────────────┐
│ Processing Pattern...    │
│                          │
│     [Circular Spinner]   │
│                          │
│ ██████████░░░░░░  60%   │
│                          │
│ Analyzing structure...   │
│ Detecting rows...        │
│ Creating checklist...    │
└──────────────────────────┘
```

## 4. Interactive Components

### 4.1 Checkbox Interaction

#### States
- **Unchecked**: ☐ 흰색 배경, 회색 테두리
- **Checked**: ☑ 녹색 배경, 흰색 체크
- **Hover/Press**: 약간 확대 (scale 1.1)
- **Animation**: 체크 시 부드러운 스케일 + 회전 효과

### 4.2 Row Selection

#### Behavior
- **Tap Row**: 해당 줄을 현재 작업 줄로 설정
- **Visual Feedback**: 배경색 변경, 약간 확대
- **Auto-scroll**: 현재 줄이 항상 화면 중앙 근처에 위치
- **Swipe**: 좌우 스와이프로 이전/다음 섹션 이동

### 4.3 Progress Bar

#### Design
```
Current: 45 / 120
━━━━━━━━━━━━━━░░░░░░  38%
```

- **Filled**: 테마 색상 (진한 색)
- **Unfilled**: 연한 회색
- **Height**: 8px
- **Border Radius**: 4px
- **Animation**: 완료 시 부드러운 채우기 효과

### 4.4 Navigation Controls

#### Button Design
```
┌─────────┐     ┌─────────┐
│ ← Prev  │     │  Next → │
└─────────┘     └─────────┘
```

- **Size**: 최소 48x48px 탭 영역
- **Style**: 아웃라인 또는 가벼운 배경
- **Color**: 테마 색상
- **Disabled State**: 회색, 투명도 50%

## 5. Geometric Visual Elements

### 5.1 Pattern Type Icons (카드용)

#### Basic Pattern (Light Blue)
```
  ═══════
 ╔═══════╗
 ║       ║
 ╚═══════╝
```
- 둥근 캡슐 모양

#### Lace Pattern (Purple)
```
┌─────┐
│ ┌─┐ │
│ └─┘ │
└─────┘
```
- 레이어드 사각형

#### Cable Pattern (Orange)
```
  /────\
 /      \
/        \
```
- 교차하는 기하학 도형

#### Colorwork Pattern (Pink)
```
    △
   △△△
  △△△△△
```
- 삼각형 패턴

#### Textured Pattern (Mint)
```
   ╭───╮
  ╱     ╲
 ╱       ╲
```
- 반원형 아치

## 6. User Flow

### 6.1 Primary Flow
1. 홈 화면 진입
2. "Upload PDF" 버튼 탭
3. PDF 파일 선택
4. 패턴 이름 및 타입 입력
5. PDF 처리 (자동 파싱)
6. 패턴 리더 화면으로 이동
7. 줄별로 체크하며 작업 진행
8. 완료 시 진행률 100% 표시

### 6.2 Working Flow
1. 패턴 카드 선택
2. 이전 작업 위치에서 재개
3. 현재 줄 읽기
4. 뜨개질 작업 수행
5. 체크박스 탭하여 완료 표시
6. 자동으로 다음 줄로 이동
7. 반복

## 7. Technical Features

### 7.1 PDF Processing
- PDF 텍스트 추출
- 행 번호 자동 인식
- 섹션 구분 (Cast On, Body, Yoke, etc.)
- 반복 패턴 감지

### 7.2 Data Storage
- 프로젝트별 진행 상황 저장
- 체크박스 상태 로컬 저장
- PDF 원본 보관
- 동기화 옵션 (선택사항)

### 7.3 Smart Features
- 현재 위치 자동 저장
- 앱 재시작 시 마지막 위치로 복귀
- 완료된 줄 흐림 처리
- 검색 기능 (특정 줄 찾기)

## 8. Responsive Design

### 8.1 Screen Sizes
- **Small (320-375px)**: 1열 레이아웃
- **Medium (376-414px)**: 2열 레이아웃
- **Large (415px+)**: 2열 + 넓은 여백

### 8.2 Orientation
- **Portrait**: 기본 레이아웃
- **Landscape**: 와이드 뷰, 더 많은 줄 표시

## 9. Accessibility

### 9.1 Requirements
- **최소 터치 영역**: 44x44px
- **대비율**: WCAG AA 기준 (4.5:1)
- **글자 크기**: 사용자 설정 가능
- **Screen Reader**: 모든 요소 접근 가능
- **Dark Mode**: 다크 모드 지원

### 9.2 Color Blindness
- 색상에만 의존하지 않는 디자인
- 아이콘과 텍스트로 상태 표시
- 고대비 옵션 제공

## 10. Animation & Transitions

### 10.1 Page Transitions
- **Duration**: 300ms
- **Easing**: ease-in-out
- **Effect**: 슬라이드 또는 페이드

### 10.2 Micro-interactions
- **Checkbox**: 150ms 스케일 + 체크 애니메이션
- **Row Selection**: 200ms 배경색 전환
- **Progress**: 400ms 부드러운 증가
- **Card Tap**: 100ms 스케일 피드백

## 11. Success Metrics

### 11.1 KPIs
- 패턴 완료율
- 일일 활성 사용자
- 평균 세션 시간
- PDF 업로드 성공률
- 사용자 만족도

### 11.2 User Satisfaction
- 직관적인 인터페이스
- 빠른 PDF 처리
- 정확한 패턴 파싱
- 안정적인 진행 상황 저장