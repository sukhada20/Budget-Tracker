# Product Requirements Document: Full-Stack Budget Tracker

## 1. Project Overview
A comprehensive full-stack Budget Tracker web application designed to help users manage their finances. The application allows users to register, log in, track incomes and expenses, set monthly budgets, and view their financial status through a dashboard.

## 2. Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6), Fetch API
- **Backend**: Node.js, Express.js
- **Authentication**: JWT, bcrypt
- **Database**: MongoDB Atlas, Mongoose ODM

## 3. Functional Requirements

### 3.1 Authentication
- **Registration**: Users can create an account with email and password.
- **Login**: Users can authenticate to receive a JWT access token.
- **Security**: Passwords must be hashed using bcrypt. API routes must be protected using JWT middleware.

### 3.2 Income Management
- **Add Income**: Record new income sources with amount, source, and date.
- **View Income**: Retrieve a list of all recorded incomes.
- **Delete Income**: Remove specific income records.

### 3.3 Expense Management
- **Add Expense**: Record new expenses with amount, category, description, and date.
- **View Expenses**: Retrieve a list of all recorded expenses.
- **Edit Expense**: Update details of existing expense records.
- **Delete Expense**: Remove specific expense records.

### 3.4 Budget Management
- **Set Budget**: Define a monthly spending limit.
- **View Budget**: Check the current budget and compare against total expenses.

### 3.5 Dashboard
- **Summary Cards**: Show Total Income, Total Expenses, and Remaining Balance.
- **Categorized Summary**: Visual or textual summary of expenses by category.

## 4. Non-Functional Requirements
- **Performance**: Fast API response times and efficient DOM updates.
- **Responsiveness**: UI should adapt to different screen sizes.
- **Code Quality**: Clean, modular, and well-commented code. Standard folder structure.
- **Reliability**: Proper error handling for API requests and authentication failures.

## 5. API Overview
### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Income
- `POST /api/income`
- `GET /api/income`
- `DELETE /api/income/:id`

### Expense
- `POST /api/expense`
- `GET /api/expense`
- `PUT /api/expense/:id`
- `DELETE /api/expense/:id`

### Budget
- `POST /api/budget`
- `GET /api/budget`
