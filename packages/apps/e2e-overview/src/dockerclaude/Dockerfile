FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache git curl bash apt-get

# Install Claude CLI
RUN npm install -g @anthropic-ai/claude-code@latest

# Install Playwright browsers
RUN npx playwright install --with-deps

# Copy Claude configuration
COPY claude-config.json /.claude/settings.json

# Set working directory
WORKDIR /app

# Default command
# CMD bash -c "claude --output-format json '${CLAUDE_PROMPT:-Navigate to https://straatemans.nl and get the main content}'"