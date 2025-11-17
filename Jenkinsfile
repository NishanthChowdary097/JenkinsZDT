pipeline {
    agent any

    environment {
        APP_NAME = "my-app"
        DEPLOY_ENV = "staging"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/NishanthChowdary097/JenkinsZDT.git'
            }
        }

        stage('Build') {
            steps {
                echo "Building the Frontend"
                sh 'docker-compose build '
            }
        }

        // stage('Test') {
        //     steps {
        //         echo "Running tests..."
        //         sh './gradlew test'
        //     }
        //     post {
        //         always {
        //             junit 'build/test-results/**/*.xml'  // Publish test reports
        //         }
        //     }
        // }

        // stage('Package') {
        //     steps {
        //         echo "Packaging application..."
        //         sh 'tar -czf ${APP_NAME}.tar.gz build/libs/*.jar'
        //     }
        // }

        // stage('Deploy') {
        //     when {
        //         branch 'main'  // Only deploy from the main branch
        //     }
        //     steps {
        //         echo "Deploying ${APP_NAME} to ${DEPLOY_ENV} environment..."
        //         sh './scripts/deploy.sh ${DEPLOY_ENV}'
        //     }
        // }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
    }
}
