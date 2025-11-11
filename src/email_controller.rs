use axum::http::StatusCode;
use axum::Json;
use axum::extract::{State, Path};
use axum::http::HeaderMap;
use serde::{Deserialize, Serialize};
use jsonwebtoken::{decode, Validation, DecodingKey};
use crate::email_model::Email;
use crate::AppState;

#[derive(Serialize)]
pub(crate) struct ResponseEmails {
    emails: Vec<Email>,
    message: String,
}

#[derive(Serialize, Deserialize)]
pub(crate) struct WebTokenClaims {
    // Subject (username)
    sub: String,
    // Expiration time
    exp: usize,
}

#[derive(Debug, Deserialize)]
pub struct CreateEmailPayload {
    pub from_name: String,
    pub from_email: String,
    pub to_name: String,
    pub to_email: String,
    pub subject: String,
    pub body: String,
    pub timestamp: String,
}

pub(crate) async fn get_emails(State(state): State<AppState>, headers: HeaderMap) -> (StatusCode, Json<ResponseEmails>) {
    let token = match headers.get("Authorization") {
        Some(value) => value.to_str().unwrap_or_default().strip_prefix("Bearer ").unwrap_or_default(),
        None => "",
    };

    let token_result = decode::<WebTokenClaims>(&token, &DecodingKey::from_secret(state.jwt_secret.as_ref()), &Validation::default());

    let (status_code, emails, message) = match token_result {
        Ok(_) => {
            match state.email_model.get_emails().await {
                Ok(emails) => (StatusCode::OK, emails, "".to_string()),
                Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Database error: {}", err)),
            }
        },
        Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Token error: {}", err)),
    };

    (status_code, Json(ResponseEmails { emails, message }))
}

pub(crate) async fn get_email(State(state): State<AppState>, Path(email_id): Path<u32>, headers: HeaderMap) -> (StatusCode, Json<ResponseEmails>) {
    let token = match headers.get("Authorization") {
        Some(value) => value.to_str().unwrap_or_default().strip_prefix("Bearer ").unwrap_or_default(),
        None => "",
    };

    let token_result = decode::<WebTokenClaims>(&token, &DecodingKey::from_secret(state.jwt_secret.as_ref()), &Validation::default());

    let (status_code, emails, message) = match token_result {
        Ok(_) => {
            match state.email_model.get_email(email_id).await {
                Ok(emails) => (StatusCode::OK, emails, "".to_string()),
                Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Database error: {}", err)),
            }
        },
        Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Token error: {}", err)),
    };

    (status_code, Json(ResponseEmails { emails, message }))
}

pub(crate) async fn create_email(
    State(state): State<AppState>,
    headers: HeaderMap,
    Json(payload): Json<CreateEmailPayload>,
) -> (StatusCode, Json<ResponseEmails>) {
    let token = match headers.get("Authorization") {
        Some(value) => value
            .to_str()
            .unwrap_or_default()
            .strip_prefix("Bearer ")
            .unwrap_or_default(),
        None => "",
    };

    let token_result = decode::<WebTokenClaims>(
        &token,
        &DecodingKey::from_secret(state.jwt_secret.as_ref()),
        &Validation::default(),
    );

    let (status_code, emails, message) = match token_result {
        Ok(_) => {
            let new_email = Email {
                id: 0,
                from_name: payload.from_name,
                from_email: payload.from_email,
                to_name: payload.to_name,
                to_email: payload.to_email,
                subject: payload.subject,
                body: payload.body,
                timestamp: payload.timestamp,
            };

            match state.email_model.create(&new_email).await {
                Ok(_) => (StatusCode::OK, vec![], "Email created successfully".to_string()),
                Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Database error: {}", err)),
            }
        }
        Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Token error: {}", err)),
    };

    (status_code, Json(ResponseEmails { emails, message }))
}
