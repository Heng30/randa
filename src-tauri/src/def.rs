use ::log::debug;
use serde_derive::{Deserialize, Serialize};
use std::string::ToString;

pub const APP_NAME: &str = "randa";

#[derive(Serialize, Deserialize, Debug)]
pub struct B2FRes {
    pub code: i32,
    pub msg: String,
}

impl ToString for B2FRes {
    fn to_string(&self) -> String {
        match serde_json::to_string(&self) {
            Ok(text) => text,
            Err(e) => {
                let msg = format!("{:?}", e);
                debug!("{}", msg);
                format!("{}code: -1, msg: \"{}\"{}", "{", "}", &msg)
            }
        }
    }
}
