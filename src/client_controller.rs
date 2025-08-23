use axum::http::StatusCode;
use axum::Json;
use axum::extract::State;
use axum::http::HeaderMap;
use serde::{Deserialize, Serialize};
use jsonwebtoken::{decode, Validation, DecodingKey};
use crate::client_model::Client;
use crate::AppState;

#[derive(Serialize)]
pub(crate) struct ResponseClients {
    clients: Vec<Client>,
    message: String,
}

#[derive(Serialize, Deserialize)]
pub(crate) struct WebTokenClaims {
    // Subject (username)
    sub: String,
    // Expiration time
    exp: usize,
}

// @todo(niki): the token check should be a reusable function to avoid repetition
pub(crate) async fn get_clients(State(state): State<AppState>, headers: HeaderMap) -> (StatusCode, Json<ResponseClients>) {
    let token = match headers.get("Authorization") {
        Some(value) => value.to_str().unwrap_or_default().strip_prefix("Bearer ").unwrap_or_default(),
        None => "",
    };

    let token_result = decode::<WebTokenClaims>(&token, &DecodingKey::from_secret(state.jwt_secret.as_ref()), &Validation::default());

    let (status_code, clients, message) = match token_result {
        Ok(_) => {
            match state.client_model.get_clients().await {
                Ok(clients) => (StatusCode::OK, clients, "".to_string()),
                Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Database error: {}", err)),
            }
        },
        Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Token error: {}", err)),
    };

    (status_code, Json(ResponseClients { clients, message }))
}
