// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

/// Windows 11+: Mica; older Windows 10: Acrylic (Tauri has no Linux window backdrop API).
#[cfg(windows)]
fn apply_windows_native_backdrop(app: &tauri::AppHandle) -> tauri::Result<()> {
    use tauri::Manager;
    use tauri::utils::config::WindowEffectsConfig;
    use tauri::window::Effect;
    use windows_version::OsVersion;

    let Some(window) = app.get_webview_window("main") else {
        return Ok(());
    };

    let build = OsVersion::current().build;
    let config = if build >= 22_000 {
        WindowEffectsConfig {
            effects: vec![Effect::Mica],
            ..Default::default()
        }
    } else {
        WindowEffectsConfig {
            effects: vec![Effect::Acrylic],
            ..Default::default()
        }
    };

    window.set_effects(Some(config))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            #[cfg(windows)]
            apply_windows_native_backdrop(app.handle())?;
            #[cfg(not(windows))]
            let _ = app;
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
