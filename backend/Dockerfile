# Use the Node.js LTS image as the base
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/backend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies (including dev dependencies if needed)
RUN npm install --omit=dev

# Copy the rest of the backend code to the container
COPY . .

# Expose the port
EXPOSE 5000

# Set the environment variable
ENV PORT=5000

# Start the server using Node.js (not nodemon)
CMD ["node", "index.js"]
