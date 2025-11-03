# Image Search Application

This is a full-stack image search application that allows users to search for images using the Unsplash API. Users can authenticate using their Google, GitHub, or Facebook accounts. The application keeps a history of user searches and also displays top searches.


![User Dashboard](https://i.ibb.co/v6k7W57J/Screenshot-from-2025-11-04-02-21-13.png)
![Home Page](https://i.ibb.co/mrBGSJHt/Screenshot-from-2025-11-04-02-18-46.png)
![Search Results](https://i.ibb.co/fdRF5wqt/Screenshot-from-2025-11-04-02-18-54.png)
![Login Page](https://i.ibb.co/WW7jfZ1v/Screenshot-from-2025-11-04-02-19-01.png)

## Tech Stack

### Frontend

- **React:** A JavaScript library for building user interfaces.
- **React Router:** For routing and navigation within the application.
- **Axios:** For making HTTP requests to the backend.
- **Tailwind CSS:** A utility-first CSS framework for styling.
- **Framer Motion:** For animations.
- **Lucide React & React Icons:** For icons.

### Backend

- **Node.js:** A JavaScript runtime environment.
- **Express:** A web application framework for Node.js.
- **Mongoose:** An ODM library for MongoDB.
- **Passport.js:** For authentication (OAuth with Google, GitHub, Facebook).
- **JSON Web Tokens (JWT):** For securing API endpoints.
- **Axios:** For making requests to the Unsplash API.

## Installation and Setup

### Prerequisites

- Node.js and npm
- MongoDB

### 1. Clone the repository

```bash
git clone <repository-url>
cd <repository-directory>
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory and add the following environment variables:

```
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>

# Unsplash API
UNSPLASH_ACCESS_KEY=<your_unsplash_access_key>

# Google OAuth
GOOGLE_CLIENT_ID=<your_google_client_id>
GOOGLE_CLIENT_SECRET=<your_google_client_secret>
GOOGLE_CALLBACK_URL=http://localhost:4081/auth/google/callback

# GitHub OAuth
GITHUB_CLIENT_ID=<your_github_client_id>
GITHUB_CLIENT_SECRET=<your_github_client_secret>
GITHUB_CALLBACK_URL=http://localhost:4081/auth/github/callback

# Facebook OAuth
FACEBOOK_CLIENT_ID=<your_facebook_client_id>
FACEBOOK_CLIENT_SECRET=<your_facebook_client_secret>
FACEBOOK_CALLBACK_URL=http://localhost:4081/auth/facebook/callback

CLIENT_URL=http://localhost:3000
```

### 3. Setup Frontend

```bash
cd ../client
npm install
```

## Running the Application

1.  **Start the backend server:**

    ```bash
    cd server
    npm start
    ```

    The server will be running on `http://localhost:4081`.

2.  **Start the frontend development server:**

    ```bash
    cd client
    npm start
    ```

    The application will be accessible at `http://localhost:3000`.

## API Endpoints

Here are the CURL commands for the backend endpoints:

**Authentication Endpoints (OAuth flows - typically initiated via browser):**

1.  **Initiate Google OAuth:**
    ```bash
    curl -X GET "http://localhost:4081/auth/google"
    ```

2.  **Initiate GitHub OAuth:**
    ```bash
    curl -X GET "http://localhost:4081/auth/github"
    ```

3.  **Initiate Facebook OAuth:**
    ```bash
    curl -X GET "http://localhost:4081/auth/facebook"
    ```
    *Note: The `/auth/*/callback` endpoints are part of the OAuth redirect flow and are not typically called directly via CURL by a user.*

**API Endpoints (require authentication with a JWT token):**

1.  **Search for Images:**
    ```bash
    curl -X POST "http://localhost:4081/api/search" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer <YOUR_JWT_TOKEN>" \
      -d ''{"term": "nature"}''
    ```
    *Replace `<YOUR_JWT_TOKEN>` with a valid JWT obtained after a successful OAuth login.*

2.  **Get Top Search Terms:**
    ```bash
    curl -X GET "http://localhost:4081/api/top-searches" \
      -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
    ```
    *Replace `<YOUR_JWT_TOKEN>` with a valid JWT obtained after a successful OAuth login.*

3.  **Get User Search History:**
    ```bash
    curl -X GET "http://localhost:4081/api/history" \
      -H "Authorization: Bearer <YOUR_JWT_TOKEN>"
    ```
    *Replace `<YOUR_JWT_TOKEN>` with a valid JWT obtained after a successful OAuth login.*
