pub(crate) mod user_model;
pub(crate) mod client_model;
pub(crate) mod user_controller;
pub(crate) mod client_controller;
pub(crate) mod sync_manager;

use sqlx::sqlite::SqlitePool;
use sqlx::PgPool;
use std::sync::Arc;
use axum::routing::{get, post};
use axum::Router;
use tower_http::services::ServeDir;
use std::env;
use dotenv::dotenv;
use user_model::UserModel;
use client_model::ClientModel;
use user_controller::{login, verify_token};
use client_controller::{get_clients, get_client, update_client};
use sync_manager::SyncManager;

async fn seed_database(pool: &SqlitePool) -> Result<(), sqlx::Error> {
    sqlx::query(
        "CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            username TEXT NOT NULL,
            password TEXT NOT NULL
        )"
    )
        .execute(pool)
        .await?;

    sqlx::query(
        "CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY,
            email TEXT NOT NULL,
            first_name TEXT,
            last_name TEXT,
            country TEXT,
            currency TEXT,
            notes TEXT,
            do_not_message INTEGER NOT NULL DEFAULT 0,
            created TEXT,
            last_activity_date TEXT
        )"
    )
        .execute(pool)
        .await?;

    Ok(())
}

#[derive(Clone)]
pub(crate) struct AppState {
    user_model: Arc<UserModel>,
    client_model: Arc<ClientModel>,
    jwt_secret: String,
}

#[tokio::main]
async fn main() {
    println!("BW CRM");

    dotenv().ok();

    let port = env::var("PORT")
        .expect("PORT environment variable");
    let jwt_secret = env::var("JWT_SECRET")
        .expect("JWT_SECRET environment variable");
    let postgres_url = env::var("POSTGRES_URL")
        .expect("POSTGRES_URL environment variable");
    let admin_username = env::var("ADMIN_USERNAME")
        .expect("ADMIN_USERNAME environment variable");
    let admin_password = env::var("ADMIN_PASSWORD")
        .expect("ADMIN_PASSWORD environment variable");

    println!(
        "Environment Variables Loaded \n PORT: {} \n ADMIN_USERNAME: {}",
        port,
        admin_username
    );

    let sqlite_pool = match SqlitePool::connect("sqlite://crm.db").await {
        Ok(pool) => pool,
        Err(e) => {
            eprintln!("Failed to connect to the SQLite database: {}", e);
            return;
        },
    };

    let pg_pool = match PgPool::connect(postgres_url.as_str()).await {
        Ok(pool) => pool,
        Err(e) => {
            eprintln!("Failed to connect to the Postgres database: {}", e);
            return;
        },
    };

    println!("Database Connected");

    if let Err(e) = seed_database(&sqlite_pool).await {
        eprintln!("Failed to seed database: {}", e);
        return;
    }

    let sync_manager = SyncManager::new(pg_pool.clone(), sqlite_pool.clone()); 


    if let Err(e) = sync_manager.sync_clients().await {
        eprintln!("Failed to sync clients: {}", e);
        return;
    }

    let state = AppState {
        user_model: Arc::new(UserModel::new(sqlite_pool.clone())),
        client_model: Arc::new(ClientModel::new(sqlite_pool.clone())),
        jwt_secret,
    };

    println!("Database Seeded (if needed)");

    if let Err(e) = state.user_model.create_user(admin_username.as_str(), admin_password.as_str()).await {
        eprintln!("Failed to create admin user: {}", e);
    }

    println!("Admin user created (if needed)");

    let router = Router::new()
        .route("/api/v1/clients", get(get_clients))
        .route("/api/v1/clients/{id}", get(get_client).put(update_client))
        .route("/api/v1/users/login", post(login))
        .route("/api/v1/users/verify", post(verify_token))
        .fallback_service(ServeDir::new("web"))
        .with_state(state);

    let listener = match tokio::net::TcpListener::bind(format!("0.0.0.0:{}", port)).await {
        Ok(listener) => listener,
        Err(e) => {
            eprintln!("Failed to bind to address: {}", e);
            return;
        },
    };

    axum::serve(listener, router).await.unwrap();

    sqlite_pool.close().await;
    pg_pool.close().await;
}
