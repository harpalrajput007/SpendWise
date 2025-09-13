# 💰 SpendWise - Personal Finance Tracker

A modern, full-stack MERN application for comprehensive personal finance management with professional UI and advanced features.

## ✨ Features

### 🔐 Authentication System
- User registration and login with validation
- Protected routes and persistent sessions
- Secure user data isolation

### 📊 Professional Dashboard
- Real-time financial overview with charts
- Income vs expenses visualization
- Category-wise expense breakdown
- Recent transactions display
- Auto-refreshing data

### 💸 Expense Tracking
- Add, edit, and delete transactions via modals
- 16+ expense categories (Food, Transport, Bills, etc.)
- Advanced search and filtering
- Date range filtering
- Real-time updates

### 📱 Modern UI/UX
- Fully responsive design (mobile-first)
- Professional green/white theme
- Smooth animations and transitions
- Mobile-friendly navigation
- Modal-based interactions

## 🛠 Tech Stack

- **Frontend**: React 18, React Router, Axios, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js, Mongoose ODM
- **Database**: MongoDB Atlas
- **Charts**: Recharts library
- **Styling**: Tailwind CSS with custom animations

## 📁 Project Structure

```
SpendWise/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Authentication context
│   │   ├── pages/         # Page components
│   │   └── ...
│   ├── package.json
│   └── .env
├── backend/           # Node.js backend API
│   ├── src/
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── server.js      # Main server file
│   ├── package.json
│   └── .env
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd SpendWise
   ```

2. **Setup Backend:**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI
   npm run dev
   ```

3. **Setup Frontend (new terminal):**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/spendwise
PORT=5000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📡 API Documentation

### Base URL: `http://localhost:5000/api`

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | User registration |
| POST | `/auth/login` | User login |

### Transaction Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | Fetch all user transactions |
| GET | `/transactions/:id` | Fetch single transaction |
| POST | `/transactions` | Create new transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |

### Request/Response Examples

**Register User:**
```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Add Transaction:**
```json
POST /api/transactions
{
  "title": "Grocery Shopping",
  "amount": -50.25,
  "date": "2024-01-15",
  "category": "Food",
  "userId": "user_id_here"
}
```

## 🎯 Key Features Explained

### Modal-Based UI
- **Add Transaction Modal**: Quick expense entry
- **Add Income Modal**: Simplified income tracking
- **Edit Modal**: In-place transaction editing
- **Delete Confirmation**: Safe transaction removal

### Advanced Filtering
- **Search**: Filter by transaction title/category
- **Category Filter**: Filter by expense categories
- **Date Range**: Filter by custom date ranges
- **Real-time Results**: Instant filter updates

### Professional Dashboard
- **Summary Cards**: Income, expenses, and balance
- **Bar Charts**: Income vs expenses comparison
- **Pie Charts**: Category-wise expense breakdown
- **Recent Activity**: Last 5 transactions

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- **Desktop**: Full-featured experience
- **Tablet**: Optimized layout and touch interactions
- **Mobile**: Hamburger menu and touch-friendly interface

## 🔒 Security Features

- **Input Validation**: Server-side validation for all inputs
- **User Isolation**: Each user sees only their own data
- **Protected Routes**: Authentication required for sensitive pages
- **Error Handling**: Graceful error messages and fallbacks

## 🧪 Testing the Application

1. **Register** a new account
2. **Add Income** via dashboard modal
3. **Add Expenses** via finance tracker
4. **Edit/Delete** transactions using action buttons
5. **Filter** transactions by category or date
6. **Search** for specific transactions
7. **Test Mobile View** by resizing browser

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
# Set environment variables
MONGODB_URI=your_production_mongodb_uri
PORT=5000

# Deploy backend
npm run start
```

### Frontend Deployment (Vercel/Netlify)
```bash
# Build for production
npm run build

# Set environment variable
VITE_API_URL=https://your-backend-url.com/api
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Amazon Q AI Assistant** for development guidance
- **Tailwind CSS** for beautiful styling
- **Recharts** for interactive charts
- **MongoDB Atlas** for database hosting

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

---

**Built with ❤️ for better financial management**