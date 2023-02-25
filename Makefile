#!/bin/bash

APP_DIR=./src-tauri/target/release/bundle/deb
APP_NANE=randa

all: install run-dev

install:
	npm install

build:
	npm run tauri build && cp ${APP_DIR}/${APP}*.deb ./

run-dev:
	RUST_LOG=error,warn,info,debug,reqwest=off npm run tauri dev --no-watch

icon:
	npx @tauri-apps/tauricon

