#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

// fn

fn main() {
    // let menu = Menu::new();
    // // here `"quit".to_string()` defines the menu item id, and the second parameter is the menu item label.
    // let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    // let close = CustomMenuItem::new("close".to_string(), "Close");
    // let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
    // let menu = Menu::new()
    //     .add_native_item(MenuItem::Copy)
    //     .add_item(CustomMenuItem::new("hide", "Hide"))
    //     .add_submenu(submenu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        // .menu(menu)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
