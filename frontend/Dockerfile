# Use the Node.js LTS image as the base
FROM node:alpine

# Set the working directory inside the container
WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code to the container
COPY . .

# Expose the port for the frontend development server
EXPOSE 80

# Start the development server
CMD ["npm", "run", "dev"]