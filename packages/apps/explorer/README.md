# Kadena Block Explorer Web

## Getting Started

First, install the dependencies:

```bash
rush install --to @kadena/explorer

# Get the emsdk repo
git clone https://github.com/emscripten-core/emsdk.git
# Enter that directory
cd emsdk
# Download and install the latest SDK tools.
./emsdk install latest
# Make the "latest" SDK "active" for the current user. (writes .emscripten file)
./emsdk activate latest
# Activate PATH and other environment variables in the current terminal
chmod +x ./emsdk_env.sh
source ./emsdk_env.sh
```

Second, change the value of `REMOTE_URL` in `next.config.js`:

```bash
REMOTE_URL: 'http://localhost:3000' # put your remote or local (for dev) host URL
```

Third, run the development server (only for development):

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the
result.

You can start editing the page by modifying page files on the directory
`pages/`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on
`pages/api.` Each page file is API endpoint.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are
treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead
of React pages.

## Learn More About Next.js

To learn more about framework Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
  features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

Check out their repository:
[the Next.js GitHub repository](https://github.com/vercel/next.js/)

## Deployment

### Commands

```bash
chmod +x ./emsdk/emsdk_env.sh # emsdk initialization
./emsdk/emsdk_env.sh
npm run build
npm run start
```

### Database (PostgreSQL) + TypeORM

This project uses Prisma TypeScript ORM for easy DB manipulations.

When PostgreSQL server is ready, make sure to create .env file with
`DATABASE_URL`. See `.env.example` file.

Then, these commands should be run only once.

```bash
pnpx prisma db push # creates database tables and types
pnpx prisma generate # generates TypeScript files
```

Database real-time status and data can be seen locally by Prisma Studio
Interface (local)

```bash
pnpx prisma studio # local web interface
```

## Learn More About Prisma

To learn more about framework Prisma, take a look at the following resources:

- [Prisma Documentation](https://www.prisma.io/) - learn about Prisma TypeORM.

Check out their repository:
[the Prisma GitHub repository](https://github.com/prisma)

## Commands for data gathering (Cron)

curl --request GET 'http://localhost:3000/api/info/create?network=$network'
--header 'authorization: $header'

- The $network parameter should be `Testnet` or `Mainnet`. Non-nullable.
- Need to change authorization header instead of $header. Contact authorized
  manager for the $header value.
- Need to use remote host instead of localhost (Recommended)
