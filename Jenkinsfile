pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'ดึงโค้ดล่าสุดจาก Github'
                checkout scm
            }
        }

        // ขั้นตอนนี้จะทำการ Build ทั้ง Backend และ Frontend ตามที่ระบุไว้ใน compose
        stage('Docker Compose Build') {
            steps {
                echo 'กำลัง Build Images ทั้งหมดด้วย Docker Compose...'
                // สั่ง build ทุก service ที่อยู่ใน docker-compose.yml
                sh 'docker-compose build'
            }
        }

        // ขั้นตอนการรันระบบ
        stage('Deploy') {
            steps {
                echo 'กำลังเริ่มการทำงานของระบบ (Up)...'
                // -d คือรันแบบ background
                // docker-compose up จะจัดการหยุดตัวเก่าและรันตัวใหม่ให้เองหาก image เปลี่ยนไป
                sh 'docker-compose up -d'
            }
        }

        stage('Cleanup') {
            steps {
                echo 'ล้าง Image เก่าๆ ที่ไม่ได้ใช้งานออก'
                // ช่วยประหยัดพื้นที่ disk ของเซิร์ฟเวอร์
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo '✅ ระบบอัปเดตและรันสำเร็จแล้ว!'
        }
        failure {
            echo '❌ เกิดข้อผิดพลาดในการ Pipeline'
        }
    }
}