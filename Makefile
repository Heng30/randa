
all: install run-dev

install:
	npm install

build:
	npm run tauri build

run-dev:
	RUST_LOG=error,warn,info,debug,reqwest=off npm run tauri dev --no-watch
