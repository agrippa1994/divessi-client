import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
    semi: true,
    sortPackageJson: true,
    ignorePatterns: ['dist/**', 'node_modules/**', 'pnpm-lock.yaml'],
  },
  lint: {
    ignorePatterns: ['dist/**', 'node_modules/**'],
    options: { typeAware: true, typeCheck: true },
  },
});
