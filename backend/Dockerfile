FROM node:lts

# Set working directory
WORKDIR /usr/src/backend

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose your app's port
EXPOSE 5000

# Set environment variable
ENV PORT=5000
ENV ASGARDEO_TENANT=onaliy

# Run the compiled JavaScript
CMD ["node", "dist/index.js"]
