set -e

# validate that user was passed as parameter
if [ -z "$1" ]; then
    echo "Please provide your docker registry username as a parameter."
    exit 1
fi 

# make sure the git branch is hdc-prod and is up-to-date
git checkout hdc-prod
git pull origin hdc-prod

# exit with error if there are conflicts
if [[ $(git ls-files -u) ]]; then
    echo "There are merge conflicts. Please resolve them before continuing."
    exit 1
fi

# get the short SHA of the latest commit (7 chars)
COMMIT_SHA=$(git log --pretty=format:%h -n 1 | cut -c 1-7)

# Set necessary variables
DOCKER_TAG=docker-registry.ebrains.eu/hdc-services-image/portal:portal-hdc-prod-$COMMIT_SHA
USER=$1

# login to the registry
docker login -u $USER docker-registry.ebrains.eu

# Build and push docker image
docker build --tag $DOCKER_TAG .
docker push $DOCKER_TAG
