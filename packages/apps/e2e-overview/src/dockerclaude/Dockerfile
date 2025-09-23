FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache git bash

# Install Claude Code globally
RUN npm install -g @anthropic-ai/claude-code

# Set working directory
WORKDIR /app

# Expose any necessary ports if needed (e.g., for MCP server communication)
EXPOSE 3100

# Default command (can be overridden)
CMD ["claude", "--help"]