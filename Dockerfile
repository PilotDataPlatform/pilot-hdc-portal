FROM node:16

RUN addgroup --system app && \
    useradd --gid app --system --shell /bin/bash --create-home app

WORKDIR /portal

RUN chown -R app:app /portal

USER app

# Set default exposed port and default CMD
# This rarely changes if ever
EXPOSE 3000
CMD npm run start:serve


# Install app dependencies, changes infrequently
USER root

COPY package.json ./
COPY package-lock.json  ./

RUN chown app:app /portal/package.json /portal/package-lock.json

USER app

RUN npm install

# Copy app code, changes frequently.
USER root

COPY .  ./

# Verify that the `.env` file was copied to the docker image
RUN test -s .env || (echo "Error! .env file is missing or empty" && exit 1)

RUN chown -R app:app /portal

USER app

RUN npm run build
