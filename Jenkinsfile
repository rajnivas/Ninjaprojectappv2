pipeline {
    agent any
    environment {
        PROJECT_ID = 'elk-ninja-gcp'
        CLUSTER_NAME = 'kubecluster'
        LOCATION = 'europe-west4-c'
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
                    myapp = docker.build("rajni03/ninjaappgcpv2")
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
