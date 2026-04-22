pipeline {
    agent any

    // 1. ตั้งค่า Environment Variables (ถ้าโฟลเดอร์เปลี่ยน แก้แค่ตรงนี้ที่เดียวจบ)
    environment {
        API_DIR = "server_personal_tracking"
    }

    // 2. Best Practice Options: ป้องกันเซิร์ฟเวอร์ Jenkins ทำงานหนักเกินไป
    options {
        timeout(time: 15, unit: 'MINUTES') // ป้องกัน Pipeline ค้าง (ถ้าเกิน 15 นาทีให้ตัดจบเลย)
        buildDiscarder(logRotator(numToKeepStr: '10')) // เก็บประวัติ Build ไว้แค่ 10 ครั้งล่าสุด (ประหยัดพื้นที่ดิสก์)
        disableConcurrentBuilds() // ป้องกันการกด Build รัวๆ จนทำงานซ้อนกันแล้วพัง
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
                
                withCredentials([file(credentialsId: 'APPSETTINGS_PRODUCTION', variable: 'SECRET_FILE')]) {
                    // ใช้ set -e เพื่อให้ระบบพ่น Error จริงออกมาและหยุดการทำงานทันทีถ้ามีคำสั่งใดพัง
                    // และแก้ Path ให้ชี้ไปที่โฟลเดอร์ของ API ที่ถูกต้องตามที่เราคุยกันไว้
                    sh '''#!/bin/bash
                    set -e
                    echo "--> Copying appsettings.json into ${API_DIR}..."
                    cp "$SECRET_FILE" ./${API_DIR}/appsettings.json
                    
                    echo "--> Building Docker Compose..."
                    docker-compose build
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying Application...'
                sh '''#!/bin/bash
                set -e
                
                # Best Practice: สั่ง down ก่อนเพื่อล้าง Container เก่าให้สะอาด ป้องกัน Port ชนหรือ Cache ค้าง
                docker-compose down
                
                echo "--> Starting containers..."
                docker-compose up -d
                '''
            }
            post {
                failure {
                    // หาก Deploy พัง (เช่น รันขึ้นมาแล้ว Crash ทันที) ให้ดูด Log ล่าสุดมาแสดงใน Jenkins เลย
                    echo '🚨 Deploy ล้มเหลว! กำลังดึง Log จาก Container เพื่อหาสาเหตุ...'
                    sh 'docker-compose logs --tail=50'
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

    // ส่วนสรุปท้ายสุดของทั้ง Pipeline
    post {
        always {
            echo '📊 สถานะ Container ของโปรเจกต์นี้:'
            // ใช้ docker-compose ps ดีกว่า docker ps -a เพราะมันจะแสดงเฉพาะของโปรเจกต์นี้ ไม่กวนกับระบบอื่น
            sh 'docker-compose ps'
        }
        success {
            echo '✅ Pipeline ทำงานเสร็จสมบูรณ์!'
        }
        failure {
            echo '❌ Pipeline ล้มเหลว! (เลื่อนขึ้นไปดู Error สีแดงในขั้นตอนที่พังได้เลย ระบบไม่ได้ซ่อนข้อความแล้ว)'
        }
    }
}