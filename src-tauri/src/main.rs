
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::path::PathBuf;
use std::fs;

#[tauri::command]
async fn clean_browser_cache(browser: &str) -> Result<(), String> {
    let local_app_data = std::env::var("LOCALAPPDATA").map_err(|e| e.to_string())?;
    let user_profile = std::env::var("USERPROFILE").map_err(|e| e.to_string())?;

    match browser.to_lowercase().as_str() {
        "chrome" => {
            let chrome_cache = PathBuf::from(&local_app_data)
                .join("Google")
                .join("Chrome")
                .join("User Data")
                .join("Default")
                .join("Cache");
            if chrome_cache.exists() {
                fs::remove_dir_all(&chrome_cache).map_err(|e| e.to_string())?;
            }
        }
        "firefox" => {
            let firefox_profile = PathBuf::from(&user_profile)
                .join("AppData")
                .join("Local")
                .join("Mozilla")
                .join("Firefox")
                .join("Profiles");
            if firefox_profile.exists() {
                for entry in fs::read_dir(firefox_profile).map_err(|e| e.to_string())? {
                    let entry = entry.map_err(|e| e.to_string())?;
                    let cache_path = entry.path().join("cache2");
                    if cache_path.exists() {
                        fs::remove_dir_all(&cache_path).map_err(|e| e.to_string())?;
                    }
                }
            }
        }
        "edge" => {
            let edge_cache = PathBuf::from(&local_app_data)
                .join("Microsoft")
                .join("Edge")
                .join("User Data")
                .join("Default")
                .join("Cache");
            if edge_cache.exists() {
                fs::remove_dir_all(&edge_cache).map_err(|e| e.to_string())?;
            }
        }
        _ => return Err("Navigateur non supporté".to_string()),
    }

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![clean_browser_cache])
        .run(tauri::generate_context!())
        .expect("Erreur lors du lancement de l'application");
}
