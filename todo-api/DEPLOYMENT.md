# Deployment Guide

## Quick Start

### Local Development
```bash
npm install
npm run dev
```

### Production
```bash
npm install --production
NODE_ENV=production PORT=3000 npm start
```

## Environment Variables

Required:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)
- `DB_PATH` - SQLite database path (default: ./data/todos.db)

Optional:
- `ALLOWED_ORIGINS` - Comma-separated CORS origins (default: *)

## Production Considerations

### 1. Process Management
Use PM2 for process management:
```bash
npm install -g pm2
pm2 start src/server.js --name todo-api
pm2 save
pm2 startup
```

### 2. Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### 3. SSL/TLS
Use Let's Encrypt with Certbot:
```bash
sudo certbot --nginx -d api.yourdomain.com
```

### 4. Database Backups
```bash
# Daily backup script
#!/bin/bash
cp data/todos.db "backups/todos-$(date +%Y%m%d-%H%M%S).db"
find backups/ -type f -mtime +30 -delete
```

### 5. Monitoring
- Use PM2 monitoring: `pm2 monit`
- Set up logging with Winston
- Configure error tracking (Sentry, etc.)

### 6. Rate Limiting
Add express-rate-limit:
```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 7. Authentication
Add JWT authentication for production:
```javascript
const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

app.use('/api/todos', authenticate, todoRoutes);
```

### 8. Database Migration
For production, consider PostgreSQL:
```bash
npm install pg
# Update database.js to use PostgreSQL connection
```

## Docker Deployment

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_PATH=/data/todos.db
    volumes:
      - ./data:/data
    restart: unless-stopped
```

## Security Hardening

1. ✅ Helmet.js enabled (security headers)
2. ✅ CORS configured
3. ✅ Input validation and sanitization
4. ✅ SQL injection prevention (parameterized queries)
5. ⚠️ Add rate limiting
6. ⚠️ Add authentication/authorization
7. ⚠️ Enable HTTPS only
8. ⚠️ Add request logging
9. ⚠️ Implement API versioning

## Performance Optimization

1. Enable gzip compression
2. Add caching headers
3. Implement database indexing (✅ already done)
4. Use connection pooling for database
5. Consider Redis for caching
6. Optimize query performance

## Monitoring & Logging

### Winston Logger Setup
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### Health Monitoring
- Already implemented: `/health` endpoint
- Consider adding `/metrics` for Prometheus
- Monitor database connection health

## Troubleshooting

### Port Already in Use
```bash
lsof -ti:3000 | xargs kill -9
```

### Database Locked
```bash
rm data/todos.db-journal
```

### Memory Issues
```bash
pm2 restart todo-api
pm2 logs --lines 100
```

## Scaling

### Horizontal Scaling
- Use load balancer (nginx, HAProxy)
- Implement sticky sessions if needed
- Consider PostgreSQL for shared state

### Vertical Scaling
- Increase Node.js memory: `NODE_OPTIONS=--max-old-space-size=4096`
- Optimize queries and indexing

