FROM node:14

# Set default exposed port and default CMD
# This rarely changes if ever
EXPOSE 3000
CMD npm start


# Install app dependencies, changes infrequently
COPY package.json ./
COPY package-lock.json  ./
RUN npm install

# Copy app code, changes frequently.
COPY .  ./
