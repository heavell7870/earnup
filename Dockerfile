# Here we are getting our node as Base image
FROM node:20-alpine

# setting working directory in the container
WORKDIR /user/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# container exposed network port number
EXPOSE 8080

# command to run within the container
CMD [ "npm", "start" ]