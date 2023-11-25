# Stage 1: Build Stage
FROM node:18 AS build

WORKDIR /tmp

# Download go-passbolt-cli
RUN apt update && apt install wget 
RUN wget https://github.com/passbolt/go-passbolt-cli/releases/download/v0.3.0/go-passbolt-cli_0.3.0_linux_amd64.deb 

WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the TypeScript application
RUN npm run compile

# Stage 2: Production Stage
FROM node:18-bullseye AS production

WORKDIR /tmp

# Install go-passbolt-cli
COPY --from=build /tmp/go-passbolt-cli_0.3.0_linux_amd64.deb  ./go-passbolt-cli_0.3.0_linux_amd64.deb 
RUN apt install ./go-passbolt-cli_0.3.0_linux_amd64.deb 

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install 

# Copy the built application from the build stage
COPY --from=build /app/build ./build

# Run the application
CMD ["npm", "run", "start:prod"]
