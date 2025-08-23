use sqlx::PgPool;
use sqlx::Row;
use serde::Serialize;

pub(crate) struct ClientModel {
    pool: PgPool,
}

#[derive(Serialize)]
pub(crate) struct Client {
    pub id: i32,
    pub email: String,
    pub first_name: String,
    pub last_name: String,
    pub country: String,
    pub currency: String,
}

impl ClientModel {
    pub fn new(pool: PgPool) -> Self {
        ClientModel { pool }
    }

    pub async fn get_clients(&self) -> Result<Vec<Client>, String> {
        let rows = sqlx::query("SELECT * FROM \"user\"")
            .fetch_all(&self.pool)
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
            })
            .collect();

        Ok(clients)
    }
}

