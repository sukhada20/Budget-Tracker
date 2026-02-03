# Project To-Do List

## Development Checklist

### Backend Milestones
- [ ] **Setup**
    - [ ] Initialize `package.json`
    - [ ] Create `server.js` foundation
    - [ ] Configure `dotenv` and create `.env.example`
- [ ] **Database**
    - [ ] Connect to MongoDB Atlas in `config/db.js`
    - [ ] Define Mongoose Models: `User`, `Income`, `Expense`, `Budget`
- [ ] **Authentication**
    - [ ] Implement `authController` (register, login)
    - [ ] Create `authMiddleware` for JWT verification
    - [ ] Setup `authRoutes`
- [ ] **API Logic**
    - [ ] Implement `incomeController` & `incomeRoutes` (CRUD)
    - [ ] Implement `expenseController` & `expenseRoutes` (CRUD)
    - [ ] Implement `budgetController` & `budgetRoutes` (Get/Set)

### Frontend Milestones
- [ ] **UI Structure**
    - [ ] Create `index.html` (Main Dashboard)
    - [ ] Create `login.html` & `register.html`
    - [ ] Design comprehensive `css/styles.css`
- [ ] **Client Logic**
    - [ ] `js/api.js`: Handle Fetch requests and token management
    - [ ] `js/auth.js`: Handle registration/login forms and redirection
    - [ ] `js/dashboard.js`: Fetch data, render UI, handle user interactions

### Testing Checklist
- [ ] **Auth**: Verify register/login flows, token storage, and protected route access.
- [ ] **Features**: Verify adding/deleting income and expenses updates the dashboard correctly.
- [ ] **Validation**: Ensure invalid inputs are handled gracefully on both client and server.

### Deployment Preparation Steps
- [ ] Ensure MongoDB connection string is configurable via env.
- [ ] Verify `npm start` runs the server correctly.
- [ ] Check that all static files are served correctly for the frontend.
