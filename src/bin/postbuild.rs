use std::fs;
use std::io;
use std::path::Path;

fn copy_dir_recursive(src: &Path, dst: &Path) -> io::Result<()> {
    if !dst.exists() {
        fs::create_dir_all(dst)?;
    }

    for entry in fs::read_dir(src)? {
        let entry = entry?;
        let path = entry.path();
        let dest_path = dst.join(entry.file_name());

        if path.is_dir() {
            copy_dir_recursive(&path, &dest_path)?;
        } else {
            fs::copy(&path, &dest_path)?;
        }
    }

    Ok(())
}

fn main() {
    println!("running postbuild script");

    println!("copying web directory");
    copy_dir_recursive(Path::new("web"), Path::new("target/release/web"))
        .expect("Failed to copy web directory");
}
