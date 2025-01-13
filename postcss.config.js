export default {
  plugins: {
    // Tailwind CSS 플러그인 설정
    tailwindcss: { config: "./tailwind.config.js" }, // Tailwind CSS의 설정 파일 경로를 지정, 지정하지 않으면 자동으로 루트 디렉토리에서 tailwind.config.js 파일을 찾음

    // Autoprefixer 플러그인 설정
    autoprefixer: {
      browsers: ["last 2 versions", "> 1%"], // 지원할 브라우저를 지정 (최신 2개 버전과, 점유율이 1% 이상인 브라우저들에 대해 접두사 추가)
      cascade: false // CSS 속성의 접두사 정렬 설정 (알파벳 순서대로 정렬하지 않음)
    }
  }
};
