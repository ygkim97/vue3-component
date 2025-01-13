import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";

export default [
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"]
  },

  {
    name: "app/files-to-ignore",
    ignores: ["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]
  },
  {
    name: "app/custom-rules",
    rules: {
      semi: "error",
      // if문 등 한줄 코드 중괄호 강제
      curly: "error", // https://eslint.org/docs/latest/rules/curly
      // switch / case 에서 default 강제
      "default-case": "error", // https://eslint.org/docs/latest/rules/default-case
      // switch / case 에서 default는 맨 마지막
      "default-case-last": "error", // https://eslint.org/docs/latest/rules/default-case-last
      // 비교 구문  ====
      eqeqeq: ["error", "always"], // https://eslint.org/docs/latest/rules/eqeqeq,
      // 변수명을 a, b, i 등 의미없는 한글자 제한
      "id-length": ["error", { // https://eslint.org/docs/latest/rules/id-length
        "min": 2,
        "exceptions": ["x", "y", "z"], // 예외 처리
      }],
      // 변수 선언시 무조건 초기화
      "init-declarations": ["error", "always"], // https://eslint.org/docs/latest/rules/init-declarations
      //  콜백이 중첩될 수 있는 최대 깊이 3
      "max-nested-callbacks": ["error", 3], // https://eslint.org/docs/latest/rules/max-nested-callbacks
      "no-empty": "error",
      "prefer-const": "error",
      "no-var": "error",
      "@typescript-eslint/no-explicit-any": "off"
    }
  },

  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  skipFormatting
];
