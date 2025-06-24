pipeline {
    agent any

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
                sshagent(['jenkins-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no root@192.168.28.211 '
                            cd /opt/vcvapp && \
                            docker compose pull && \
                            docker compose up --build -d
                        '
                    '''
                }
            }
        }
    }
}