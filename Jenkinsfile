pipeline {
  agent any

  tools { nodejs 'node20' }

  stages {
    stage('Install') {
      steps {
        bat 'npm ci'
        bat 'npx playwright install chromium'
      }
    }
    stage('Test') {
      steps {
        bat 'if exist allure-results rmdir /s /q allure-results'
        bat 'npx cucumber-js'
      }
    }
  }

  post {
    always {
      allure includeProperties: false, jdk: '', results: [[path: 'allure-results']]
    }
  }
}