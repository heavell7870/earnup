// commitlint.config.js
export default {
    plugins: ['@commitlint/config-conventional'],
    rules: {
      'type-enum': [2, 'always', ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert']],
      'subject-case': [2, 'always', 'sentence-case']
    }
};