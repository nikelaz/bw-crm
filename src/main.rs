pub(crate) mod user_model;

use sqlx::sqlite::SqlitePool;
use std::sync::Arc;
use user_model::UserModel;
use axum::{
    routing::{post},
    http::StatusCode,
    Json, Router,
};
use axum::extract::State;
use serde::{Deserialize, Serialize};

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
struct AppState {
    user_model: Arc<UserModel>,
}

#[tokio::main]
async fn main() {
    let pool = SqlitePool::connect("sqlite::memory:")
        .await
        .unwrap();

    println!("Database Connected");

    seed_database(&pool).await.unwrap();

    let state = AppState {
        user_model: Arc::new(UserModel::new(pool.clone())),
    };

    state.user_model.create_user("admin", "123qwerty").await.unwrap();

    match state.user_model.login("admin", "123qwerty").await {
        Ok(_) => println!("Login successful"),
        Err(e) => println!("Login failed: {}", e),
    }

    let router = Router::new()
        .route("/api/v1/users/login", post(login))
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();

    axum::serve(listener, router).await.unwrap();

    pool.close().await;
}

#[derive(Deserialize)]
struct PayloadLogin {
    username: String,
    password: String,
}

#[derive(Serialize)]
struct PayloadResponse {
    message: String,
}

async fn login(State(state): State<AppState>, Json(payload): Json<PayloadLogin>) -> (StatusCode, Json<PayloadResponse>) {
    let response_message: String;

    match state.user_model.login(payload.username.as_str(), payload.password.as_str()).await {
        Ok(_) => response_message = "Login successful".to_string(),
        Err(e) => response_message = format!("Login failed: {}", e),
    }

    (StatusCode::CREATED, Json(PayloadResponse { message: response_message }))
}

/* This is how you query rows 
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
*/
