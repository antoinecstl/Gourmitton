#!/bin/bash

REPO="nonouille/lambda-archi-web"
VERSION="v$1"  # Pass version number as argument

echo "Building image $REPO:$VERSION and tagging as latest..."
docker build -t $REPO:$VERSION .
docker tag $REPO:$VERSION $REPO:latest

echo "Pushing two tags..."
docker push $REPO:$VERSION
docker push $REPO:latest

echo "Done! $REPO:$VERSION is now the latest version."