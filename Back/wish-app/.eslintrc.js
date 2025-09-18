module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended', //active les règles pour TypeScript
    'plugin:prettier/recommended', //intègre Prettier dans ESLint
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'prettier/prettier': 'warn', // affiche un warning si Prettier n’est pas respecté
    '@typescript-eslint/interface-name-prefix': 'off', //désactive l’obligation de préfixer les interfaces par un I
    '@typescript-eslint/explicit-module-boundary-types': 'off', //désactive l’obligation de typer les retours de fonctions et les exports
    '@typescript-eslint/no-explicit-any': 'off', //désactive l’utilisation du type any
    'no-console': ['warn', { allow: ['warn', 'error'] }], //Warn si console.log() (mais autorise console.warn/error en dev)
    '@typescript-eslint/no-non-null-assertion': 'error', //Interdit l’opérateur "!" (ex: user!.name), car dangereux si null
  },
};
