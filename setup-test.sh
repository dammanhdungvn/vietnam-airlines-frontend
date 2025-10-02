#!/bin/bash

# Script setup môi trường test cho Vietnam Airlines Frontend
# Author: Dũng Đàm
# Date: 2025-10-02

echo "🚀 Vietnam Airlines Frontend - Test Setup"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"

# Step 2: Install Playwright browsers
echo -e "${BLUE}🎭 Installing Playwright browsers...${NC}"
npx playwright install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install Playwright browsers${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Playwright browsers installed${NC}"

# Step 3: Create .env.local if not exists
if [ ! -f .env.local ]; then
    echo -e "${BLUE}📝 Creating .env.local...${NC}"
    cat > .env.local << 'ENVFILE'
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080

# Cookie Encryption
NEXT_PUBLIC_COOKIE_SECRET=VNA-Secret-Key-2025-Development

# Testing
PLAYWRIGHT_BASE_URL=http://localhost:3000
ENVFILE
    echo -e "${GREEN}✅ .env.local created${NC}"
else
    echo -e "${BLUE}ℹ️  .env.local already exists${NC}"
fi

# Step 4: Run tests
echo -e "${BLUE}🧪 Running tests...${NC}"
echo ""
echo "Available test commands:"
echo "  npm run test:unit        - Run unit tests"
echo "  npm run test:e2e         - Run E2E tests (headless)"
echo "  npm run test:e2e:ui      - Run E2E tests (UI mode)"
echo "  npm run test:all         - Run all tests"
echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "To start development:"
echo "  npm run dev"
echo ""
echo "To run Playwright tests:"
echo "  npm run test:e2e:ui"

