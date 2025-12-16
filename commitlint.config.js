module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat',     // New feature
                'fix',      // Bug fix
                'docs',     // Documentation
                'style',    // Code style (formatting, no logic change)
                'refactor', // Code refactor
                'perf',     // Performance improvement
                'test',     // Tests
                'build',    // Build system
                'ci',       // CI/CD
                'chore',    // Maintenance
                'revert',   // Revert commit
            ],
        ],
        'type-case': [2, 'always', 'lower-case'],
        'subject-case': [2, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 100],
    },
};
