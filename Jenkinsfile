pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'ดึงโค้ดล่าสุดจาก Github'
                checkout scm
            }
            post {
                failure {
                    echo '❌ Error: ไม่สามารถดึงโค้ดจาก GitHub ได้ (เช็ค Credentials หรือ Network)'
                }
            }
        }

        stage('Docker Compose Build') {
            steps {
                echo 'กำลัง Build Images ทั้งหมดด้วย Docker Compose...'
                // ใช้การเช็คผ่าน shell โดยตรง
                sh 'docker compose build'
            }
            post {
                failure {
                    echo '❌ Error: ขั้นตอน Build พัง! อาจเกิดจาก Dockerfile เขียนผิด หรือ Build error ใน Code'
                }
            }
        }

        stage('Deploy') {
            steps {
                echo 'กำลังเริ่มการทำงานของระบบ (Up)...'
                sh 'docker compose up -d'
            }
            post {
                failure {
                    echo '❌ Error: Deploy ไม่สำเร็จ! เช็คพอร์ตที่จองไว้ หรือสิทธิ์ในการรัน Container'
                    // คำสั่งเสริม: ให้มันพ่น log ของ docker ออกมาดูเลยว่าทำไมพัง
                    sh 'docker compose logs --tail=20'
                }
            }
        }

        stage('Cleanup') {
            steps {
                echo 'ล้าง Image เก่าๆ ที่ไม่ได้ใช้งานออก'
                sh 'docker image prune -f'
            }
            post {
                failure {
                    echo '⚠️ Warning: ล้างขยะไม่สำเร็จ แต่ระบบหลักอาจจะยังทำงานได้อยู่'
                }
            }
        }
    }

    // ส่วนสรุปท้ายสุดของทั้ง Pipeline
    post {
        always {
            // สั่งให้สรุปสถานะ Container ทุกครั้งไม่ว่าจะรันผ่านหรือไม่
            echo '--- สรุปสถานะ Container ล่าสุด ---'
            sh 'docker ps -a'
        }
        success {
            echo '✅ ทุกขั้นตอนเสร็จสมบูรณ์!'
        }
        failure {
            echo '🚨 Pipeline ล้มเหลว! โปรดเข้าไปดู Console Output เพื่อเช็คบรรทัดที่ Error'
        }
    }
}