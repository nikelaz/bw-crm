pub(crate) mod users_controller;
pub(crate) mod user_model;

use sqlx::sqlite::SqlitePool;
use std::sync::Arc;
use axum::routing::post;
use axum::Router;
use user_model::UserModel;
use users_controller::login;

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

#[derive(Clone)]
pub(crate) struct AppState {
    user_model: Arc<UserModel>,
}

#[tokio::main]
async fn main() {
    let pool = match SqlitePool::connect("sqlite::memory:").await {
        Ok(pool) => pool,
        Err(e) => {
            eprintln!("Failed to connect to the database: {}", e);
            return;
        },
    };

    println!("Database Connected");

    if let Err(e) = seed_database(&pool).await {
        eprintln!("Failed to seed database: {}", e);
        return;
    }

    let state = AppState {
        user_model: Arc::new(UserModel::new(pool.clone())),
    };

    println!("Database Seeded (if needed)");

    if let Err(e) = state.user_model.create_user("admin", "123qwerty").await {
        eprintln!("Failed to create admin user: {}", e);
        return;
    }

    println!("Admin user created (if needed)");

    let router = Router::new()
        .route("/api/v1/users/login", post(login))
        .with_state(state);

    let listener = match tokio::net::TcpListener::bind("0.0.0.0:3000").await {
        Ok(listener) => listener,
        Err(e) => {
            eprintln!("Failed to bind to address: {}", e);
            return;
        },
    };

    axum::serve(listener, router).await.unwrap();

    pool.close().await;
}
