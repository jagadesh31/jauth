# Docker Setup Guide

This guide explains how to use Docker with the JAuth application.

## 📦 What's Included

### Docker Files Created:
1. **`server/Dockerfile`** - Production-ready Node.js server image
2. **`client/Dockerfile`** - Multi-stage build for React frontend with Nginx
3. **`docker-compose.yml`** - Production Docker Compose configuration
4. **`docker-compose.dev.yml`** - Development Docker Compose (MongoDB & Redis only)
5. **`.dockerignore`** files - Optimize Docker builds

### Services:
- **MongoDB 7.0** - Database with authentication
- **Redis 7-alpine** - Caching and rate limiting
- **Node.js Server** - Express backend
- **Nginx** - Frontend web server

## 🚀 Quick Start

### Production Setup

1. **Create environment file for server:**
   ```bash
   # Create server/.env file
   cp server/.env.example server/.env
   # Edit and update with your values
   ```

2. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes (clean slate):**
   ```bash
   docker-compose down -v
   ```

### Development Setup

For local development with hot reload:

1. **Start only MongoDB and Redis:**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

2. **Run server locally:**
   ```bash
   cd server
   npm install
   npm start
   ```

3. **Run client locally:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🔧 Configuration

### Environment Variables

#### Server (.env)
```env
NODE_ENV=production
PORT=5001
MONGO_URL=mongodb://admin:changeme@mongodb:27017/jauth?authSource=admin
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=changeme
ACCESS_SECRET=your-secret-key-here
REFRESH_SECRET=your-refresh-secret-here
CLIENT_BASE_URL=http://localhost
SERVER_BASE_URL=http://localhost:5001
```

#### Docker Compose Variables
You can override these in `docker-compose.yml` or use a `.env` file in the root:
```env
MONGO_ROOT_USERNAME=admin
MONGO_ROOT_PASSWORD=changeme
MONGO_DATABASE=jauth
REDIS_PASSWORD=changeme
```

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 80 | http://localhost |
| Backend | 5001 | http://localhost:5001 |
| MongoDB | 27017 | mongodb://localhost:27017 |
| Redis | 6379 | redis://localhost:6379 |

## 🛠️ Docker Commands

### Build Images
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build server
docker-compose build client
```

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f mongodb
```

### Execute Commands in Containers
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p changeme

# Access Redis CLI
docker-compose exec redis redis-cli -a changeme

# Access server container
docker-compose exec server sh
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart server
```

## 🔍 Health Checks

All services include health checks:

```bash
# Check service health
docker-compose ps

# Manual health check
curl http://localhost:5001/health
curl http://localhost/health
```

## 💾 Data Persistence

Data is persisted in Docker volumes:
- `mongodb_data` - MongoDB database files
- `mongodb_config` - MongoDB configuration
- `redis_data` - Redis data and AOF logs

### Backup MongoDB
```bash
docker-compose exec mongodb mongodump --out /data/backup
```

### Restore MongoDB
```bash
docker-compose exec mongodb mongorestore /data/backup
```

## 🐛 Troubleshooting

### Services won't start
```bash
# Check logs
docker-compose logs

# Check if ports are in use
netstat -an | grep 5001
netstat -an | grep 27017
netstat -an | grep 6379
```

### MongoDB connection issues
- Verify credentials in `.env` match docker-compose.yml
- Check MongoDB logs: `docker-compose logs mongodb`
- Ensure MongoDB is healthy: `docker-compose ps`

### Redis connection issues
- Verify password matches in `.env` and docker-compose.yml
- Check Redis logs: `docker-compose logs redis`
- Test connection: `docker-compose exec redis redis-cli -a changeme ping`

### Server won't connect to services
- Ensure services are on the same network (`jauth-network`)
- Use service names as hostnames (mongodb, redis)
- Check environment variables are set correctly

### Rebuild after code changes
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

## 🔐 Security Notes

⚠️ **Important for Production:**

1. **Change default passwords:**
   - MongoDB root password
   - Redis password
   - JWT secrets

2. **Use Docker secrets** for sensitive data in production

3. **Enable HTTPS** - Update nginx config for SSL

4. **Network security** - Don't expose MongoDB/Redis ports publicly

5. **Environment variables** - Never commit `.env` files

## 📈 Performance Tuning

### MongoDB
- Adjust memory limits in docker-compose.yml
- Configure replica sets for production

### Redis
- Adjust maxmemory policy
- Configure persistence options

### Nginx
- Adjust worker processes
- Configure caching strategies

## 🎯 Next Steps

1. Set up proper environment variables
2. Configure SSL/TLS certificates
3. Set up monitoring (Prometheus, Grafana)
4. Configure backups
5. Set up CI/CD pipeline
6. Add health check endpoints
7. Configure log aggregation
