def label = "food-app-ci"

podTemplate(label: label, serviceAccount: 'ci-jenkins', containers: [
  containerTemplate(name: 'docker', image: 'docker', command: 'cat', ttyEnabled: true),
  containerTemplate(name: 'kubectl', image: 'lachlanevenson/k8s-kubectl:v1.8.8', command: 'cat', ttyEnabled: true)
],
volumes: [
  hostPathVolume(mountPath: '/var/run/docker.sock', hostPath: '/var/run/docker.sock')
]) {
  node(label) {
    def myRepo = checkout scm
    def gitCommit = myRepo.GIT_COMMIT
    def gitBranch = myRepo.GIT_BRANCH
    def shortGitCommit = "${gitCommit[0..10]}"
    def previousGitCommit = sh(script: "git rev-parse ${gitCommit}~", returnStdout: true)

    stage('Build Server') {
      container('docker') {
        sh "docker build ./server -t registry.paul-steele.com/food-app-server:latest"
      }
    }

    stage('Build UI') {
      container('docker') {
        sh "docker build ./client -t registry.paul-steele.com/food-app-client:latest"
      }
    }

    if (gitBranch == "master" ) {
      stage('Push to Registry') {
        container('docker') {
          withDockerRegistry([credentialsId: 'docker-registry', url: "https://registry.paul-steele.com/"]) {
            sh "docker push registry.paul-steele.com/food-app-server:latest"
            sh "docker push registry.paul-steele.com/food-app-client:latest"
          }
        }
      }

      stage('Deploy') {
        container('kubectl') {
          sh "kubectl apply -f ./deployment/k8s.yaml"
        }
      }
    }
  }
}