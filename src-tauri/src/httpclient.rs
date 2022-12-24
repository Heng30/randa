use ::log::debug;
use reqwest;
use reqwest::header::HeaderMap;
use std::time::Duration;

pub fn common_headers() -> HeaderMap {
    let mut headers = HeaderMap::new();
    headers.insert(
        "Accept",
        "application/json, text/plain, */*".parse().unwrap(),
    );
    headers.insert("user-agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.5060.134 Safari/537.36".parse().unwrap());
    headers
}

pub fn http_get(url: &str, headers: HeaderMap) -> Result<String, Box<dyn std::error::Error>> {
    let res = reqwest::blocking::Client::new()
        .get(url)
        .headers(headers)
        .timeout(Duration::new(15, 0))
        .send()?
        .text()?;
    return Ok(res);
}

#[tauri::command]
pub fn http_client_get(url: &str) -> String {
    let headers = common_headers();
    match http_get(url, headers) {
        Ok(res) => {
            return res;
        }
        Err(e) => {
            debug!("{:?}", e);
            return "".to_string();
        }
    }
}
