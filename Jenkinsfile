pipeline {
    agent any
    environment {
        PROJECT_ID = 'ninja-gcp-277418'
        CLUSTER_NAME = 'kubecluster'
        LOCATION = 'europe-west2-c'
        CREDENTIALS_ID = 'gke'
          }
    stages {
        stage("Checkout code") {
            steps {
                checkout scm
            }
        }
        stage("Build image") {
            steps {
                script {
                    myapp = docker.build("rajni03/ninjaappgcp")
                }
            }
        }
        stage("Push image") {
            steps {
                script {
                    docker.withRegistry('https://registry.hub.docker.com', 'dockerhub') {
                            myapp.push("latest")

                    }
                }
            }
        }
        stage('Deploy to GKE') {
            steps{
                step([$class: 'KubernetesEngineBuilder', projectId: env.PROJECT_ID, clusterName: env.CLUSTER_NAME, location: env.LOCATION, manifestPattern: 'deployment.yaml', credentialsId: env.CREDENTIALS_ID, verifyDeployments: true])
            }
        }
    }
}
