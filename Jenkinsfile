pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Cloning repo...'
                checkout scm
            }
        }
        stage('Build') {
            steps {
                echo 'Building project...'
            }
        }
        stage('Test') {
            steps {
                echo 'Running tests...'
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying app...'
            }
        }
    }
}