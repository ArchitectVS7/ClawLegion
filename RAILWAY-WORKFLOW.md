# Railway Deployment Workflow

**Applies to all projects: GitHub → Railway → Chrome verification**

## Standard Deployment Cycle

### 1. Repository Setup
- Clone repo to `~/GitHub/<repo-name>`
- All repositories live in `~/GitHub/` for organization

### 2. Deployment Verification
- Check Railway architecture page: both frontend + backend should show "deployed"
- Get frontend URL from Railway architecture settings

### 3. Browser Testing
- Open frontend URL in browser
- Check for runtime errors (502, 404, JS errors, etc.)

### 4. Error Diagnosis (if needed)
When errors occur:
1. **Railway build logs** - Check deployment console output
2. **Browser console** - Check for JavaScript errors, network failures
3. **Root cause analysis** - Use thinking mode to identify issue

### 5. Fix Loop (Max 5 Iterations)
- Attempt fix based on diagnosis
- Commit change to GitHub
- Wait for Railway auto-deploy
- Re-test in browser
- **Hard limit: 5 attempts max**

### 6. Escalation (After 5 Failed Attempts)
If still broken after 5 tries:
1. **Notify user** via message
2. **Write detailed report** to repository:
   - What was tried
   - Error logs captured
   - Root cause analysis
   - Recommended next steps
3. **Commit report** to repo for persistence

## Current Active Projects

### taskapp-saas-1
- Status: Deployed and active
- Frontend URL: (to be populated)
- Backend URL: (to be populated)

### taskapp-saas-2
- Status: Deployed with 502 error (under investigation)
- Frontend URL: https://adequate-abundance-production-19bc.up.railway.app
- Backend URL: https://lab-projects-production-c7bd.up.railway.app (HEALTHY)
- Repository: https://github.com/ArchitectVS7/lab-projects
- **Mysterious Issue:** Express server running on 0.0.0.0:8080 inside container, but Railway edge returns 502
- Container verified: netstat shows listening on 0.0.0.0:8080, process running, dist files exist

## Commands Reference

```bash
# Railway CLI
railway project list              # List all projects
railway project link              # Link current directory to Railway project
railway status                    # Check deployment status
railway logs                      # Stream logs
railway logs --deployment <id>   # Specific deployment logs

# GitHub workflow
cd ~/GitHub/<repo-name>
git pull
git checkout -b feature/<name>
# ... make changes ...
git add .
git commit -m "description"
git push origin <branch>
# ... create PR, merge ...
```

## Automation Goals
- Monitor Railway deployments for errors
- Auto-diagnose common issues (env vars, build failures, network errors)
- Provide actionable fix recommendations
- Track iteration count to prevent infinite loops
