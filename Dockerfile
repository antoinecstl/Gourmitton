FROM node:20-alpine
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Clone the repository, install dependencies & build the Next.js application
RUN git clone https://github.com/antoinecstl/Gourmitton.git .
WORKDIR /app/gourmitton
RUN npm ci
RUN npm run build

# Open the port 3000 & start the application
EXPOSE 3000
CMD ["npm", "start"]
