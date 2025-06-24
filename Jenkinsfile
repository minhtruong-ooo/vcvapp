pipeline {
    agent any

    environment {
        DEPLOY_HOST = '192.168.28.211'
        DEPLOY_PATH = '/opt/vcvapp'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    def changes = sh(script: "git log -n 5 --pretty=format:'%h %an %s'", returnStdout: true).trim()
                    echo "Recent changes:\n${changes}"
                }
            }
        }

        stage('Build') {
            steps {
                echo 'Building project...'
                // Add actual build commands here if needed
            }
        }

        stage('Test') {
            steps {
                echo 'Running tests...'
                // Add actual test commands here
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying app to server...'
                sshagent(['jenkins-ssh-key']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no root@${DEPLOY_HOST} '
                            cd ${DEPLOY_PATH} && \
                            git pull origin main && \
                            docker compose up --build -d
                        '
                    """
                }
            }
        }
    }
}
