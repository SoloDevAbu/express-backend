# User Profile API

A RESTful API for user profile management built with Node.js, Express, TypeScript, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm

## Setup

1. Clone the repository
```bash
git clone <repository-url>
cd express-backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/user-profile-db
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

## Running the Application

### Development mode
```bash
npm run dev
```

### Production build
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/v1/users/register`
- Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "address": "123 Main St",
  "bio": "Software Developer",
  "profilePicture": "https://example.com/photo.jpg"
}
```

#### Login User
- **POST** `/api/v1/users/login`
- Body:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Profile Management

#### Get Profile
- **GET** `/api/v1/users/profile`
- Requires authentication

#### Update Profile
- **PUT** `/api/v1/users/profile/update`
- Requires authentication
- Body (all fields optional):
```json
{
  "name": "John Doe",
  "address": "456 New St",
  "bio": "Updated bio",
  "profilePicture": "https://example.com/new-photo.jpg"
}
```

## Authentication

The API uses JWT tokens for authentication. After successful login or registration, the token is set in an HTTP-only cookie.

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- 200: Success
- 201: Resource created
- 400: Bad request
- 401: Unauthorized
- 404: Not found
- 409: Conflict
- 500: Server error

## Data Validation

Input validation is handled using Zod schema validation for:
- User registration
- Login
- Profile updates

## Security Features

- Passwords are hashed using bcrypt
- JWT tokens for authentication
- HTTP-only cookies
- Request data validation
