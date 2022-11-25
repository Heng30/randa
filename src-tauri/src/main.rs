#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use chrono::Local;
use env_logger::fmt::Color as LColor;
use log::{debug, warn};
use platform_dirs::AppDirs;
use std::fs;
use std::io::Write;
use tauri;
use tauri_plugin_sqlite;
use tokio;

mod def;
mod utils;

#[tokio::main]
async fn main() {
    init_logger();
    init_app_dir();
    debug!("start...");

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![utils::rlog])
        .invoke_handler(tauri::generate_handler![utils::config_dir])
        .invoke_handler(tauri::generate_handler![utils::data_dir])
        .invoke_handler(tauri::generate_handler![utils::write_file])
        .invoke_handler(tauri::generate_handler![utils::write_file_2_tmp])
        .plugin(tauri_plugin_sqlite::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    debug!("exit...");
}

fn init_logger() {
    env_logger::builder()
        .format(|buf, record| {
            let ts = format!("{}", Local::now().format("%Y-%m-%d %H:%M:%S").to_string());
            let mut level_style = buf.style();
            match record.level() {
                log::Level::Warn | log::Level::Error => {
                    level_style.set_color(LColor::Red).set_bold(true)
                }
                _ => level_style.set_color(LColor::Blue).set_bold(true),
            };

            writeln!(
                buf,
                "[{} {} {} {}] {}",
                ts,
                level_style.value(record.level()),
                record
                    .file()
                    .unwrap_or("None")
                    .split('/')
                    .last()
                    .unwrap_or("None"),
                record.line().unwrap_or(0),
                record.args()
            )
        })
        .init();
}

fn init_app_dir() {
    let app_dirs = AppDirs::new(Some(def::APP_NAME), true).unwrap();

    if let Err(e) = fs::create_dir_all(&app_dirs.config_dir) {
        warn!("create {:?} failed! reason: {:?}", &app_dirs.config_dir, e);
    }

    if let Err(e) = fs::create_dir_all(&app_dirs.data_dir) {
        warn!("create {:?} failed! reason: {:?}", &app_dirs.data_dir, e);
    }

    if let Err(e) = fs::create_dir_all(app_dirs.data_dir.join("tmp")) {
        warn!("{:?}", e);
    }
}
