import { readFileSync } from "fs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

export default {
  testEnvironment: "jsdom", // Necesario para simular el navegador
  setupFiles: ["<rootDir>/jest.setup.js"], // Apunta al archivo donde agregas fetch
  transform: {
    "^.+\\.tsx?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }]
  },
  testRegex: "(/__tests__/.*|(\\.|/))(test|spec)\\.(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
