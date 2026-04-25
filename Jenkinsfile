pipeline {
    agent any

    environment {
        API_DIR = "server_personal_tracking"
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    stages {
        stage('Checkout') {
            steps {
                echo '📦 Checkout Source Code...'
                checkout scm
            }
        }

        stage('Prepare Config & Build') {
            steps {
                echo '🛠️ Copying Secrets and Building Images...'
                withCredentials([
                    file(credentialsId: 'APPSETTINGS_PRODUCTION', variable: 'SECRET_FILE'),
                    string(credentialsId: 'MY_API_URL', variable: 'SECRET_URL'),
                    string(credentialsId: 'DB_PASSWORD', variable: 'SQL_PASS') 
                ]) {
                    sh '''#!/bin/bash
                    set -e
                    echo "--> Copying appsettings.json into ${API_DIR}..."
                    cp "$SECRET_FILE" ./${API_DIR}/appsettings.json
                    
                    # สร้างไฟล์ .env ให้ docker-compose อ่านค่ารหัสผ่านไปใช้ได้
                    echo "SQL_PASSWORD=${SQL_PASS}" > .env
                    
                    echo "--> Building all required images..."
                    # ไม่ต้องระบุแค่ frontend แล้ว ให้ build รวดเดียวเลย
                    API_URL="${SECRET_URL}" docker-compose build --no-cache
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying Application...'
                
                // ใช้ withCredentials อีกรอบตอน Deploy เพราะ docker-compose up ต้องใช้ค่า API_URL 
                withCredentials([
                    string(credentialsId: 'MY_API_URL', variable: 'SECRET_URL')
                ]) {
                    sh '''#!/bin/bash
                    set -e
                    
                    echo "--> Stopping existing containers..."
                    docker-compose down
                    
                    echo "--> Starting new containers..."
                    API_URL="${SECRET_URL}" docker-compose up -d
                    '''
                }
            }
            post {
                failure {
                    echo '🚨 Deploy ล้มเหลว! กำลังดึง Log ของ Nginx และ Backend มาดูสาเหตุ...'
                    sh 'docker-compose logs --tail=50 nginx_proxy backend_tracking'
                }
            }
        }

        stage('Cleanup') {
            steps {
                echo '🧹 Cleaning up dangling images...'
                sh 'docker image prune -f'
            }
        }
    }

    post {
        always {
            echo '📊 สถานะ Container ของโปรเจกต์นี้:'
            sh 'docker-compose ps'
        }
        success {
            echo '✅ Pipeline ทำงานเสร็จสมบูรณ์ ระบบรันเป็น HTTPS แล้ว!'
        }
        failure {
            echo '❌ Pipeline ล้มเหลว! ลองเช็คดูว่า Nginx ล่มเพราะหาไฟล์ Certificate ไม่เจอหรือเปล่า'
        }
    }
}