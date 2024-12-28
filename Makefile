.PHONY: install dev

install:
	@echo "Installing dependencies..."
	@npm install --legacy-peer-deps

dev:
	@echo "Starting development server on port 3000..."
	@npm run dev

# 默认目标改为 dev
.DEFAULT_GOAL := dev 