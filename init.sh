#!/bin/bash

echo "🚀 Starting React Native project setup..."

# 1. Verificar Node.js
if ! command -v node &> /dev/null; then
  echo "❌ Node.js is not installed. Please install it before continuing."
  exit 1
fi


chmod +x scripts/*.js 2>/dev/null
chmod +x .husky/* 2>/dev/null

echo "📂 Creating base structure..."
node scripts/createStructure.js

ENV_FILE=".env"
if [ ! -f "$ENV_FILE" ]; then
  echo "🧾 Creating .env file..."
  cat <<EOF > "$ENV_FILE"
NODE_ENV=development
API_URL_PROD=https://api.produccion.com
API_URL_DEV=https://api.desarrollo.com
API_TOKEN=tu_token_secreto
EOF
else
  echo "📄 .env file already exists. Skipping creation."
fi

echo "📦 Installing dependencies..."
npm install --no-audit

echo "🧹 Running lint and format..."
npm run lint:fix && npm run format

echo "✅ React Native project successfully initialized 🎉"
echo "📦 All dependencies installed"
echo "🔧 ESLint, Prettier, Husky, and Commitizen configured"
echo "🚀 To start the development server, run: npm run start"