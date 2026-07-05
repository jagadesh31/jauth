# JAuth - OAuth2 Authentication Service

A modern OAuth2 authentication service built with Node.js, Express, React, MongoDB, and Redis.

## 🚀 Features

- OAuth2 Authorization Code Flow
- User Registration and Authentication
- JWT-based Access and Refresh Tokens
- Redis for Caching and Rate Limiting
- MongoDB for Data Persistence
- Docker Support with Docker Compose
- Modern React Frontend with Vite

## 📋 Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- npm or yarn

## 🐳 Quick Start with Docker

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd jauth
   ```

2. **Create environment files**
   
   Create `server/.env`:
   ```env
   NODE_ENV=production
   PORT=5001
   MONGO_URL=mongodb://admin:changeme@mongodb:27017/jauth?authSource=admin
   REDIS_HOST=redis
   REDIS_PORT=6379
   REDIS_PASSWORD=changeme
   ACCESS_SECRET=your-access-secret-key-change-this
   REFRESH_SECRET=your-refresh-secret-key-change-this
   CLIENT_BASE_URL=http://localhost
   SERVER_BASE_URL=http://localhost:5001
   ```

3. **Build and start services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost
   - Backend API: http://localhost:5001
   - Health Check: http://localhost:5001/health

## 💻 Local Development

### Backend Setup

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   NODE_ENV=development
   PORT=5001
   MONGO_URL=mongodb://localhost:27017/jauth
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ACCESS_SECRET=your-access-secret-key
   REFRESH_SECRET=your-refresh-secret-key
   CLIENT_BASE_URL=http://localhost:5173
   SERVER_BASE_URL=http://localhost:5001
   ```

4. **Start MongoDB and Redis** (using Docker)
   ```bash
   docker-compose up mongodb redis -d
   ```

5. **Start the server**
   ```bash
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```env
   VITE_API_BASE_URL=http://localhost:5001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
jauth/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts
│   │   ├── pages/         # Page components
│   │   └── Routes/        # Route components
│   ├── Dockerfile
│   └── package.json
├── server/                 # Express backend
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── utils/             # Utility functions
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml      # Docker Compose configuration
└── README.md
```

## 🔧 Environment Variables

### Server Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5001` |
| `MONGO_URL` | MongoDB connection string | - |
| `REDIS_HOST` | Redis host | `localhost` |
| `REDIS_PORT` | Redis port | `6379` |
| `REDIS_PASSWORD` | Redis password | - |
| `ACCESS_SECRET` | JWT access token secret | - |
| `REFRESH_SECRET` | JWT refresh token secret | - |
| `CLIENT_BASE_URL` | Frontend URL | - |
| `SERVER_BASE_URL` | Backend URL | - |

## 🐳 Docker Services

The `docker-compose.yml` includes:

- **mongodb**: MongoDB 7.0 database
- **redis**: Redis 7-alpine cache
- **server**: Node.js backend service
- **client**: Nginx frontend service

## 📡 API Endpoints

### Authentication
- `POST /user/register` - Register new user
- `POST /user/login` - Login user
- `POST /user/logout` - Logout user
- `GET /user/info` - Get user information

### OAuth2
- `GET /oauth/authorize` - Authorize application
- `GET /oauth/getCode` - Get authorization code
- `POST /oauth/getToken` - Exchange code for token
- `GET /oauth/getUser` - Get user info with token

### Health
- `GET /health` - Health check endpoint

## 🔐 Security Features

- JWT-based authentication
- HttpOnly cookies for token storage
- Rate limiting with Redis
- CORS protection
- Input validation
- Password hashing with bcrypt

## 🛠️ Development

### Running Tests
```bash
# Add tests when implemented
npm test
```

### Building for Production
```bash
# Backend
cd server
npm install --production

# Frontend
cd client
npm run build
```

## 📝 License

ISC

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Documentation

See [IMPROVEMENTS.md](./IMPROVEMENTS.md) for detailed improvement suggestions and best practices.
