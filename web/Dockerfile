# Use the official Node.js image
FROM node:18 AS build
WORKDIR /app

# Copy package.json and package-lock.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files and build the application
COPY . ./
RUN npm run build

# Use a lightweight web server for serving the built application
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY --from=build /app/out .

# Expose the port the application runs on
EXPOSE 3000
