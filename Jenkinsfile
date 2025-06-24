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
                sh 'whoami && id && docker info || true'
            }
        }

        stage('Deploy') {
            steps {
                echo 'Deploying app to server...'
                sshagent(['jenkins-ssh-key']) {
                    sh '''
                        ssh -o StrictHostKeyChecking=no root@192.168.28.211 '
                            set -e

                            echo "[1/4] Cloning or pulling latest repo..."
                            if [ ! -d /opt/vcvapp ]; then
                                git clone https://github.com/minhtruong-ooo/vcvapp.git /opt/vcvapp
                            fi

                            cd /opt/vcvapp
                            git pull origin main

                            echo "[2/4] Building base image aspnet-libreoffice:8.0..."
                            docker build -t aspnet-libreoffice:8.0 -f infra/docker/Dockerfile.base infra

                            echo "[3/4] Building services..."
                            docker compose -f infra/docker-compose.yml build

                            echo "[4/4] Starting services..."
                            docker compose -f infra/docker-compose.yml up -d
                        '
                    '''
                }
            }
        }
    }
}
