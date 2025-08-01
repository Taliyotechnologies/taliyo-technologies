# MongoDB Setup Instructions

## For Render Deployment

Your website is now configured to run without MongoDB, but to enable full functionality (contact forms, blog, analytics), you'll need to set up MongoDB.

### Option 1: MongoDB Atlas (Recommended - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Create a database user
5. Get your connection string
6. In Render dashboard, go to your backend service
7. Add environment variable:
   - Key: `MONGO_URI`
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Option 2: Render MongoDB (Paid)

1. In Render dashboard, create a new MongoDB service
2. Copy the connection string
3. Add it as `MONGO_URI` environment variable in your backend service

### Environment Variables to Set in Render

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
JWT_SECRET=your_secret_key_here
```

### Features Available Without MongoDB

- ✅ Website loads and displays
- ✅ All static content works
- ✅ Navigation works
- ✅ UI/UX remains unchanged

### Features That Need MongoDB

- ❌ Contact form submissions
- ❌ Blog functionality
- ❌ Newsletter subscriptions
- ❌ Analytics tracking

The website will show appropriate messages when these features are accessed without MongoDB configured. 