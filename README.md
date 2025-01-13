# 🌟 vue3-component

### 🎯 프로젝트 목적
- Vue3 를 기반으로 재사용 가능한 공통 컴포넌트를 개발하여 다양한 애플리케이션에서 생산성과 코드 품질을 향상시키는 것을 목적

### 🗂️ 프로젝트 구조
```markdown
├── src
│   ├── assets/           # 정적 파일 디렉토리 (이미지, 폰트 등)
│   ├── components/       # 재사용 가능한 Vue 컴포넌트 (헤더, 푸터 등)
│   ├── router/           # Vue Router 설정 파일 (라우팅 관련 설정)
│   │   └── index.ts      # 라우터 설정 파일 (페이지 이동 경로 설정 등)
│   ├── stores/           # Pinia 또는 Vuex 상태 관리 (앱의 전역 상태를 관리)
│   ├── views/            # Vue의 뷰 컴포넌트 (각각의 페이지를 정의하는 컴포넌트)
│   ├── App.vue           # 루트 컴포넌트 (앱의 레이아웃 및 글로벌 설정 등)
│   └── main.ts           # 앱의 진입점 (Vue 앱을 마운트하고 전역 설정을 하는 곳)
├── public/               # 정적 리소스 파일 (직접 접근 가능한 HTML 파일 및 이미지 등)
├── .editorconfig         # 팀원 간 일관된 코드 스타일 유지 (들여쓰기, 줄바꿈 등 설정)
├── .gitignore            # Git에 포함되지 않을 파일 및 디렉토리 정의
├── .prettierrc.json5     # Prettier 설정 파일 (코드 스타일 규칙 설정), 주석처리 위해 json5 로 변경
├── env.d.ts              # TypeScript 환경 변수 타입 정의
├── eslint.config.js      # ESLint 설정 파일 (코드 품질 및 스타일 검사 규칙)
├── index.html            # 앱의 메인 HTML 파일 (Vue 앱 마운트 포인트)
├── package.json          # 프로젝트 메타데이터 및 종속성 목록
├── package-lock.json     # 프로젝트 종속성 잠금 파일 (정확한 버전 관리)
├── tsconfig.app.json     # TypeScript 설정 (앱 관련 컴파일러 옵션)
├── tsconfig.json         # TypeScript 기본 설정 파일
├── tsconfig.node.json    # Node.js 관련 TypeScript 설정
└── vite.config.ts        # Vite 설정 파일 (개발 서버 및 빌드 구성)
```
