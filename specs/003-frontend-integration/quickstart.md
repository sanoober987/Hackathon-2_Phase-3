# Quickstart Guide: Frontend Integration

## Overview
This guide provides step-by-step instructions to set up and run the Next.js frontend for the todo application with secure backend integration.

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Access to the backend API (from Specs 1 and 2)
- Better Auth configured with shared secrets

## Setup Instructions

### 1. Clone and Navigate
```bash
# If this is part of a monorepo, navigate to the project directory
cd /path/to/project
```

### 2. Install Dependencies
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
# or
yarn install
```

### 3. Environment Configuration
Copy the environment template and configure your settings:

```bash
cp .env.example .env.local
```

Update the `.env.local` file with your specific configuration:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000

# Better Auth configuration
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=your-32-character-secret-here
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

The frontend will be available at `http://localhost:3000`.

## Key Features

### Authentication
- User authentication is handled by Better Auth
- Protected routes are accessible only to authenticated users
- JWT tokens are automatically managed

### Task Management
- Create, read, update, and delete tasks
- Toggle task completion status
- Real-time updates using SWR/React Query

### Responsive Design
- Mobile-first responsive layout
- Adapts to mobile, tablet, and desktop screens
- Touch-friendly interface elements

## API Integration
The frontend connects to the backend API with automatic JWT token handling:

```typescript
// Example API call with JWT token automatically attached
const response = await fetch('/api/tasks', {
  headers: {
    'Authorization': `Bearer ${jwtToken}`,
    'Content-Type': 'application/json',
  },
});
```

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Run tests
npm test

# Lint code
npm run lint
```

## Troubleshooting

### Common Issues

1. **API Connection Errors**
   - Verify backend is running at the configured URL
   - Check that environment variables are properly set

2. **Authentication Problems**
   - Ensure Better Auth is properly configured
   - Verify JWT secret is shared between frontend and backend

3. **Environment Variables Missing**
   - Make sure `.env.local` contains all required variables
   - Restart development server after changing environment variables

## Next Steps
- Customize the UI components in `components/`
- Add additional features as needed
- Set up testing with Jest and React Testing Library
- Configure deployment settings