use sqlx::SqlitePool;
use sqlx::Row;
use serde::Serialize;

pub(crate) struct ClientModel {
    pool: SqlitePool,
}

#[derive(Serialize)]
pub(crate) struct Client {
    pub id: i32,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub country: Option<String>,
    pub currency: String,
    pub notes: Option<String>,
    pub do_not_message: Option<u32>,
}

impl ClientModel {
    pub fn new(pool: SqlitePool) -> Self {
        ClientModel { pool }
    }

    pub async fn get_clients(&self) -> Result<Vec<Client>, String> {
        let rows = sqlx::query("SELECT * FROM \"clients\"")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| format!("Failed to fetch clients: {}", e))?;

        let clients: Vec<Client> = rows
            .into_iter()
            .map(|row| Client {
                id: row.get("id"),
                email: row.get("email"),
                first_name: row.get("first_name"),
                last_name: row.get("last_name"),
                country: row.get("country"),
                currency: row.get("currency"),
                notes: row.get("notes"),
                do_not_message: row.get("do_not_message"),
            })
            .collect();

        Ok(clients)
    }
}

