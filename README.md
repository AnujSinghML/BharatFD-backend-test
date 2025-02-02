# Multilingual FAQ Management System

A full-stack solution for managing frequently asked questions (FAQs) with real-time translations and caching. Built using the MERN stack (MongoDB, Express, React, Node.js), this system lets you add FAQs in English while automatically translating them into Hindi and Bengali. The backend uses Redis to cache translations and is fully containerized with Docker.

## Features

- **Multi-language Support:** Add FAQs in English and automatically get translations in Hindi and Bengali.
- **Automatic Translations:** Integrated with Google Translate API to generate translations on the fly.
- **Redis Caching:** Translated content is cached to improve performance.
- **WYSIWYG Editor:** Rich text editing for FAQ answers using CKEditor 5 (in the admin panel).
- **Admin Panel:** A responsive React/Vite-based interface for managing FAQs (CRUD operations).
- **Docker Containerization:** Easily run the backend, MongoDB, and Redis using Docker.
- **Comprehensive Testing:** Unit tests ensure the reliability of backend API endpoints.

## Prerequisites

- Node.js v16+
- MongoDB (v5.0+ recommended)
- Redis (v6.2+ recommended)
- Docker (optional, for containerized deployments)

## Installation

### 1. Clone the Repository
git clone https://github.com/yourusername/faq-translation-system.git
cd faq-translation-system

### 2. Backend Setup
Navigate to the `server` directory, install dependencies, and configure the environment:
cd server
npm install
cp .env.example .env

Ensure your `.env` file looks similar to:
MONGODB_URI=mongodb://mongo:27017/faq_translations
REDIS_URL=redis://redis:6379
PORT=5000

### 3. Frontend Setup
The React admin panel is located under `client/my-app`. Install its dependencies:
cd ../client/my-app
npm install

*Note: The frontend uses Vite and is configured (using a proxy) to forward API requests to the backend.*

## Docker Setup & Deployment
This project is fully containerized using Docker Compose.

### Running Backend Services (Development)
From the project root, run:
docker-compose up -d
This command will start:
- **web:** Your Express backend (on port 5000)
- **mongo:** MongoDB instance
- **redis:** Redis instance with proper health checks

### Production Deployment
For production, use the production Docker Compose file:
docker-compose -f docker-compose.prod.yml up --build -d


## Running the Application Locally

### Backend
Verify that your backend is running (via Docker or locally). It should be available at [http://localhost:5000](http://localhost:5000).

### Frontend
Start the React admin panel:
cd client/my-app
npm run dev

Your admin panel will be available at the port configured by Vite (commonly [http://localhost:5173](http://localhost:5173)).  
> **Note:** The admin panel provides a convenient UI for CRUD operations; however, the following instructions focus on the backend API and curl commands for testing.


## API Documentation

### Endpoints

| Method | Endpoint             | Description                                  |
|--------|----------------------|----------------------------------------------|
| GET    | `/api/faqs`          | Retrieve all FAQs (English by default)       |
| GET    | `/api/faqs?lang=hi`  | Retrieve FAQs translated into Hindi          |
| GET    | `/api/faqs?lang=bn`  | Retrieve FAQs translated into Bengali        |
| POST   | `/api/faqs`          | Create a new FAQ (submitting only English)   |

### Example API Calls Using curl

#### 1. Add a New FAQ

This request sends a new FAQ in English. The backend processes this and automatically generates translations.

curl -X POST http://localhost:5000/api/faqs
-H "Content-Type: application/json"
-d '{
"question": "How do I reset my password?",
"answer": "<p>Go to account settings and click reset password.</p>"
}'

Here is an example of how it worked and what to expect:
![image-showing-how-api-works](output\API-using-curl.png)


#### 2. Retrieve FAQs in English

curl -X GET http://localhost:5000/api/faqs

#### 3. Retrieve FAQs in Hindi

curl -X GET "http://localhost:5000/api/faqs?lang=hi"

#### 4. Retrieve FAQs in Bengali

## System Architecture
curl -X GET "http://localhost:5000/api/faqs?lang=bn"

         +---------------------+
         |  React Admin Panel  |
         |  (client/my-app)    |
         +---------------------+
                    │
                    ▼
         +---------------------+
         |     Express API     |
         |  (/api/faqs endpoints)  |
         +---------------------+
                    │
       +------------+------------+
       |                         |
   +-------+                +---------+
   | Redis |                | MongoDB |
   | Cache |                | Database|
   +-------+                +---------+
                    │
                    ▼
    +-----------------------------+
    | Translation Service         |
    | (Google Translate API)      |
    +-----------------------------+

- **Translation Service:** Automatically translates English FAQs to Hindi and Bengali.
- **Caching:** Redis caches generated translations for optimal performance.
- **Admin Panel:** Provides a user-friendly interface to create, read, update, and delete FAQs.

## Contributing

1. Fork the repository.
2. Create a feature branch:
git checkout -b feat/new-feature
3. Commit your changes:
git commit -am 'Add new feature'
4. Push your branch:
git push origin feat/new-feature

## Additional Information

- **Backend:**  
The Express backend handles translation and caching. You can test its API endpoints using the provided curl commands.

- **Frontend Admin Panel:**  
A React-based interface exists for managing FAQs via CRUD operations. (Note that while it offers convenient UI-based operations, API testing via curl is the preferred method for this documentation.)

- **Docker:**  
Use Docker Compose to quickly spin up the entire backend stack (Express, MongoDB, Redis).

---

This README provides step-by-step instructions to run the project from scratch, explains the API endpoints and how to interact with them using curl, and gives an overview of the system architecture. Feel free to modify this documentation to better suit your project details.
