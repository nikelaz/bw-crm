use sqlx::sqlite::SqlitePool;
use sqlx::Row;
use argon2::password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString};
use argon2::Argon2;

pub(crate) struct UserModel {
    pool: SqlitePool,
    argon2: Argon2<'static>,
}

impl UserModel {
    pub fn new(pool: SqlitePool) -> Self {
        UserModel {
            pool,
            argon2: Argon2::default(),
        }
    }

    fn hash_password(&self, password: &str) -> Result<String, String> {
        let salt = SaltString::generate(&mut OsRng);
        self.argon2
            .hash_password(password.as_bytes(), &salt)
            .map_err(|e| e.to_string())
            .map(|hash| hash.to_string())
    }

    fn verify_password(&self, password: &str, hash: &str) -> Result<bool, String> {
        let parsed_hash = PasswordHash::new(hash).map_err(|e| e.to_string())?;
        self.argon2
            .verify_password(password.as_bytes(), &parsed_hash)
            .map(|_| true)
            .map_err(|e| e.to_string())
    }

    pub async fn create_user(&self, username: &str, password: &str) -> Result<(), String> {
        let hashed_password = self.hash_password(password)
            .map_err(|e| format!("Failed to hash password: {}", e))?;

        let user_exists = sqlx::query("SELECT COUNT(*) FROM users WHERE username = ?")
            .bind(username)
            .fetch_one(&self.pool)
            .await
            .map_err(|e| format!("Failed to query user existence: {}", e))?
            .get::<i64, _>(0) > 0;

        if user_exists {
            return Err("User already exists".to_string());
        }

        // Insert the new user
        sqlx::query("INSERT INTO users (username, password) VALUES (?, ?)")
            .bind(username)
            .bind(hashed_password)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to create user: {}", e))?;

        Ok(())
    }

    pub async fn login(&self, username: &str, password: &str) -> Result<(), String> {
        let row = sqlx::query("SELECT password FROM users WHERE username = ?")
            .bind(username)
            .fetch_one(&self.pool)
            .await
            .map_err(|_| "Invalid username or password".to_string())?;
    
        let stored_hash: String = row.get("password");
    
        match self.verify_password(password, &stored_hash) {
            Ok(true) => Ok(()),
            _ => Err("Invalid username or password".to_string()),
        }
    }
}

