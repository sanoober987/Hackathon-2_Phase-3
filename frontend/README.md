# Todo App Frontend

A responsive, secure todo application frontend built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Responsive UI**: Works on mobile, tablet, and desktop devices
- **JWT Authentication**: Secure user authentication with Better Auth
- **Real-time Task Management**: Create, read, update, and delete tasks
- **Optimistic Updates**: Smooth user experience with instant UI updates
- **Error Handling**: Comprehensive error handling with user feedback
- **Accessibility**: Proper keyboard navigation and screen reader support

## Tech Stack

- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth (client)
- SWR for data fetching
- React Hooks

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. **Clone the repository** (if not already done)

2. **Navigate to the frontend directory**
   ```bash
   cd frontend
   ```

3. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Environment Configuration**

   Copy the example environment file:
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

## Development

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser** to `http://localhost:3000`

## Production

1. **Build the application**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Start the production server**
   ```bash
   npm start
   # or
   yarn start
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run linting
- `npm run type-check` - Run TypeScript type checking
- `npm run analyze` - Analyze bundle size

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── layout.tsx       # Root layout with authentication
│   ├── page.tsx         # Home page
│   └── dashboard/       # Protected routes
│       └── page.tsx     # Main dashboard with task management
├── components/          # Reusable UI components
│   ├── TaskList.tsx     # Task list component
│   ├── TaskItem.tsx     # Individual task component
│   ├── TaskForm.tsx     # Create/edit task form
│   └── Navbar.tsx       # Navigation component
├── services/            # API service layer
│   └── api-client.ts    # API client with JWT handling
├── lib/                 # Utility functions
│   ├── auth.ts          # Authentication utilities
│   └── retry-utils.ts   # Retry mechanism utilities
├── context/             # React context providers
│   ├── AuthContext.tsx  # Authentication state
│   └── NotificationContext.tsx # Notification system
├── types/               # TypeScript type definitions
│   └── task.ts          # Task-related types
└── styles/              # Global styles
    └── globals.css      # Tailwind and custom styles
```

## API Integration

The frontend connects to the backend API with automatic JWT token handling. All API calls automatically include the authorization header with the user's JWT token.

## Authentication

The application uses Better Auth for authentication. The frontend handles JWT token management, automatic attachment to API requests, and 401 response handling with re-authentication flow.

## Error Handling

The application implements comprehensive error handling:
- Network error handling with appropriate user feedback
- 401 Unauthorized response handling
- API request timeout handling
- Form validation with user-friendly error messages
- Error boundaries for unexpected errors

## Accessibility

The application follows accessibility best practices:
- Proper keyboard navigation support
- ARIA attributes where needed
- Semantic HTML structure
- Focus management for interactive elements
- Screen reader friendly markup

## Deployment

For deployment, ensure that:
1. Environment variables are properly configured
2. The backend API is accessible from the deployed frontend
3. CORS settings allow communication between frontend and backend
4. Authentication is properly configured for the production domain

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

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request