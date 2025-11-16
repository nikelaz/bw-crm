export default [
  {
    "id": 1,
    "title": "Welcome Email",
    "body": "Hi {{first_name}} {{last_name}},\n\nWelcome! We're excited to have you onboard. If you need help getting started, our team is here to support you.\n\nCheers,\nOur Team"
  },
  {
    "id": 2,
    "title": "Password Reset",
    "body": "Hi {{name}},\n\nWe received a request to reset your password. Click the link below to create a new one:\n{{reset_link}}\n\nIf you didn’t request this, simply ignore this email.\n\nRegards,\n{{sender_name}}"
  },
  {
    "id": 3,
    "title": "Payment Successful",
    "body": "Hello {{name}},\n\nYour payment of {{amount}} was successfully processed. You can view your invoice here:\n{{invoice_link}}\n\nThanks for your trust.\n{{sender_name}}"
  },
  {
    "id": 4,
    "title": "Subscription Expiring Soon",
    "body": "Hi {{name}},\n\nYour subscription will expire on {{expiry_date}}. To avoid interruptions, renew your plan using the link below:\n{{renew_link}}\n\nThank you,\n{{sender_name}}"
  },
  {
    "id": 5,
    "title": "Account Verification",
    "body": "Hi {{name}},\n\nPlease verify your account by clicking the link below:\n{{verification_link}}\n\nIf you didn’t create an account, ignore this email.\n\nBest,\n{{sender_name}}"
  },
  {
    "id": 6,
    "title": "Feedback Request",
    "body": "Hi {{name}},\n\nWe hope you're enjoying {{product}}. When you have a minute, we’d appreciate your feedback:\n{{feedback_link}}\n\nYour insights help us improve.\n{{sender_name}}"
  },
  {
    "id": 7,
    "title": "Trial Ending Reminder",
    "body": "Hello {{name}},\n\nYour trial ends in {{days_left}} days. Unlock full access by upgrading here:\n{{upgrade_link}}\n\nLet us know if you need assistance.\n{{sender_name}}"
  },
  {
    "id": 8,
    "title": "Order Confirmation",
    "body": "Hi {{name}},\n\nWe’ve received your order #{{order_id}}. You’ll receive another email once it ships.\n\nThank you for shopping with us!\n{{sender_name}}"
  },
  {
    "id": 9,
    "title": "Shipping Notification",
    "body": "Hi {{name}},\n\nYour order #{{order_id}} has shipped! Track it here:\n{{tracking_link}}\n\nThank you,\n{{sender_name}}"
  },
  {
    "id": 10,
    "title": "Account Deletion Confirmation",
    "body": "Hi {{name}},\n\nYour account has been scheduled for deletion. If this wasn't you, contact us immediately:\n{{support_link}}\n\nRegards,\n{{sender_name}}"
  }
]
