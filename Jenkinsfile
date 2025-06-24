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

        stage('Check Docker Access') {
            steps {
                sh 'whoami && id && docker info'
            }
        }

        stage('Build Base Image') {
            steps {
                echo 'Building base image: aspnet-libreoffice:8.0...'
                sh 'docker build -t aspnet-libreoffice:8.0 -f infra/docker/Dockerfile.base .'
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
                echo 'Deploying app to server...'
                sshagent(['jenkins-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no root@192.168.28.211 '
                            cd /opt/vcvapp || git clone https://github.com/minhtruong-ooo/vcvapp.git /opt/vcvapp &&
                            cd /opt/vcvapp &&
                            git pull origin main &&
                            docker compose -f infra/docker-compose.yml build &&
                            docker compose -f infra/docker-compose.yml up -d
                        '
                    '''
                }
            }
        }
    }
}
