pub fn send(
    from_first_name: &str,
    from_email: &str,
    to_name: &str,
    to_email: &str,
    subject: &str,
    body: &str
) {
    match smtp2go::Email::new()
        .from(format!("{} <{}>", from_first_name, from_email))
        .to(&[
          format!("{} <{}>", to_name, to_email)
        ])
        .subject(subject)
        .text_body(body)
        .send() {
          Ok(response) => println!("Message Successfully Sent - {:?}", response),
          Err(error) => println!("Message failed: Error: {:?}", error)
        };
}
