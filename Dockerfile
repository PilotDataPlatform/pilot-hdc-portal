FROM node:23-slim AS build-environment

WORKDIR /portal/src

COPY package.json ./
COPY package-lock.json  ./

RUN npm install

COPY public  ./public
COPY src  ./src
COPY craco.config.js  ./
COPY .env ./

# Make sure that the `.env` file is present before running the `build` command.
RUN test -s .env || (echo "Error! .env file is missing or empty." && exit 1)
RUN npm run build
RUN mv ./build/ /portal/build
RUN rm -rf /portal/src


FROM nginx:1.27.3 AS portal-image

COPY --from=build-environment --chmod=755 /portal/build /etc/nginx/html

COPY portal.conf /etc/nginx/conf.d/
