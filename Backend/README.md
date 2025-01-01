## API Documentation

### POST /users/register

Registers a new user.

#### Request

- **URL:** `/users/register`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "fullname": {
      "firstname": "John",
      "lastname": "Doe"
    },
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```

#### Response

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "statusCode": 201,
    "message": "User registered successfully",
    "token": "jwt_token"
  }
  ```

### POST /users/login

Logs in an existing user.

#### Request

- **URL:** `/users/login`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "password": "yourpassword"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "User logged in successfully",
    "token": "jwt_token",
    "user": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // ...other user details...
    }
  }
  ```

### POST /users/sendOtp

Sends an OTP to the user's email.

#### Request

- **URL:** `/users/sendOtp`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "OTP sent successfully",
    "otp": {
      "email": "john.doe@example.com",
      "otpData": {
        "otp": "123456",
        "expiresAt": "2023-10-10T10:00:00.000Z"
      }
    }
  }
  ```

### POST /users/verifyOtp

Verifies the OTP sent to the user's email.

#### Request

- **URL:** `/users/verifyOtp`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "john.doe@example.com",
    "otp": "123456"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "OTP verified successfully"
  }
  ```

### POST /users/emailVerificationLink

Sends an email verification link to the user's email.

#### Request

- **URL:** `/users/emailVerificationLink`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "john.doe@example.com"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Verification email sent successfully",
    "verificationLink": "https://example.com/verify-email?token=verification_token",
    "token": "verification_token"
  }
  ```

### POST /users/verifyEmail

Verifies the user's email using the verification token.

#### Request

- **URL:** `/users/verifyEmail`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "token": "verification_token"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Email verified successfully"
  }
  ```

### GET /users/getUserProfile

Retrieves the profile of the authenticated user.

#### Request

- **URL:** `/users/getUserProfile`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "user": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // ...other user details...
    }
  }
  ```

### PATCH /users/forgotPassword

Updates the user's password.

#### Request

- **URL:** `/users/forgotPassword`
- **Method:** `PATCH`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "newPassword": "newpassword"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Password updated successfully"
  }
  ```

### GET /users/logout

Logs out the authenticated user.

#### Request

- **URL:** `/users/logout`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Logged out"
  }
  ```
