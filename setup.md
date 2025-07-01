# Lightspeed API Authentication Project

## Overview

This is a Next.js application designed to provide secure OAuth 2.0 authentication for integrating with the Lightspeed API. The project serves as a foundation for building applications that need to interact with Lightspeed's retail management system APIs.

## What This Project Does

### Core Functionality
- **OAuth 2.0 Authentication Flow**: Complete OAuth 2.0 implementation with Lightspeed's API
- **Token Management**: Automatic token acquisition, refresh, and secure HTTP-only cookie storage
- **API Integration**: Authenticated API calls to Lightspeed endpoints with account information retrieval
- **Dashboard Interface**: User-friendly dashboard displaying account details and connection status
- **HTTPS Development**: Local HTTPS setup for secure development environment

### Key Features
- **Secure Authentication**: Industry-standard OAuth 2.0 implementation with state parameter validation
- **Modern UI**: Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components
- **Server Actions**: Uses Next.js server actions for secure server-side operations
- **Type Safety**: Full TypeScript implementation for better development experience
- **Token Validation**: Automatic token validation and session management
- **Account Integration**: Direct integration with Lightspeed account endpoints

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **HTTP Client**: Axios for API requests
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Security**: HTTP-only cookies for token storage

### Project Structure
```
lightspeed-api-auth/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main landing page with auth interface
│   ├── actions.ts         # Server actions for OAuth initiation
│   ├── data.ts            # API data fetching functions
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   ├── auth/              # Authentication routes
│   │   └── callback/      # OAuth callback handler
│   └── dashboard/         # Dashboard interface
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── home-page/        # Home page specific components
├── lib/                  # Utility functions and configurations
├── certs/                # SSL certificates for HTTPS development
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Implementation Status

### Completed ✅
- **Project Setup**: Next.js 15 with TypeScript and Tailwind CSS
- **UI Components**: Complete shadcn/ui component library
- **Landing Page**: Modern, responsive authentication interface
- **OAuth Implementation**: Complete OAuth 2.0 flow with Lightspeed
- **Token Management**: Secure token storage using HTTP-only cookies
- **Dashboard**: Account information display and connection status
- **HTTPS Development**: Local HTTPS setup with self-signed certificates
- **API Integration**: Account details retrieval and token validation
- **State Management**: Secure state parameter generation and validation

### Features Implemented
- **OAuth Flow**: Complete authentication flow from initiation to token acquisition
- **Token Refresh**: Automatic token refresh using refresh tokens
- **Account Integration**: Fetching and displaying account information
- **Session Management**: Automatic token validation and session handling
- **Security**: HTTP-only cookies, state parameter validation, secure redirects
- **Error Handling**: Graceful error handling with redirects to error pages

### TODO 📋
- **Error Pages**: Create dedicated error pages for authentication failures
- **Token Expiration**: Implement automatic token refresh on expiration
- **Additional API Endpoints**: Expand to other Lightspeed API endpoints
- **User Management**: Add user profile and settings management
- **Logging**: Add comprehensive logging for debugging and monitoring
- **Testing**: Add unit and integration tests
- **Production Security**: Additional security measures for production deployment

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Lightspeed API credentials (Client ID, Client Secret)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see Environment Setup below)
4. Generate SSL certificates: `npm run generate-certs`
5. Run the development server: `npm run dev:https`

### Environment Setup
Create a `.env.local` file with the following variables:
```env
# Lightspeed API Configuration
LIGHTSPEED_CLIENT_ID=your_client_id
LIGHTSPEED_CLIENT_SECRET=your_client_secret
LIGHTSPEED_REDIRECT_URI=https://localhost:3000/api/auth/callback

# Application Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://localhost:3000
```

## Development Workflow

### Current State
The application now provides a complete OAuth 2.0 authentication experience:

1. **Landing Page**: Beautiful interface with "Connect to Lightspeed" button
2. **OAuth Flow**: Secure authentication flow with state parameter validation
3. **Token Management**: Automatic token acquisition and refresh
4. **Dashboard**: Account information display with connection status
5. **HTTPS Development**: Secure local development environment

### Authentication Flow
1. User clicks "Connect to Lightspeed" button
2. Application generates secure state parameter
3. User is redirected to Lightspeed OAuth authorization page
4. After authorization, user is redirected back to callback route
5. Application exchanges authorization code for access token
6. Token is refreshed and stored in HTTP-only cookie
7. User is redirected to dashboard with account information

### Available Scripts
- `npm run dev`: Start development server (HTTP)
- `npm run dev:https`: Start development server with HTTPS
- `npm run generate-certs`: Generate SSL certificates for HTTPS
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint

## API Integration Points

### Implemented Endpoints
- **OAuth Authentication**: Complete OAuth 2.0 flow
- **Account Information**: Account details retrieval (`/API/V3/Account.json`)
- **Token Validation**: Automatic token validation and refresh

### Server Actions & Functions
- `initiateLightspeedAuth()`: Initiates OAuth flow with state parameter
- `getAccountId()`: Retrieves and caches account ID
- `isTokenValid()`: Validates current token status
- `getAccountDetails()`: Fetches complete account information

### OAuth Callback Handler
- Handles authorization code exchange
- Implements token refresh
- Sets secure HTTP-only cookies
- Redirects to dashboard on success

## Security Features

### Implemented
- **OAuth 2.0**: Industry-standard authentication flow
- **State Parameter**: CSRF protection with secure state generation
- **HTTP-only Cookies**: Secure token storage
- **HTTPS Development**: Local HTTPS setup for secure development
- **Token Refresh**: Automatic token refresh mechanism
- **Error Handling**: Secure error handling with redirects

### Security Best Practices
- State parameter validation for CSRF protection
- HTTP-only cookies for token storage
- Secure redirects with proper origin validation
- Automatic token refresh to maintain session
- HTTPS development environment

## HTTPS Development Setup

### Quick Setup
1. Generate certificates: `npm run generate-certs`
2. Start HTTPS server: `npm run dev:https`
3. Access at `https://localhost:3000`

### Certificate Management
- Self-signed certificates for local development
- Automatic certificate generation script
- Browser security warnings are normal (click "Advanced" → "Proceed")
- Certificates stored in `certs/` directory

## Deployment

### Development
```bash
npm run dev:https  # HTTPS development
npm run dev        # HTTP development
```

### Production Build
```bash
npm run build
npm start
```

### Recommended Platforms
- **Vercel**: Optimized for Next.js deployment
- **Netlify**: Good support for Next.js applications
- **AWS/GCP**: For enterprise deployments

## Contributing

This project follows modern development practices:
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Conventional commit messages
- HTTPS development environment

## License

This project is designed as a foundation for Lightspeed API integrations. Please ensure compliance with Lightspeed's API terms of service and your organization's security policies.

---

**Note**: This project now has a complete OAuth 2.0 implementation with secure token management, dashboard interface, and HTTPS development setup. The core authentication flow is fully functional and ready for production use with proper environment configuration. 