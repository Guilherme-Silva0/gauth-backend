# GAuth API

This API is a backend application developed using Node.js and Express.js. It provides endpoints for user registration, email confirmation, user authentication, and password recovery. The application also integrates with a MySQL database to store user information.

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Guilherme-Silva0/gauth-backend.git
```

2. In the project directory Install the dependencies:

```bash
npm install
```

3. Create a .env file in the root directory and add the following variables:

```makefile
PORT=
MYSQL_HOST=
MYSQL_USER=
MYSQL_PASSWORD=
MYSQL_DATABASE=

EMAIL_HOST=
PASS_EMAIL_HOST=

CLIENT_URL=

SECRET_KEY=
```

## Usage

To start the application in development mode, run:

```bash
npm run dev
```

To start the application in production mode, run:

```bash
npm start
```

## Endpoints

### Register

```url
POST /register
```

request body:

```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

### Confirm Registration

```url
PUT /register/confirm/:confirmation_code
```

### Login

```url
POST /login
```

request body:

```json
{
  "email": "string",
  "password": "string"
}
```

### Get User

```url
GET /
```

Authorization: Bearer token

### Password recovery

```url
PUT /password_recovery
```

request body:

```json
{
  "email": "string"
}
```

### Update Password

```url
PUT /password_recovery/:confirmation_code
```

request body:

```json
{
  "password": "string"
}
```

## Dependencies

This application uses the following dependencies:

- bcrypt
- cors
- dotenv
- express
- jsonwebtoken
- mysql2
- uuid
- nodemailer
- yup

## License

This project is licensed under the MIT. For more information, see the LICENSE file.

## Final considerations

Hope you enjoyed this project! If you have any questions or suggestions, please feel free to get in touch.
