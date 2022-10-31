
all: install run-dev

install:
	npm install

build:
	npm run tauri build

run-dev:
	npm run tauri dev
