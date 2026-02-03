# Full-Stack Budget Tracker

A complete Budget Tracker application using the MERN stack (MongoDB, Express, React-concept-but-Vanilla-JS, Node).

## Features
- **User Authentication**: Secure Login/Register with JWT.
- **Budget Management**: Set monthly limits.
- **Income & Expense Tracking**: Add, view, delete records.
- **Dashboard**: Visual summary of your finances.

## Project Structure
- `backend/`: Node.js/Express API
- `frontend/`: HTML/CSS/JS Client

## Prequisites
- Node.js installed
- MongoDB Atlas Account (URI required)

## Installation & Run

1.  **Backend Setup**
    ```bash
    cd backend
    npm install
    cp ../.env.example .env
    # Edit .env with your MongoDB URI
    node server.js
    ```

2.  **Frontend Setup**
    - The frontend is static. You can serve it using `live-server` or simply open `frontend/index.html` in your browser (though for API calls to work properly, ensure CORS is enabled or use a local server proxy, or easier: just open the file and ensure backend allows CORS for `null` origin or localhost).
    - Recommended: Use VS Code "Live Server" extension on `frontend/index.html`.

## Configuration
See `.env.example` in the backend folder.
