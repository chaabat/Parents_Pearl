pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'parentpearl'
        DOCKER_DB = 'parentpearl-db'
        MAVEN_OPTS = '-Dmaven.compiler.verbose=true'
    }

    tools {
        maven 'maven-3.9'
        jdk 'JDK17'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Clean Workspace') {
            steps {
                dir('backend') {
                    sh 'mvn clean'
                }
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh '''
                        mvn -X clean package -DskipTests \
                            -Dmapstruct.verbose=true \
                            -Dmaven.compiler.verbose=true
                    '''
                }
            }
        }

        stage('Docker Build & Deploy') {
            steps {
                dir('backend') {
                    script {
                        // Stop existing containers
                        sh 'docker-compose down || true'
                        
                        // Remove old images
                        sh "docker rmi ${DOCKER_IMAGE} || true"
                        sh "docker rmi ${DOCKER_DB} || true"
                        
                        // Build and start new containers
                        sh 'docker-compose build'
                        sh 'docker-compose up -d'
                    }
                }
            }
        }

        stage('Health Check') {
            steps {
                script {
                    sh 'sleep 30'
                    sh 'docker ps | grep parentpearl'
                    sh 'docker ps | grep parentpearl-db'
                }
            }
        }
    }

    post {
        success {
            echo 'Backend deployment successful!'
        }
        failure {
            echo 'Backend deployment failed!'
            sh 'cd backend && docker-compose down || true'
        }
        always {
            cleanWs()
        }
    }
} 