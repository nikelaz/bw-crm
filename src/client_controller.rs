use axum::http::StatusCode;
use axum::Json;
use axum::extract::{State, Path};
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

#[derive(Debug, Deserialize)]
pub struct UpdateClientPayload {
    pub notes: Option<String>,
    pub do_not_message: Option<u32>,
}

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

pub(crate) async fn get_client(State(state): State<AppState>, Path(client_id): Path<u32>, headers: HeaderMap) -> (StatusCode, Json<ResponseClients>) {
    let token = match headers.get("Authorization") {
        Some(value) => value.to_str().unwrap_or_default().strip_prefix("Bearer ").unwrap_or_default(),
        None => "",
    };

    let token_result = decode::<WebTokenClaims>(&token, &DecodingKey::from_secret(state.jwt_secret.as_ref()), &Validation::default());

    let (status_code, clients, message) = match token_result {
        Ok(_) => {
            match state.client_model.get_client(client_id).await {
                Ok(clients) => (StatusCode::OK, clients, "".to_string()),
                Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Database error: {}", err)),
            }
        },
        Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Token error: {}", err)),
    };

    (status_code, Json(ResponseClients { clients, message }))
}

pub(crate) async fn update_client(
    State(state): State<AppState>,
    Path(client_id): Path<u32>,
    headers: HeaderMap,
    Json(payload): Json<UpdateClientPayload>,
) -> (StatusCode, Json<ResponseClients>) {
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

    let (status_code, clients, message) = match token_result {
        Ok(_) => {
            match state.client_model.get_client(client_id).await {
                Ok(mut clients) if !clients.is_empty() => {
                    let mut client = clients.remove(0);

                    if let Some(notes) = payload.notes { client.notes = Some(notes); }
                    if let Some(do_not_message) = payload.do_not_message { client.do_not_message = Some(do_not_message); }

                    match state.client_model.update_client(&client).await {
                        Ok(_) => (StatusCode::OK, vec![client], "Client updated successfully".to_string()),
                        Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Database error: {}", err)),
                    }
                }
                Ok(_) => (StatusCode::NOT_FOUND, vec![], "Client not found".to_string()),
                Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Database error: {}", err)),
            }
        }
        Err(err) => (StatusCode::BAD_REQUEST, vec![], format!("Token error: {}", err)),
    };

    (status_code, Json(ResponseClients { clients, message }))
}
