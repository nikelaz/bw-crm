use sqlx::SqlitePool;
use sqlx::Row;
use serde::Serialize;

pub(crate) struct EmailModel {
    pool: SqlitePool,
}

#[derive(Serialize)]
pub(crate) struct Email {
    pub id: i32,
    pub from_name: String,
    pub from_email: String,
    pub to_name: String,
    pub to_email: String,
    pub subject: String,
    pub body: String,
    pub date: String,
}

impl EmailModel {
    pub fn new(pool: SqlitePool) -> Self {
        EmailModel { pool }
    }

    pub async fn get_emails(&self) -> Result<Vec<Email>, String> {
        let rows = sqlx::query("SELECT * FROM \"emails\"")
            .fetch_all(&self.pool)
            .await
            .map_err(|e| format!("Failed to fetch emails: {}", e))?;

        let emails: Vec<Email> = rows
            .into_iter()
            .map(|row| Email {
                id: row.get("id"),
                from_name: row.get("from_name"),
                from_email: row.get("from_email"),
                to_name: row.get("to_name"),
                to_email: row.get("to_email"),
                subject: row.get("subject"),
                body: row.get("body"),
                date: row.get("date"),
            })
            .collect();

        Ok(emails)
    }

    pub async fn get_email(&self, id: u32) -> Result<Vec<Email>, String> {
        let rows = sqlx::query("SELECT * FROM \"emails\" WHERE id = ?")
            .bind(id)
            .fetch_all(&self.pool)
            .await
            .map_err(|e| format!("Failed to fetch emails: {}", e))?;

        let emails: Vec<Email> = rows
            .into_iter()
            .map(|row| Email {
                id: row.get("id"),
                from_name: row.get("from_name"),
                from_email: row.get("from_email"),
                to_name: row.get("to_name"),
                to_email: row.get("to_email"),
                subject: row.get("subject"),
                body: row.get("body"),
                date: row.get("date"),
            })
            .collect();

        Ok(emails)
    }

    pub async fn create(&self, email: &Email) -> Result<(), String> {
        let query = r#"
            INSERT INTO "emails" (
                from_name,
                from_email,
                to_name,
                to_email,
                subject,
                body,
                date
            )
            VALUES (?, ?, ?, ?, ?, ?, ?);
        "#;
        
        sqlx::query(query)
            .bind(email.from_name.as_str())
            .bind(email.from_email.as_str())
            .bind(email.to_name.as_str())
            .bind(email.to_email.as_str())
            .bind(email.subject.as_str())
            .bind(email.body.as_str())
            .bind(email.date.as_str())
            .execute(&self.pool)
            .await
            .map_err(|e| format!("Failed to create email: {}", e))?;
        
        Ok(())
    }
}

