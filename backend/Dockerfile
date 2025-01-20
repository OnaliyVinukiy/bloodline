# Use the Node.js LTS image as the base
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/backend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Rebuild bcrypt for compatibility
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the backend code to the container
COPY . .

# Expose the port for the backend server
EXPOSE 4000

# Start the development server
CMD ["npm", "run", "dev"]