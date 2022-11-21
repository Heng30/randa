use crate::def;
use crate::def::B2FRes;
use ::log::debug;
use platform_dirs::AppDirs;
use std::fs;

#[tauri::command]
pub fn write_file(filepath: &str, text: &str) -> String {
    match fs::write(filepath, text) {
        Ok(_) => {
            let res = B2FRes {
                code: 0,
                msg: filepath.to_string(),
            };

            res.to_string()
        }
        Err(e) => {
            let msg = format!("save {:?} failed. reason: {:?}", filepath, e);
            debug!("{:?}", &msg);
            let res = B2FRes { code: -1, msg };

            res.to_string()
        }
    }
}

#[tauri::command]
pub fn write_file_2_tmp(filename: &str, text: &str) -> String {
    let app_dirs = AppDirs::new(Some(def::APP_NAME), true).unwrap();
    let filepath = app_dirs.data_dir.join("tmp").join(filename).to_str().unwrap().to_string();
    write_file(&filepath, text)
}

#[tauri::command]
pub fn config_dir() -> String {
    let app_dirs = AppDirs::new(Some(def::APP_NAME), true).unwrap();
    app_dirs.config_dir.to_str().unwrap().to_string()
}

#[tauri::command]
pub fn data_dir() -> String {
    let app_dirs = AppDirs::new(Some(def::APP_NAME), true).unwrap();
    app_dirs.data_dir.to_str().unwrap().to_string()
}


#[tauri::command]
pub fn rlog(text: &str) {
    debug!("{}", text);
}
