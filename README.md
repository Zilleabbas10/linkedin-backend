# LinkedIn Backend

Express + TypeScript backend with MongoDB (Mongoose). Part of the LinkedIn clone project.

## Tech stack

- **Node.js** + **Express**
- **TypeScript**
- **MongoDB** (Mongoose)
- **dotenv** for environment variables

## Prerequisites

- Node.js (v18+)
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Setup

1. **Clone and install**

   ```bash
   cd linkedin-backend
   npm install
   ```

2. **Environment variables**

   Copy the example env file and set your values:

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and set:

   - `MONGO_URI` – MongoDB connection string (e.g. `mongodb://localhost:27017/linkedin-clone` or your Atlas URI)
   - `PORT` (optional) – server port, defaults to `3000`
   - `NODE_ENV` (optional) – e.g. `development` or `production`

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Run with nodemon + ts-node (dev)     |
| `npm run build`| Compile TypeScript to `dist/`        |
| `npm start`    | Run compiled app (run `build` first) |

## API

- Base path: **`/api/v1`**
- **GET** `/api/v1` – welcome message
- **GET** `/api/v1/health` – health check (status + timestamp)
- Add more routes under `src/routes/` and mount in `src/routes/index.ts`.

## Project structure

```
linkedin-backend/
├── src/
│   ├── config/           # Central env config
│   ├── connection.ts     # MongoDB connection
│   ├── index.ts          # App entry, middleware, listen
│   ├── middleware/       # Error handler, 404, etc.
│   ├── models/           # Mongoose models
│   ├── routes/           # Route modules (API v1)
│   ├── types/            # Shared TypeScript types
│   └── ...
├── .env.example
├── nodemon.json
├── package.json
└── tsconfig.json
```


## License

ISC
