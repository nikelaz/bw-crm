use axum::http::StatusCode;
use axum::Json;
use axum::extract::State;
use axum::http::HeaderMap;
use chrono::{Utc, Duration};
use serde::{Deserialize, Serialize};
use jsonwebtoken::{encode, decode, Header, Validation, EncodingKey, DecodingKey};
use crate::AppState;

#[derive(Deserialize)]
pub(crate) struct PayloadLogin {
    username: String,
    password: String,
}

#[derive(Serialize)]
pub(crate) struct ResponseLogin {
    message: String,
    token: String,
}

#[derive(Serialize, Deserialize)]
pub(crate) struct WebTokenClaims {
    // Subject (username)
    sub: String,
    // Expiration time
    exp: usize,
}

pub(crate) async fn login(State(state): State<AppState>, Json(payload): Json<PayloadLogin>) -> (StatusCode, Json<ResponseLogin>) {
    let response_message: String;
    let status_code: StatusCode;
    let mut token: String = "".to_string();

    match state.user_model.login(payload.username.as_str(), payload.password.as_str()).await {
        Ok(_) => {
            response_message = "Login successful".to_string();
            
            let token_claims = WebTokenClaims {
                sub: payload.username,
                exp: (Utc::now() + Duration::days(30)).timestamp() as usize,
            };

            status_code = StatusCode::OK;

            token = encode(&Header::default(), &token_claims, &EncodingKey::from_secret(state.jwt_secret.as_ref()))
                .unwrap_or_else(|_| "Failed to generate token".to_string()) 
        },
        Err(e) => {
            status_code = StatusCode::BAD_REQUEST;
            response_message = format!("Login failed: {}", e);
        },
    }

    (status_code, Json(ResponseLogin { message: response_message, token }))
}

#[derive(Serialize)]
pub(crate) struct ResponseVerifyToken{
    message: String,
}

pub(crate) async fn verify_token(State(state): State<AppState>, headers: HeaderMap) -> (StatusCode, Json<ResponseVerifyToken>) {
    let token = match headers.get("Authorization") {
        Some(value) => value.to_str().unwrap_or_default().strip_prefix("Bearer ").unwrap_or_default(),
        None => "",
    };

    let token_result = decode::<WebTokenClaims>(&token, &DecodingKey::from_secret(state.jwt_secret.as_ref()), &Validation::default());

    let (status_code, message) = match token_result {
        Ok(_) => (StatusCode::OK, "Token verification successful".to_string()),
        Err(err) => (StatusCode::BAD_REQUEST, format!("Token verification failed: {}", err)),
    };

    (status_code, Json(ResponseVerifyToken { message }))
}
