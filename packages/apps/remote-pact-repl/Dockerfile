# Use the official bun image as the base image
FROM node:18.17.0

# Set the PATH environment variable to include the Pact binary
ENV PATH="/home/bun/app/pact-bin:${PATH}"

# Install pnpm
RUN npm install -g pnpm

# Set the working directory to /app
WORKDIR /app

# copy pact binaries
COPY ./pact-bin ./pact-bin

# copy package.json and lockfile
COPY package.json ./

# Install dependencies
RUN pnpm install

# copy source code
COPY ./src ./src
COPY ./tsconfig.json ./tsconfig.json

RUN pnpm run build:app

EXPOSE 3000

# Start the application
CMD ["node", "./lib/server.js"]
