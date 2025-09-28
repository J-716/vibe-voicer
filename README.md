# Vibe Voicer

A modern invoice management application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 📊 **Dashboard** - Overview of your business metrics
- 👥 **Client Management** - Add, edit, and manage clients
- 📄 **Invoice Management** - Create, edit, and track invoices
- ⚙️ **Settings** - Customize your application preferences
- 🎨 **Modern UI** - Built with shadcn/ui components and Tailwind CSS
- 📱 **Responsive Design** - Works on all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Forms**: React Hook Form + Zod validation
- **PDF Generation**: @react-pdf/renderer
- **Package Manager**: PNPM

## Getting Started

### Prerequisites

- Node.js 18+ 
- PNPM

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd vibe-voicer
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── clients/           # Client management pages
│   ├── invoices/          # Invoice management pages
│   ├── settings/          # Settings page
│   └── login/             # Authentication page
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
└── lib/                  # Utility functions and configurations
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Configuration

### Authentication
Configure your authentication system in the login page and protected layout components.

### Database
Set up your database and update the API routes as needed.

### Styling
The project uses Tailwind CSS v4. Customize the design system in `tailwind.config.ts`.

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Set environment variables in Vercel dashboard
   - Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details