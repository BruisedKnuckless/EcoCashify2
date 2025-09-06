# EcoFinds - Vercel Deployment Guide

This guide will help you deploy the EcoFinds marketplace to Vercel.

## Prerequisites

1. A Vercel account (free at [vercel.com](https://vercel.com))
2. Git repository (GitHub, GitLab, or Bitbucket)
3. Node.js installed locally (for testing)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the project structure
5. Configure the following settings:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (root of the project)
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/build`

#### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? (select your account)
   - Link to existing project? `N`
   - Project name: `ecofinds` (or your preferred name)
   - Directory: `./`
   - Override settings? `N`

### 3. Environment Variables

Set the following environment variables in your Vercel project:

1. Go to your project dashboard on Vercel
2. Navigate to Settings > Environment Variables
3. Add the following variables:

```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=production
```

### 4. Configure Build Settings

In your Vercel project settings:

1. Go to Settings > General
2. Set the following:
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm run install-all`

### 5. Domain Configuration (Optional)

- Vercel will provide a free domain like `your-project.vercel.app`
- You can add a custom domain in Settings > Domains

## Project Structure for Vercel

```
ecofinds/
├── client/                 # React frontend
│   ├── build/             # Built files (generated)
│   ├── public/
│   ├── src/
│   └── package.json
├── server/
│   └── api/               # Vercel serverless functions
│       ├── auth/
│       ├── products/
│       └── ...
├── vercel.json            # Vercel configuration
├── package.json           # Root package.json
└── .vercelignore
```

## API Endpoints

The following API endpoints will be available:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/categories` - Get categories
- `GET /api/products` - Get products
- `POST /api/products` - Create product
- `GET /api/products/[id]` - Get single product
- `PUT /api/products/[id]` - Update product
- `DELETE /api/products/[id]` - Delete product
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/chat` - Get chat history
- `POST /api/chat` - Send chat message

## Testing the Deployment

1. Visit your Vercel URL
2. Test the following features:
   - User registration and login
   - Product browsing and search
   - Adding products to cart
   - Creating new products (when logged in)
   - Chat functionality

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check that all dependencies are in package.json
   - Ensure Node.js version is compatible (18.x recommended)

2. **API Routes Not Working**
   - Verify vercel.json configuration
   - Check that serverless functions are in the correct directory structure

3. **Client-Side Routing Issues**
   - Ensure _redirects file is in client/public/
   - Check that vercel.json has proper routing configuration

4. **Environment Variables Not Working**
   - Verify variables are set in Vercel dashboard
   - Check that variable names match exactly

### Debugging

1. Check Vercel function logs in the dashboard
2. Use browser developer tools to inspect network requests
3. Test API endpoints directly using tools like Postman

## Production Considerations

1. **Database**: Currently uses in-memory storage. For production, consider:
   - Vercel Postgres
   - PlanetScale
   - Supabase
   - MongoDB Atlas

2. **Security**:
   - Use strong JWT secrets
   - Implement rate limiting
   - Add input validation
   - Use HTTPS (automatic with Vercel)

3. **Performance**:
   - Enable Vercel Analytics
   - Optimize images
   - Use CDN (automatic with Vercel)

## Support

If you encounter issues:

1. Check Vercel documentation
2. Review the project logs
3. Test locally first with `npm run dev`
4. Check the GitHub repository for updates

## Next Steps

After successful deployment:

1. Set up a custom domain
2. Configure analytics
3. Set up monitoring
4. Plan for database migration
5. Implement additional features

Happy deploying! 🚀
