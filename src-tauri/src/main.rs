#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use base64;
use image::io::Reader as ImageReader;
use image::{self, GenericImageView, ImageFormat};
use std::io::Cursor;

use tauri::Manager;
use window_vibrancy::{apply_vibrancy, NSVisualEffectMaterial};

#[tauri::command(rename_all = "snake_case")]
fn downscale_img(img_file_path: String) -> String {
    // Load the image from the file path
    let img = match ImageReader::open(img_file_path) {
        Ok(reader) => reader.decode().unwrap(),
        Err(e) => {
            println!("Error: {}", e);
            return "err".to_string();
        }
    };

    // downscale the image to a max height of 150px; maintain aspect ratio
    let (width, height) = img.dimensions();
    let new_height = 150; // hard-coded for now
    let new_width = (width as f32 * (new_height as f32 / height as f32)) as u32;
    let img = img.resize_exact(new_width, new_height, image::imageops::FilterType::Lanczos3);

    // Encode the image as a JPEG and return the result as a base64-encoded string
    let mut buffer = Cursor::new(Vec::new());
    img.write_to(&mut buffer, ImageFormat::Jpeg).unwrap();
    base64::encode(&buffer.into_inner())
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            #[cfg(target_os = "macos")]
            apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, Some(16.0))
                .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![downscale_img])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
