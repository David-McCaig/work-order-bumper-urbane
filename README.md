# Work Order Bumper

A Next.js web application that helps bike shop managers efficiently update multiple work orders to a selected date in Lightspeed Retail. This tool streamlines the process of bumping work orders from one date to another, saving time and reducing manual errors.

## 🚀 What It Does

The Work Order Bumper is designed for bike shops using Lightspeed Retail's work order system. It allows users to:

- **Authenticate** with their Lightspeed account using OAuth
- **View work orders** for a specific date with their current status
- **Select multiple work orders** to update simultaneously
- **Bump work orders** to a new target date in batches
- **Track progress** with real-time updates and visual feedback
- **Handle rate limiting** intelligently to avoid API errors

## 🛠️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Authentication**: OAuth 2.0 with Lightspeed
- **HTTP Client**: Axios for API requests
- **UI Components**: Radix UI primitives
- **Error Handling**: Custom error types and Sentry integration
- **Deployment**: Vercel

## 📋 Prerequisites

Before running this project, you'll need:

1. **Lightspeed Retail Account**: A valid Lightspeed Retail account with API access
2. **Lightspeed API Credentials**: Client ID and API URL from Lightspeed
3. **Node.js**: Version 18 or higher
4. **npm/yarn/pnpm**: Package manager

## 🔧 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
LIGHTSPEED_CLIENT_ID=your_lightspeed_client_id
LIGHTSPEED_API_URL=https://api.lightspeedapp.com
```

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. Set Up Environment Variables

Copy the example environment file and fill in your Lightspeed credentials:

```bash
cp .env.example .env.local
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 4. Build for Production

```bash
npm run build
npm start
```

## 🔐 Authentication Flow

The application uses OAuth 2.0 to authenticate with Lightspeed:

1. User clicks "Sign In" button
2. Redirected to Lightspeed OAuth authorization page
3. User grants permissions for work order access
4. Redirected back to the app with authorization code
5. Server exchanges code for access token
6. Token stored in HTTP-only cookies for security

## 📊 How It Works

### Work Order Selection
- Users can view work orders for a specific date
- Work orders are filtered to exclude completed statuses (Floor Bike, Finished, Done & Paid, etc.)
- Users can select individual work orders or use "Select All"

### Batch Processing
- Work orders are processed in batches of 30 to respect API limits
- Progress is shown in real-time with current batch information

### Rate Limiting
The application implements intelligent rate limiting to match Lightspeed's leaky bucket system:

- **Bucket Tracking**: Monitors API response headers for bucket level information
- **Dynamic Wait Times**: Calculates required wait time based on bucket capacity
- **Conservative Approach**: Adds 20% safety buffer to prevent 429 errors
- **Batch Delays**: 10-second delays between batches for large operations

### 2. Vercel Server Action Timeouts

**Challenge**: Processing large numbers of work orders can exceed Vercel's server action timeout limits (especially on free tier).

**Solution**:
- Implemented batch processing with configurable batch sizes (30 work orders per batch)
- Added automatic retry logic for failed batches
- Used recursive server action calls to continue processing after timeouts
- Added progress tracking and user feedback for long-running operations

### 3. Timezone Handling

**Challenge**: Inconsistent date handling between client and server causing timezone conversion issues.

**Solution**:
- Used local date components to avoid timezone conversion
- Implemented consistent date parsing across client and server
- Added proper date formatting for API requests


## 🔧 Development Scripts

- `npm run dev` - Start development server
- `npm run dev:https` - Start with HTTPS (for OAuth testing)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

The application is designed to be deployed on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is private and proprietary.

---

**Note**: This application requires a valid Lightspeed Retail account and API credentials to function properly.
