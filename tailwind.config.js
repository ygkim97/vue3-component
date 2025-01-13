/** @type {import('tailwindcss').Config} */
export default {
  // TailwindCSS가 적용될 HTML 및 Vue/JS/TS 파일 경로를 지정
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    // 사용자 정의 스타일을 추가하거나 수정할 수 있는 부분
    extend: {}
  },
  // TailwindCSS 플러그인 추가
  plugins: []
};
