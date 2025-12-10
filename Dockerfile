# Multi-stage build for production
FROM node:20-alpine

WORKDIR /app

# Install git
RUN apk add --no-cache git

# Clone the repository
RUN git clone https://github.com/edwardtakev/BB-19

# Install dependencies
RUN npm ci --only=production

# Production stage
FROM node:20-alpine

WORKDIR /BB19

# Set environment to production
ENV NODE_ENV=production

# Health check (optional, for docker-compose)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "console.log('alive')" || exit 1

# Start the bot
CMD ["node", "index.js"]
