# AxeDz API Documentation

## Base URL
All endpoints are mounted under the configured API prefix, defaulting to:
- `/api`

> Example full path: `/api/auth/signup`

## Authentication
- `POST /api/auth/signup`
  - Create a new user account.
  - Accepts form-data with optional `image` upload and JSON fields `name`, `email`, `phone`, `password`.
  - Returns access token and sets refresh token cookie.

- `POST /api/auth/login`
  - Authenticate with `identifier` (email or phone) and `password`.
  - Returns access token and sets refresh token cookie.

- `POST /api/auth/refresh-token`
  - Refresh access token using the `refreshToken` cookie or body payload.
  - Returns a new access token and updates the refresh token cookie.

- `POST /api/auth/logout`
  - Clears the refresh token cookie and logs the user out.
  - Requires `Authorization: Bearer <token>` header.

- `POST /api/auth/send-reset-otp`
  - Request a password reset OTP.
  - Typically accepts user identifier such as email or phone.

- `PUT /api/auth/reset-password-otp`
  - Reset password using OTP code.

- `PATCH /api/auth/reset-password`
  - Change password for an authenticated user.
  - Requires `Authorization: Bearer <token>` header.

- `POST /api/auth/send-verify-sms-otp`
  - Send an SMS OTP to verify the user phone.

- `PUT /api/auth/verify-sms`
  - Verify the SMS OTP.

## User Profile
- `GET /api/auth/me`
  - Return the currently authenticated user profile.
  - Requires authentication.

- `PUT /api/auth/update`
  - Update the authenticated user's profile.
  - Requires authentication.

- `GET /api/auth/:id`
  - Get a specific user by ID.
  - Requires authentication.

## Contacts
- `POST /api/contacts`
  - Submit a contact form or support request.
  - Stores `name`, `email`, `phone`, `subject`, and `message`.

- `GET /api/contacts`
  - Retrieve all contact submissions.

- `PUT /api/contacts/:id`
  - Update a contact entry by ID.
  - Typically used to change `status` to `read` or modify details.

- `DELETE /api/contacts/:id`
  - Delete a contact submission.

## API Key Management
- `POST /api/api-keys`
  - Create a new API key for the authenticated user.
  - Requires authentication.

- `POST /api/api-keys/validate`
  - Validate an API key and return its status.
  - Public endpoint used by API consumers.

- `GET /api/api-keys`
  - List authenticated user API keys.
  - Requires authentication.

- `GET /api/api-keys/:id`
  - Get API key details by ID.
  - Requires authentication.

- `PUT /api/api-keys/:id`
  - Update API key metadata or status.
  - Requires authentication.

- `DELETE /api/api-keys/:id`
  - Remove an API key.
  - Requires authentication.

## Payments and Wallets
- `POST /api/payments/initiate`
  - Start a new payment process.
  - Validates payment details and creates a payment record.

- `POST /api/payments/status/:orderId/sync`
  - Synchronize payment status for an existing order.
  - Used to update local payment state after provider callbacks.

- `GET /api/payments/history/:userId`
  - Retrieve payment history for a user.

- `GET /api/payments/transactions/:userId`
  - Get wallet transaction history for a user.

- `GET /api/payments/wallet/:userId`
  - Get the current wallet balance for a user.

## Communication
- `POST /api/communication/send-email`
  - Send an email through the service.

- `POST /api/communication/send-sms`
  - Send an SMS message through the service.

- `GET /api/communication/usage`
  - Retrieve API usage event records.

- `GET /api/communication/emails`
  - Retrieve sent email logs.

- `GET /api/communication/sms`
  - Retrieve sent SMS logs.

## Admin Dashboard and Management
> All admin endpoints require authenticated admin access.

- `GET /api/admin/dashboard`
  - Retrieve admin dashboard summary statistics.

- `GET /api/admin/stats/users`
  - Get aggregated user statistics.

- `GET /api/admin/users`
  - List all users.

- `GET /api/admin/users/:id`
  - Retrieve a specific user by ID.

- `PUT /api/admin/users/:id`
  - Update a user record.

- `GET /api/admin/wallets`
  - List all wallets.

- `GET /api/admin/wallets/:id`
  - Retrieve wallet details by ID.

- `GET /api/admin/api-keys`
  - List all API keys.

- `GET /api/admin/api-keys/:id`
  - Retrieve an API key by ID.

- `PUT /api/admin/api-keys/:id`
  - Update an API key.

- `DELETE /api/admin/api-keys/:id`
  - Delete an API key.

- `GET /api/admin/contacts`
  - List contact submissions.

- `PUT /api/admin/contacts/:id`
  - Update a contact submission.

- `DELETE /api/admin/contacts/:id`
  - Delete a contact submission.

- `GET /api/admin/payments`
  - List all payments.

- `GET /api/admin/transactions`
  - List all transactions.

- `PUT /api/admin/payments/:id/status`
  - Update payment status.

## Authentication Requirements
- Protected routes require `Authorization: Bearer <access_token>`.
- Refresh tokens are stored in an HTTP-only `refreshToken` cookie.
- Admin routes require the authenticated user to have `role: admin`.

## Notes
- User signup supports profile image upload via the `image` field using multipart/form-data.
- The backend uses S3 for uploaded profile images and stores the file path in the `User.imagePath` field.
- The API prefix is configurable and defaults to `/api`.

