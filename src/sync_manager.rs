use sqlx::{PgPool, SqlitePool};
use sqlx::Row;
use crate::client_model::Client;
use std::error::Error;

pub struct SyncManager {
    pg_pool: PgPool,
    sqlite_pool: SqlitePool,
}

impl SyncManager {
    pub fn new(pg_pool: PgPool, sqlite_pool: SqlitePool) -> Self {
        SyncManager {
            pg_pool,
            sqlite_pool,
        }
    }

    pub async fn sync_clients(&self) -> Result<(), Box<dyn Error>> {
        println!("Synchronizing Clients");

        let rows = sqlx::query("SELECT * FROM \"user\"")
            .fetch_all(&self.pg_pool)
            .await
            .map_err(|e| format!("Failed to fetch users: {}", e))?;

        let clients: Vec<Client> = rows
            .into_iter()
            .map(|row| Client {
                id: row.get("id"),
                email: row.get("email"),
                first_name: row.get("firstName"),
                last_name: row.get("lastName"),
                country: row.get("country"),
                currency: row.get("currency"),
                notes: None,
                do_not_message: None,
            })
            .collect();

        for client in &clients {
            sqlx::query(
                r#"
                    INSERT INTO clients (
                        id,
                        email,
                        first_name,
                        last_name,
                        country,
                        currency
                    )
                    VALUES ($1, $2, $3, $4, $5, $6)
                    ON CONFLICT (id) DO NOTHING
                "#
            )
                .bind(client.id)
                .bind(&client.email)
                .bind(&client.first_name)
                .bind(&client.last_name)
                .bind(&client.country)
                .bind(&client.currency)
                .execute(&self.sqlite_pool)
                .await
                .map_err(|e| {
                    format!(
                        "Failed to insert client {}: {}",
                        client.email, e
                    )
                })?;        
        }

        Ok(())
    }
}
