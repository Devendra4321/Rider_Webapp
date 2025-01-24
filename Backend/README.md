## API Documentation

### User:

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

### Captain:

### POST /captains/register

Registers a new captain.

#### Request

- **URL:** `/captains/register`
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
    "password": "yourpassword",
    "vehicle": {
      "color": "Red",
      "plate": "ABC123",
      "capacity": 4,
      "vehicleType": "car"
    }
  }
  ```

#### Response

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "statusCode": 201,
    "message": "Captain registered successfully"
  }
  ```

### POST /captains/login

Logs in an existing captain.

#### Request

- **URL:** `/captains/login`
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
    "message": "Captain logged in successfully",
    "token": "jwt_token",
    "captain": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // ...other captain details...
    }
  }
  ```

### POST /captains/sendOtp

Sends an OTP to the captain's email.

#### Request

- **URL:** `/captains/sendOtp`
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

### POST /captains/verifyOtp

Verifies the OTP sent to the captain's email.

#### Request

- **URL:** `/captains/verifyOtp`
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

### POST /captains/emailVerificationLink

Sends an email verification link to the captain's email.

#### Request

- **URL:** `/captains/emailVerificationLink`
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

### POST /captains/verifyEmail

Verifies the captain's email using the verification token.

#### Request

- **URL:** `/captains/verifyEmail`
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

### GET /captains/getCaptainProfile

Retrieves the profile of the authenticated captain.

#### Request

- **URL:** `/captains/getCaptainProfile`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "captain": {
      "fullname": {
        "firstname": "John",
        "lastname": "Doe"
      },
      "email": "john.doe@example.com"
      // ...other captain details...
    }
  }
  ```

### PATCH /captains/forgotPassword

Updates the captain's password.

#### Request

- **URL:** `/captains/forgotPassword`
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

### GET /captains/logoutCaptain

Logs out the authenticated captain.

#### Request

- **URL:** `/captains/logoutCaptain`
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

### POST /captains/uploadDocuments

Uploads documents for the authenticated captain.

#### Request

- **URL:** `/captains/uploadDocuments`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body:**
  ```form-data
  {
    "documentName": "drivinglicense",
    "document": <file>
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Document uploaded successfully"
  }
  ```

### GET /captains/updateCaptainEarning

Updates the captain's earnings.

#### Request

- **URL:** `/captains/updateCaptainEarning`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "ride": {
      // ...ride details...
    }
  }
  ```

### Map:

### GET /map/getCoordinates

Retrieves the coordinates for a given address.

#### Request

- **URL:** `/map/getCoordinates`
- **Method:** `GET`
- **Headers:** `Content-Type: application/json`
- **Query Parameters:**
  - `address`: The address to get coordinates for.

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "latitude": 40.712776,
      "longitude": -74.005974
    }
  }
  ```

### GET /map/getDistanceTime

Calculates the distance and time between two locations.

#### Request

- **URL:** `/map/getDistanceTime`
- **Method:** `GET`
- **Headers:** `Content-Type: application/json`
- **Query Parameters:**
  - `origin`: The starting location.
  - `destination`: The ending location.

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "data": {
      "distance": "5 km",
      "time": "10 mins"
    }
  }
  ```

### GET /map/getSuggestion

Fetches location suggestions based on a query.

#### Request

- **URL:** `/map/getSuggestion`
- **Method:** `GET`
- **Headers:** `Content-Type: application/json`
- **Query Parameters:**
  - `query`: The search query for location suggestions.

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "suggestions": ["New York, NY, USA", "Newark, NJ, USA"]
  }
  ```

### Ride:

### POST /ride/create

Creates a new ride.

#### Request

- **URL:** `/ride/create`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "pickup": "123 Main St, New York, NY",
    "destination": "456 Elm St, New York, NY",
    "vehicleType": "car",
    "paymentMethod": "cash"
  }
  ```

#### Response

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "statusCode": 201,
    "message": "Ride created",
    "ride": {
      // ...ride details...
    }
  }
  ```

### POST /ride/confirm

Confirms a ride by the captain.

#### Request

- **URL:** `/ride/confirm`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "rideId": "ride_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Ride accepted by captain",
    "ride": {
      // ...ride details...
    }
  }
  ```

### POST /ride/startRide

Starts a ride by the captain.

#### Request

- **URL:** `/ride/startRide`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "rideId": "ride_id",
    "otp": "123456"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Ride started by captain",
    "ride": {
      // ...ride details...
    }
  }
  ```

### POST /ride/endRide

Ends a ride by the captain.

#### Request

- **URL:** `/ride/endRide`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "rideId": "ride_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Ride completed by captain",
    "ride": {
      // ...ride details...
    }
  }
  ```

### POST /ride/cancelUserRide

Cancels a ride by the user.

#### Request

- **URL:** `/ride/cancelUserRide`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "rideId": "ride_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Ride cancelled by user",
    "ride": {
      // ...ride details...
    }
  }
  ```

### POST /ride/upadatePaymentStatus

Updates the payment status of a ride.

#### Request

- **URL:** `/ride/upadatePaymentStatus`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "rideId": "ride_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Payment status updated",
    "ride": {
      // ...ride details...
    }
  }
  ```

### POST /ride/paymentInit

Initializes a payment for a ride.

#### Request

- **URL:** `/ride/paymentInit`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "amount": 100
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "order": {
      // ...order details...
    }
  }
  ```

### GET /ride/paymentVerify

Verifies a payment for a ride.

#### Request

- **URL:** `/ride/paymentVerify`
- **Method:** `GET`
- **Headers:** `Content-Type: application/json`
- **Query Parameters:**
  - `razorpay_order_id`: The Razorpay order ID.
  - `razorpay_payment_id`: The Razorpay payment ID.
  - `razorpay_signature`: The Razorpay signature.

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Payment successful",
    "razorpay_payment_id": "payment_id"
  }
  ```

### POST /ride/sendNotification

Sends a notification for a ride.

#### Request

- **URL:** `/ride/sendNotification`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "rideId": "ride_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Notification sent to captains"
  }
  ```

### GET /ride/getRideById/:id

Retrieves the details of a ride by its ID.

#### Request

- **URL:** `/ride/getRideById/:id`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Ride details retrieved successfully",
    "ride": {
      // ...ride details...
    }
  }
  ```

### Wallet:

### GET /wallet/createCaptainWallet

Creates a wallet for the authenticated captain.

#### Request

- **URL:** `/wallet/createCaptainWallet`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "statusCode": 201,
    "message": "Captain wallet created successfully",
    "data": {
      // ...wallet details...
    }
  }
  ```

### GET /wallet/getCaptainWallet

Retrieves the wallet of the authenticated captain.

#### Request

- **URL:** `/wallet/getCaptainWallet`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Captain wallet found",
    "data": {
      // ...wallet details...
    }
  }
  ```

### POST /wallet/debitInCaptainWallet

Debits an amount from the captain's wallet where payment type is cash for a completed ride.

#### Request

- **URL:** `/wallet/debitInCaptainWallet`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "rideId": "ride_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Amount debited successfully",
    "data": {
      // ...wallet details...
    }
  }
  ```

### POST /wallet/creditInCaptainWallet

Credits an amount to the captain's wallet where payment type is online for a completed ride.

#### Request

- **URL:** `/wallet/creditInCaptainWallet`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "rideId": "ride_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Amount credited successfully",
    "data": {
      // ...wallet details...
    }
  }
  ```

### POST /wallet/withdrawInCaptainWallet

Withdraws an amount from the captain's wallet.

#### Request

- **URL:** `/wallet/withdrawInCaptainWallet`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "amount": 100
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Amount withdrawn successfully",
    "data": {
      // ...wallet details...
    }
  }
  ```

### POST /wallet/AddInCaptainWallet

Adds an amount to the captain's wallet.

#### Request

- **URL:** `/wallet/AddInCaptainWallet`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "amount": 100,
    "transactionId": "transaction_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Amount added successfully",
    "data": {
      // ...wallet details...
    }
  }
  ```

### POST /wallet/getAllCaptainWalletTransactions

Retrieves all transactions of the captain's wallet with pagination.

#### Request

- **URL:** `/wallet/getAllCaptainWalletTransactions`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "page": 1,
    "perPage": 5
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Captain wallet transactions",
    "data": {
      "totalTransactions": 10,
      "totalPages": 2,
      "transactions": [
        // ...transaction details...
      ]
    }
  }
  ```

### Admin:

### POST /admin/addAdmin

Adds a new admin.

#### Request

- **URL:** `/admin/addAdmin`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
  ```

#### Response

- **Status Code:** `201 Created`
- **Body:**
  ```json
  {
    "statuscode": 201,
    "message": "Admin created successfully",
    "token": "jwt_token"
  }
  ```

### POST /admin/login

Logs in an existing admin.

#### Request

- **URL:** `/admin/login`
- **Method:** `POST`
- **Headers:** `Content-Type: application/json`
- **Body:**
  ```json
  {
    "email": "admin@example.com",
    "password": "yourpassword"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "Admin logged in successfully",
    "token": "jwt_token"
  }
  ```

### GET /admin/logout

Logs out the authenticated admin.

#### Request

- **URL:** `/admin/logout`
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

### POST /admin/getAllAdmin

Retrieves all admins with pagination.

#### Request

- **URL:** `/admin/getAllAdmin`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "page": 1,
    "perPage": 5,
    "isDeleted": false
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "All admins fetched successfully",
    "totalAdmins": 10,
    "totalPages": 2,
    "data": [
      // ...admin details...
    ]
  }
  ```

### POST /admin/getAllUsers

Retrieves all users with pagination.

#### Request

- **URL:** `/admin/getAllUsers`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "page": 1,
    "perPage": 5,
    "isDeleted": false
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "All users fetched successfully",
    "totalUsers": 10,
    "totalPages": 2,
    "data": [
      // ...user details...
    ]
  }
  ```

### POST /admin/getAllCaptains

Retrieves all captains with pagination.

#### Request

- **URL:** `/admin/getAllCaptains`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "page": 1,
    "perPage": 5,
    "isDeleted": false
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "All captains fetched successfully",
    "totalCaptains": 10,
    "totalPages": 2,
    "data": [
      // ...captain details...
    ]
  }
  ```

### POST /admin/getAllCaptainsRequest

Retrieves all captain requests with pagination.

#### Request

- **URL:** `/admin/getAllCaptainsRequest`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "page": 1,
    "perPage": 5,
    "status": 0
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "All captains fetched successfully",
    "totalCaptains": 10,
    "totalPages": 2,
    "data": [
      // ...captain details...
    ]
  }
  ```

### POST /admin/getAllRides

Retrieves all rides with pagination.

#### Request

- **URL:** `/admin/getAllRides`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "page": 1,
    "perPage": 5
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "All rides fetched successfully",
    "totalRides": 10,
    "totalPages": 2,
    "data": [
      // ...ride details...
    ]
  }
  ```

### POST /admin/updateCaptainStatus/:captainId

Updates the status of a captain.

#### Request

- **URL:** `/admin/updateCaptainStatus/:captainId`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "status": 1
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "Captain status updated successfully"
  }
  ```

### GET /admin/deleteAdmin/:adminId

Deletes an admin.

#### Request

- **URL:** `/admin/deleteAdmin/:adminId`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "Admin deleted successfully"
  }
  ```

### GET /admin/deleteUser/:userId

Deletes a user.

#### Request

- **URL:** `/admin/deleteUser/:userId`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "User deleted successfully"
  }
  ```

### GET /admin/deleteCaptain/:captainId

Deletes a captain.

#### Request

- **URL:** `/admin/deleteCaptain/:captainId`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "message": "Captain deleted successfully"
  }
  ```

### POST /admin/searchInUser

Searches for users based on a field and search text.

#### Request

- **URL:** `/admin/searchInUser`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "fieldName": "email",
    "searchText": "john.doe@example.com"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "data": [
      // ...user details...
    ]
  }
  ```

### POST /admin/searchInCaptain

Searches for captains based on a field and search text.

#### Request

- **URL:** `/admin/searchInCaptain`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "fieldName": "email",
    "searchText": "john.doe@example.com"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "data": [
      // ...captain details...
    ]
  }
  ```

### POST /admin/searchInAdmin

Searches for admins based on a field and search text.

#### Request

- **URL:** `/admin/searchInAdmin`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Body:**
  ```json
  {
    "fieldName": "email",
    "searchText": "admin@example.com"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statuscode": 200,
    "data": [
      // ...admin details...
    ]
  }
  ```

### GET /admin/getCaptainById/:captainId

Retrieves a captain by their ID.

#### Request

- **URL:** `/admin/getCaptainById/:captainId`
- **Method:** `GET`
- **Headers:** `Authorization: Bearer <token>`

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Captain fetched",
    "data": {
      // ...captain details...
    }
  }
  ```

### POST /admin/uploadCaptainDocument

Uploads a document for a captain.

#### Request

- **URL:** `/admin/uploadCaptainDocument`
- **Method:** `POST`
- **Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Body:**
  ```form-data
  {
    "documentName": "drivinglicense",
    "document": <file>,
    "captainId": "captain_id"
  }
  ```

#### Response

- **Status Code:** `200 OK`
- **Body:**
  ```json
  {
    "statusCode": 200,
    "message": "Image uploaded successfully"
  }
  ```

### Socket:

### Event: `join`

Joins a user or captain to the socket.

#### Request

- **Event:** `join`
- **Data:**
  ```json
  {
    "userId": "user_id",
    "userType": "user" // or "captain"
  }
  ```

### Event: `update-location-captain`

Updates the location of a captain.

#### Request

- **Event:** `update-location-captain`
- **Data:**
  ```json
  {
    "userId": "captain_id",
    "location": {
      "ltd": 40.712776,
      "lng": -74.005974
    }
  }
  ```

### Event: `ride-request`

Sends a ride request to a captain.

#### Request

- **Event:** `ride-request`
- **Data:**
  ```json
  {
    "rideId": "ride_id",
    "captainId": "captain_socket_id"
  }
  ```

### Event: `ride-response`

Sends a ride response from a captain to a user.

#### Request

- **Event:** `ride-response`
- **Data:**
  ```json
  {
    "rideId": "ride_id",
    "userId": "user_socket_id",
    "response": "accepted" // or "rejected"
  }
  ```

### Event: `ride-confirmed`

Notifies the user that the ride has been confirmed by the captain.

#### Request

- **Event:** `ride-confirmed`
- **Data:**
  ```json
  {
    "rideId": "ride_id",
    "captainId": "captain_id"
  }
  ```

### Event: `ride-started`

Notifies the user that the ride has started.

#### Request

- **Event:** `ride-started`
- **Data:**
  ```json
  {
    "rideId": "ride_id",
    "captainId": "captain_id"
  }
  ```

### Event: `ride-ended`

Notifies the user that the ride has ended.

#### Request

- **Event:** `ride-ended`
- **Data:**
  ```json
  {
    "rideId": "ride_id",
    "captainId": "captain_id"
  }
  ```

### Event: `ride-user-cancelled`

Notifies the captain that the ride has been cancelled by the user.

#### Request

- **Event:** `ride-user-cancelled`
- **Data:**
  ```json
  {
    "rideId": "ride_id",
    "userId": "user_id"
  }
  ```

### Event: `new-ride`

Sends a new ride request to captains in the vicinity.

#### Request

- **Event:** `new-ride`
- **Data:**
  ```json
  {
    "rideId": "ride_id",
    "pickup": "pickup_location",
    "destination": "destination_location"
  }
  ```

### Event: `disconnect`

Disconnects a user or captain from the socket.

#### Request

- **Event:** `disconnect`
