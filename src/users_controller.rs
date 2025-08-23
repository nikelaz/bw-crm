use axum::http::StatusCode;
use axum::Json;
use axum::extract::State;
use serde::{Deserialize, Serialize};
use crate::AppState;

#[derive(Deserialize)]
pub(crate) struct PayloadLogin {
    username: String,
    password: String,
}

#[derive(Serialize)]
pub(crate) struct PayloadResponse {
    message: String,
}

pub(crate) async fn login(State(state): State<AppState>, Json(payload): Json<PayloadLogin>) -> (StatusCode, Json<PayloadResponse>) {
    let response_message: String;

    match state.user_model.login(payload.username.as_str(), payload.password.as_str()).await {
        Ok(_) => response_message = "Login successful".to_string(),
        Err(e) => response_message = format!("Login failed: {}", e),
    }

    (StatusCode::CREATED, Json(PayloadResponse { message: response_message }))
}
