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
    pub created: String,
    pub last_activity_date: Option<String>,
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
                created: row.get("created"),
                last_activity_date: row.get("last_activity_date"),
            })
            .collect();

        Ok(clients)
    }

    pub async fn get_client(&self, id: u32) -> Result<Vec<Client>, String> {
        let rows = sqlx::query("SELECT * FROM \"clients\" WHERE id = ?")
            .bind(id)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| format!("Failed to fetch client: {}", e))?;

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
                created: row.get("created"),
                last_activity_date: row.get("last_activity_date"),
            })
            .collect();

        Ok(clients)
    }

    pub async fn update_client(&self, client: &Client) -> Result<(), String> {
        let query = r#"
            UPDATE "clients"
            SET notes = ?,
                do_not_message = ?
            WHERE id = ?
        "#;
        
        sqlx::query(query)
            .bind(&client.notes)
            .bind(client.do_not_message)
            .bind(client.id)
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to update client: {}", e))?;
        
        Ok(())
    }
}

