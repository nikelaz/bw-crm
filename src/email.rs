use crate::email_model::Email;

pub fn send(
    email: &Email,
) {
    match smtp2go::Email::new()
        .from(format!("{} <{}>", email.from_name, email.from_email))
        .to(&[
          format!("{} <{}>", email.to_name, email.to_email)
        ])
        .subject(email.subject.as_str())
        .text_body(email.body.as_str())
        .send() {
          Ok(response) => println!("Message Successfully Sent - {:?}", response),
          Err(error) => println!("Message failed: Error: {:?}", error)
        };
}
