# Render Deployment Guide

## Problem Fixed

The original error was:
```
ENOENT: no such file or directory, open '/opt/render/project/src/package.json'
```

This occurred because Render was looking for a `package.json` file in the wrong location and the `render.yaml` configuration was empty.

## Changes Made

### 1. Created Proper `render.yaml` Configuration

The `render.yaml` file now defines two services:

**Frontend Service:**
- Type: Static site
- Build command: `cd frontend && npm install && npm run build`
- Static publish path: `./frontend/dist`
- Environment variables configured for production

**Backend Service:**
- Type: Node.js web service
- Build command: `cd backend && npm install`
- Start command: `cd backend && npm start`
- Port: 10000
- All necessary environment variables configured

### 2. Created Root-Level `package.json`

Added a root-level `package.json` file to help with the deployment process and provide workspace configuration.

### 3. Environment Variables

The following environment variables are configured in `render.yaml`:

**Frontend:**
- `NODE_ENV`: production
- `VITE_API_URL`: https://taliyo-backend.onrender.com
- `VITE_FRONTEND_URL`: https://taliyo-frontend.onrender.com
- `VITE_NODE_ENV`: production

**Backend:**
- `NODE_ENV`: production
- `PORT`: 10000
- `MONGO_URI`: Your MongoDB connection string
- `JWT_SECRET`: Your JWT secret
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password
- `FRONTEND_URL`: https://taliyo-frontend.onrender.com

## Deployment Steps

### 1. Update Environment Variables

Before deploying, update the following environment variables in your Render dashboard:

**Backend Service Environment Variables:**
- `EMAIL_USER`: Your actual Gmail address
- `EMAIL_PASS`: Your actual Gmail app password
- `JWT_SECRET`: A strong, unique secret key

### 2. Deploy to Render

1. Push your changes to GitHub
2. Connect your repository to Render
3. Render will automatically detect the `render.yaml` file and create both services
4. The deployment should now work without the ENOENT error

### 3. Verify Deployment

After deployment, verify:
- Frontend is accessible at: `https://taliyo-frontend.onrender.com`
- Backend is accessible at: `https://taliyo-backend.onrender.com`
- Health check endpoint: `https://taliyo-backend.onrender.com/api/health`

## Troubleshooting

### If you still get errors:

1. **Check Render Logs**: Go to your Render dashboard and check the build logs for any errors
2. **Verify Environment Variables**: Make sure all environment variables are set correctly in Render
3. **Check MongoDB Connection**: Ensure your MongoDB URI is correct and accessible
4. **Verify Port Configuration**: The backend is configured to use port 10000

### Common Issues:

1. **CORS Errors**: The backend is configured to allow requests from the frontend domain
2. **Build Failures**: Make sure all dependencies are properly listed in `package.json` files
3. **Environment Variables**: Double-check that all required environment variables are set in Render

## Security Notes

- Never commit sensitive information like API keys or passwords to your repository
- Use Render's environment variable system for sensitive data
- Consider using Render's secret management features for production deployments

## Next Steps

1. Deploy to Render using the updated configuration
2. Test all functionality after deployment
3. Set up custom domains if needed
4. Configure monitoring and logging
5. Set up automated deployments from your main branch 