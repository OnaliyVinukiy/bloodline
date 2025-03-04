# Use the Node.js LTS image as the base
FROM node:lts

# Set the working directory inside the container
WORKDIR /usr/src/frontend

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend code to the container
COPY . .

# Build the frontend for production
RUN npm run build

# Install a lightweight static server
RUN npm install -g serve

# Expose port 80 (Required by Azure)
EXPOSE 80

# Start the production server
CMD ["serve", "-s", "dist", "-l", "80"]
