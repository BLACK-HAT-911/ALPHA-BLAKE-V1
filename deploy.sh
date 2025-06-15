#!/bin/bash

echo "🚀 Deploying ALPHA-BLAKE-V1 WhatsApp Bot..."

# Step 1: Install Node.js modules
echo "📦 Installing dependencies..."
npm install

# Step 2: Export environment variables (Optional for local use only)
export OWNER_NAME="JADEN"
export BOT_NAME="ALPHA-BLAKE-V1"
export CHANNEL_LINK="https://whatsapp.com/channel/0029Vb5a5G4IHphKUhO9hx0d"

# Step 3: Start the bot
echo "✅ Starting bot..."
node index.js