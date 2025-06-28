# Lightspeed API Authentication Project

## Overview

This is a Next.js application designed to provide secure OAuth 2.0 authentication for integrating with the Lightspeed API. The project serves as a foundation for building applications that need to interact with Lightspeed's retail management system APIs.

## What This Project Does

### Core Functionality
- **OAuth 2.0 Authentication Flow**: Implements a complete OAuth 2.0 flow to authenticate with Lightspeed's API
- **Token Management**: Handles access token acquisition, refresh, and secure storage
- **API Integration**: Provides a foundation for making authenticated API calls to Lightspeed endpoints
- **Session Management**: Manages user sessions and authentication state

### Key Features
- **Secure Authentication**: Industry-standard OAuth 2.0 implementation
- **Modern UI**: Built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui components
- **Server Actions**: Uses Next.js server actions for secure server-side operations
- **Type Safety**: Full TypeScript implementation for better development experience

## Project Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner toast notifications

### Project Structure
```
lightspeed-api-auth/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main landing page
│   ├── actions.ts         # Server actions for API calls
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility functions and configurations
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## Implementation Status

### Completed ✅
- **Project Setup**: Next.js 15 with TypeScript and Tailwind CSS
- **UI Components**: Complete shadcn/ui component library
- **Landing Page**: Modern, responsive authentication interface
- **Project Structure**: Well-organized file structure and architecture

### In Progress 🚧
- **OAuth Implementation**: Server actions are defined but not yet implemented
- **Token Management**: Framework is in place but needs actual implementation
- **API Integration**: Structure is ready for Lightspeed API calls

### TODO 📋
- **Environment Configuration**: Set up Lightspeed API credentials
- **OAuth Flow**: Implement the complete OAuth 2.0 authentication flow
- **Token Storage**: Implement secure token storage (database/encrypted storage)
- **API Endpoints**: Create specific endpoints for different Lightspeed API calls
- **Error Handling**: Add comprehensive error handling and user feedback
- **Session Management**: Implement user session handling
- **Security**: Add CSRF protection, state validation, and other security measures

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, or bun
- Lightspeed API credentials (Client ID, Client Secret)

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see Environment Setup below)
4. Run the development server: `npm run dev`

### Environment Setup
Create a `.env.local` file with the following variables:
```env
# Lightspeed API Configuration
LIGHTSPEED_CLIENT_ID=your_client_id
LIGHTSPEED_CLIENT_SECRET=your_client_secret
LIGHTSPEED_REDIRECT_URI=http://localhost:3000/api/auth/callback

# Application Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Development Workflow

### Current State
The application currently displays a beautiful landing page with:
- Authentication card with "Connect to Lightspeed" button
- Connection status indicator
- Features overview
- Modern, responsive design

### Next Steps
1. **Implement OAuth Flow**: Complete the `initiateLightspeedAuth()` function
2. **Add Token Storage**: Implement secure token storage solution
3. **Create API Routes**: Add Next.js API routes for OAuth callbacks
4. **Build API Client**: Create a client for making authenticated Lightspeed API calls
5. **Add Error Handling**: Implement comprehensive error handling
6. **Testing**: Add unit and integration tests

## API Integration Points

### Lightspeed API Endpoints
The project is designed to integrate with various Lightspeed API endpoints:
- **Authentication**: OAuth 2.0 endpoints
- **Inventory**: Product and inventory management
- **Sales**: Order and transaction data
- **Customers**: Customer information and management
- **Reports**: Analytics and reporting data

### Server Actions
The `app/actions.ts` file contains the framework for:
- OAuth initiation and callback handling
- Token refresh and revocation
- Authenticated API calls
- Session management
- User profile retrieval

## Security Considerations

### Implemented
- Server-side actions for sensitive operations
- TypeScript for type safety
- Modern React patterns and best practices

### Planned
- CSRF protection
- State parameter validation
- Secure token storage
- Rate limiting
- Input validation and sanitization

## Deployment

### Development
```bash
npm run dev
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

## License

This project is designed as a foundation for Lightspeed API integrations. Please ensure compliance with Lightspeed's API terms of service and your organization's security policies.

---

**Note**: This is a work-in-progress project. The OAuth implementation and API integration features are currently in the planning/development phase and need to be completed before production use. 