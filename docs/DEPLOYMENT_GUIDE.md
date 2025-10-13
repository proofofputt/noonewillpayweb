# Production Deployment Guide
## No One Will Pay Platform

---

## 🚀 Pre-Deployment Checklist

### Critical Environment Variables
Ensure these are set in Vercel dashboard:

```bash
# Database
DATABASE_URL=postgresql://[user]:[password]@[host]/neonewillpay?sslmode=require

# Security
JWT_SECRET=[64+ character random string]

# Application URLs
NEXT_PUBLIC_WEB_URL=https://noonewillpayweb.vercel.app
NEXT_PUBLIC_GITBOOK_URL=https://docs.noonewillpay.com

# Optional: Disable for production
DISABLE_IP_BLOCKING=false  # Set to false or remove
```

### Security Pre-Flight
- [ ] JWT_SECRET is unique and secure (64+ chars)
- [ ] DATABASE_URL uses SSL (`?sslmode=require`)
- [ ] DISABLE_IP_BLOCKING is false or unset
- [ ] No secrets in git history
- [ ] .env file is in .gitignore

---

## 📦 Vercel Deployment Steps

### 1. Connect Repository
```bash
# Via Vercel Dashboard:
1. Go to https://vercel.com/new
2. Import Git Repository
3. Select: proofofputt/noonewillpayweb
4. Framework Preset: Next.js
5. Root Directory: ./
```

### 2. Configure Build Settings
```bash
Build Command: npm run build
Output Directory: .next
Install Command: npm install
Node Version: 18.x or higher
```

### 3. Environment Variables
Add in Vercel Dashboard → Settings → Environment Variables:
- Copy from .env.example
- Generate new JWT_SECRET: `openssl rand -base64 64`
- Add DATABASE_URL from NeonDB
- Set NEXT_PUBLIC_WEB_URL to your production domain

### 4. Deploy
```bash
# First deployment
Click "Deploy"

# Future deployments (automatic)
git push origin main
```

---

## 🗄️ NeonDB Setup

### 1. Create Database
```bash
1. Go to https://console.neon.tech
2. Create new project: "noonewillpay-prod"
3. Region: US East (closest to Vercel)
4. Copy connection string
```

### 2. Run Migrations
```bash
# Locally (with prod DATABASE_URL in .env)
npm run db:push

# Verify tables created
psql $DATABASE_URL -c "\dt"
```

### 3. Verify Indexes
```sql
-- Check indexes are created
SELECT schemaname, tablename, indexname
FROM pg_indexes
WHERE tablename = 'survey_responses';

-- Should see:
-- idx_survey_phone
-- idx_survey_ip
-- idx_survey_timestamp
-- idx_survey_region_timestamp
```

---

## 🔐 Security Configuration

### Vercel Settings
**Dashboard → Settings → Security**

1. **Deployment Protection**
   - Enable: "Deployment Protection for Preview Deployments"
   - Password protect preview branches

2. **Environment Variables**
   - Production only: JWT_SECRET, DATABASE_URL
   - Preview: Use separate test database

3. **Attack Challenge Mode**
   - Enable DDoS protection (automatic)
   - Enable Bot Protection (Pro plan)

### Spending Limits
**Dashboard → Settings → Billing**

```bash
Set spending limits:
- Maximum: $300/month
- Alert at: $100, $200
- Email notifications: ON
```

---

## 📊 Monitoring Setup

### 1. Vercel Analytics (Included)
```bash
Dashboard → Analytics → Enable
- Web Vitals tracking
- Real User Monitoring
- Page performance
```

### 2. Health Check Monitoring
```bash
# Use UptimeRobot (free) or similar
Endpoint: https://noonewillpayweb.vercel.app/api/health
Interval: 5 minutes
Alert: Email/SMS on 503 status
```

### 3. Log Monitoring
```bash
# Vercel Logs
Dashboard → Deployments → [deployment] → Logs

# Filter for errors:
level:error

# Filter for rate limiting:
status:429
```

---

## 🧪 Post-Deployment Testing

### 1. Smoke Tests
```bash
# Health check
curl https://noonewillpayweb.vercel.app/api/health

# Expected: {"status":"healthy","timestamp":"..."}
```

### 2. Rate Limiting Test
```bash
# Should get 429 after 5 requests
for i in {1..10}; do
  curl -X POST https://noonewillpayweb.vercel.app/api/submit-survey \
    -H "Content-Type: application/json" \
    -d '{"phone":"5555555555","questions":[],"timestamp":"2025-01-01"}'
done
```

### 3. Duplicate Prevention Test
```bash
# Submit survey twice with same phone
# Second attempt should return 409 Conflict
```

### 4. Security Headers Test
```bash
curl -I https://noonewillpayweb.vercel.app

# Should see:
# x-frame-options: DENY
# x-content-type-options: nosniff
# referrer-policy: origin-when-cross-origin
```

---

## 📈 Performance Optimization

### Edge Caching
Vercel automatically caches static assets. For API routes:

```typescript
// In API routes that can be cached
export const runtime = 'edge'
export const revalidate = 60 // Cache for 60 seconds
```

### Database Query Optimization
```sql
-- Monitor slow queries in NeonDB dashboard
-- Queries should be < 50ms with indexes

-- Example analytics query (optimized with index)
SELECT region, COUNT(*) as total
FROM survey_responses
WHERE timestamp > NOW() - INTERVAL '7 days'
GROUP BY region;
```

---

## 🚨 Incident Response

### High Error Rate
```bash
1. Check Vercel logs: Dashboard → Logs
2. Check NeonDB status: console.neon.tech/status
3. Check health endpoint: /api/health
4. Rollback if needed: Dashboard → Deployments → [previous] → Promote
```

### DDoS Attack
```bash
1. Monitor rate limiting: Check for 429 responses
2. If overwhelmed:
   - Lower rate limits in middleware.ts
   - Enable Cloudflare (if configured)
   - Contact Vercel support

3. Emergency: Disable API temporarily
   - Add maintenance page
   - Return 503 from middleware
```

### Database Connection Issues
```bash
1. Check NeonDB connection limit (max 10 for free tier)
2. Monitor active connections:
   SELECT count(*) FROM pg_stat_activity;
3. Increase connection pool if needed (upgrade plan)
```

---

## 🔄 Rollback Procedure

### Quick Rollback (< 5 minutes)
```bash
1. Go to Vercel Dashboard → Deployments
2. Find last working deployment
3. Click ... → Promote to Production
4. Verify: curl https://noonewillpayweb.vercel.app/api/health
```

### Database Rollback
```bash
# NeonDB doesn't support instant rollback
# Use daily backups (manual process)

1. Go to NeonDB console
2. Create new branch from yesterday
3. Update DATABASE_URL in Vercel
4. Redeploy
```

---

## 📋 Maintenance Windows

### Weekly Tasks
- [ ] Review error logs
- [ ] Check database size (< 3GB for free tier)
- [ ] Monitor rate limit effectiveness
- [ ] Review security alerts

### Monthly Tasks
- [ ] Update dependencies: `npm audit fix`
- [ ] Review spending vs. budget
- [ ] Database cleanup: Archive old surveys
- [ ] Load testing

### Quarterly Tasks
- [ ] Security audit
- [ ] Performance review
- [ ] Cost optimization review
- [ ] Backup testing

---

## 💰 Cost Monitoring

### Current Setup (Minimal)
```
Vercel Pro: $20/month
NeonDB Scale: $19/month
Total: $39/month
```

### Traffic Thresholds
```
Free tier limits:
- Vercel: 100GB bandwidth
- NeonDB: 0.25 CPU, 3GB storage

Upgrade triggers:
- > 1000 surveys/day → NeonDB Pro ($69)
- > 100 concurrent users → Vercel Enterprise
- > 10K daily API calls → Consider caching
```

### Cost Alerts
Set up in Vercel Dashboard:
- Email at 50% budget ($20)
- Email at 80% budget ($32)
- Hard limit at 150% ($60)

---

## 🔧 Troubleshooting

### Build Failures
```bash
# Common issues
1. TypeScript errors → Run `npm run build` locally
2. Missing env vars → Check Vercel dashboard
3. Dependency conflicts → Delete node_modules, reinstall
```

### API Timeouts
```bash
# Vercel Functions timeout: 10s (Hobby), 60s (Pro)
# If queries exceed:
1. Add database indexes
2. Optimize N+1 queries
3. Add caching layer
```

### Rate Limiting Too Aggressive
```bash
# Adjust in middleware.ts
const MAX_REQUESTS_PER_WINDOW = {
  '/api/submit-survey': 10, // Increase from 5
  default: 200, // Increase from 100
}

# Redeploy
git commit -am "Adjust rate limits"
git push
```

---

## 📞 Support Contacts

| Service | Support | Response Time |
|---------|---------|---------------|
| Vercel | support@vercel.com | 24 hours (Pro) |
| NeonDB | support@neon.tech | 48 hours |
| GitHub | https://support.github.com | 24 hours |

---

## ✅ Production Checklist

Before announcing launch:

- [ ] All environment variables set in Vercel
- [ ] Database migrations applied
- [ ] Indexes created and verified
- [ ] Health check endpoint responding
- [ ] Rate limiting tested
- [ ] Duplicate prevention tested
- [ ] Security headers verified
- [ ] Spending alerts configured
- [ ] Monitoring enabled
- [ ] Backup strategy documented
- [ ] Incident response plan reviewed
- [ ] Team has access to Vercel/NeonDB dashboards

---

*Last Updated: January 2025*
*For internal use - DevOps team*
