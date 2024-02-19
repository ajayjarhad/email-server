# Email Service API - Quick Guide

## Overview
This Email Service API lets you send emails easily through your SMTP server. It's great for transactional emails, notifications, and more.

## Features
- **API Key Authentication**: Securely restricts email sending.
- **Rate Limiting**: Prevents overload by limiting requests.
- **Dynamic Email Templates**: Customize emails with Handlebars.
- **Environment Configuration**: Safely store SMTP details in `.env`.

## Setup

### Prerequisites
- Install Node.js.
- Have SMTP server details ready.

### Installation
1. Clone the repo.
2. Run `npm install` in the project folder.
3. Set up `.env` with SMTP and API key details:
  ```
HOST=smtp.example.com
EMAIL=your-email@example.com
PASSWORD=yourpassword
API_KEY=yourapikey
PORT=3000
```


## Customizing Templates
Templates are stored in `./src/templates/`, using Handlebars for easy customization. Make sure to create or edit templates as needed, ensuring the `type` in your request matches the template file name.

## Security
The service uses API key authentication and rate limiting to enhance security. Always keep your `.env` file secure and never expose sensitive information publicly.
