# No One Will Pay - Web Application

Bitcoin education platform - speedrunning Bitcoin via negativa.

## Overview

This is the main web application for No One Will Pay, featuring:
- Interactive Bitcoin knowledge surveys
- Referral system with allocation points
- Marketplace for Bitcoin-accepting businesses
- Automated charity pool generation
- Secure JWT authentication

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: NeonDB (Serverless PostgreSQL)
- **ORM**: Drizzle ORM
- **Styling**: Tailwind CSS
- **Authentication**: JWT with bcrypt
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- NeonDB account ([sign up here](https://neon.tech))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/proofofputt/noonewillpay-web.git
cd noonewillpay-web
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your values:
```env
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
JWT_SECRET=your-secure-jwt-secret-at-least-64-characters
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_GITBOOK_URL=https://docs.noonewillpay.com
```

4. Run database migrations:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Setup

### Generate Migrations

```bash
npm run db:generate
```

### Push Schema to Database

```bash
npm run db:push
```

### Open Drizzle Studio

```bash
npm run db:studio
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Drizzle Studio

## Project Structure

```
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── survey/         # Survey pages
│   ├── marketplace/    # Marketplace pages
│   └── charity/        # Charity pool pages
├── components/         # React components
├── lib/               # Utility functions
├── drizzle/           # Database schema & migrations
└── public/            # Static assets
```

## Environment Variables

See `.env.example` for required environment variables:

- `DATABASE_URL` - NeonDB connection string
- `JWT_SECRET` - Secret for JWT token signing (generate with `openssl rand -base64 64`)
- `NEXT_PUBLIC_WEB_URL` - Web app URL
- `NEXT_PUBLIC_GITBOOK_URL` - Documentation URL

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for contribution guidelines.

## Security

Report security vulnerabilities to security@proofofputt.com or see [SECURITY.md](./SECURITY.md).

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Related Repositories

- [Admin Dashboard](https://github.com/proofofputt/noonewillpay-admin) - Admin dashboard for managing the platform

## Support

- [Documentation](https://docs.noonewillpay.com)
- [GitHub Discussions](https://github.com/proofofputt/noonewillpay-web/discussions)
- [Issue Tracker](https://github.com/proofofputt/noonewillpay-web/issues)

---

Built with ⚡ by [Proof of Putt](https://github.com/proofofputt)
