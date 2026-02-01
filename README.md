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

## Scripts

| Command        | Description                          |
|----------------|--------------------------------------|
| `npm run dev`  | Run with nodemon + ts-node (dev)     |
| `npm run build`| Compile TypeScript to `dist/`        |
| `npm start`    | Run compiled app (run `build` first) |

## Project structure

```
linkedin-backend/
├── src/
│   ├── index.ts      # App entry, Express server
│   └── connection.ts # MongoDB connection
├── .env.example
├── nodemon.json
├── package.json
└── tsconfig.json
```

## License

ISC
