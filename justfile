set shell := ["bash", "-cu"]
set dotenv-load := true

default:
    just --list

setup-env:
    @if [ ! -f .env ]; then \
    	cp .env.sample .env; \
    	echo "Created .env from .env.sample"; \
    	echo "Please review and update the values in .env as needed"; \
    else \
    	echo ".env already exists, skipping setup"; \
    fi

install:
    npm install

check:
    npm run check

test:
    npm run test

dev:
    npm run dev

build:
    npm run build
