pub(crate) mod user_model;

use sqlx::sqlite::SqlitePool;
use sqlx::Row;
use user_model::UserModel;

async fn seed_database(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    // Create the users table
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )"
    )
        .execute(pool)
        .await?;

    Ok(())
}

#[tokio::main]
async fn main() {
    let pool = SqlitePool::connect("sqlite::memory:")
        .await
        .unwrap();

    println!("Database Connected");

    seed_database(&pool).await.unwrap();

    let user_model = UserModel::new(&pool);

    user_model.create_user("admin", "123qwerty").await.unwrap();

    match user_model.login("admin", "123qwerty").await {
        Ok(_) => println!("Login successful"),
        Err(e) => println!("Login failed: {}", e),
    }
   
    let rows = sqlx::query("SELECT id, username, password FROM users")
        .fetch_all(&pool)
        .await
        .unwrap();

    for row in rows {
        let id: i64 = row.get("id");
        let username: String = row.get("username");
        let password: String = row.get("password");
        println!("id: {}, username: {}, password: {}", id, username, password);
    }

    pool.close().await;
}
