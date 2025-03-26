# Parent Pearl - Educational Task Management System

Parent Pearl is an educational platform that helps parents manage their children's learning tasks and rewards. The system allows parents to create educational tasks, track progress, and reward children for their achievements.

## 🚀 Features

- 👨‍👩‍👧‍👦 User Management (Parents & Children)
- 📚 Educational Task Creation and Management
- 🎯 Progress Tracking
- 🏆 Points and Rewards System
- 📊 Performance Analytics
- 🔐 Secure Authentication

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot 3.x
- PostgreSQL
- JWT Authentication
- Maven

### Frontend
- Angular 17
- Angular Material
- TailwindCSS
- NgRx for state management

## 🏃‍♂️ Getting Started

### Prerequisites
- Java JDK 17+
- Node.js 18+
- PostgreSQL 15+
- Maven 3.8+

### Backend Setup

1. **Clone the repository**

git clone https://github.com/yourusername/parent-pearl.git

2. **Navigate to the backend directory**

cd parent-pearl/backend


3. **Configure Database**

Create a PostgreSQL database named `parentpearl` and update the database credentials in `application.properties`.
spring:
datasource:
url: jdbc:postgresql://localhost:5432/parentpearl
username: your_username
password: your_password

4. **Run the application**

mvn spring-boot:run

The backend will be available at `http://localhost:8081`

### Frontend Setup

1. **Navigate to frontend directory**

cd parent-pearl/frontend

2. **Install dependencies**

npm install


The application will be available at `http://localhost:4200`

## 📝 API Documentation

### Authentication Endpoints
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- POST `/api/auth/refresh-token` - Refresh JWT token

### Parent Endpoints
- GET `/api/parents/{id}` - Get parent profile
- PUT `/api/parents/{id}` - Update parent profile
- POST `/api/parents/{parentId}/children` - Add child
- GET `/api/parents/{parentId}/children` - Get parent's children

### Child Endpoints
- GET `/api/children/{childId}/profile` - Get child profile
- GET `/api/children/{childId}/tasks` - Get child's tasks
- GET `/api/children/{childId}/points` - Get child's points

### Task Endpoints
- POST `/api/parents/{parentId}/children/{childId}/tasks` - Create task
- GET `/api/parents/{parentId}/children/{childId}/tasks` - Get tasks
- PUT `/api/parents/{parentId}/children/{childId}/tasks/{taskId}` - Update task

## 👥 User Roles

1. **Parent**
   - Create and manage children accounts
   - Create and assign tasks
   - Monitor progress
   - Award points and rewards

2. **Child**
   - View assigned tasks
   - Complete tasks
   - Earn points
   - Redeem rewards

## 🔒 Security

- JWT-based authentication
- Role-based access control
- Password encryption
- CORS configuration

## 🧪 Testing

### Backend Tests

mvn test

### Frontend Tests

npm test


## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular Material for UI components
- Spring Boot for backend framework
- PostgreSQL for database