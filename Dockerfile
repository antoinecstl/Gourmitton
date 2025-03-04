# Use Node.js LTS as base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install git and other dependencies
RUN apk add --no-cache git

# Clone the repository
RUN git clone https://github.com/antoinecstl/Gourmitton.git .
WORKDIR /app/gourmitton

# Install dependencies
RUN npm install

# Build the Next.js application
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
