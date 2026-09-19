module.exports = {
  default: {
    requireModule: ['tsx/cjs'],
    require: ['features/support/**/*.ts', 'features/step_definitions/**/*.ts'],
    paths: ['features/**/*.feature'],
    format: [
      'progress-bar',
      'html:reports/cucumber-report.html',
      'allure-cucumberjs/reporter',
    ],
    formatOptions: {
      resultsDir: 'allure-results',
    },
    publishQuiet: true,
  },
};