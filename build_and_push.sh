set -e

HDC_BRANCH="hdc"

# make sure the git branch is $ENVIRONMENT and is up-to-date
git checkout $HDC_BRANCH
git pull origin $HDC_BRANCH

# exit with error if there are conflicts
if [[ $(git ls-files -u) ]]; then
    echo "There are merge conflicts. Please resolve them before continuing."
    exit 1
fi

# get current version from package.json
VERSION=$(jq -r '.version' package.json)
echo $VERSION

# validate that portal version was passed as parameter
if [ -z "$VERSION" ]; then
    echo "Please provide the portal version to use."
    exit 1
fi 

# Set necessary variables
DOCKER_TAG=docker-registry.ebrains.eu/hdc-services-image/portal:$VERSION

# Build and push docker image
docker build --tag $DOCKER_TAG --platform=linux/amd64 .

docker push $DOCKER_TAG
