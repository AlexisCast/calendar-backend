# calendar-backend

## Development:
1. Install dependencies `npm i`
2. Clone the file `.env.template` file, rename it to`.env` and update/save environment variables.
3. Run server `npm run dev`

## Env File:
Clone the file `.env.template` file, rename it to`.env` and update/save environment variables.

- PORT
- NODE_ENV
- DB_CNN=mongodb+srv://<db_username>:<db_password>@cluster0.xeddqmz.mongodb.net/nameOfDataBase
- SECRET_JWT_SEED
- SECRET_JWT_SEED_DURATION

```bash
PORT=4000
NODE_ENV=development
DB_CNN=mongodb+srv://<db_username>:<db_password>@cluster0.xeddqmz.mongodb.net/calendar-db
SECRET_JWT_SEED=thisShouldBeASecretString
SECRET_JWT_SEED_DURATION=2h | 15m 
```