# Auth API --> NodeJs / Expressjs using (JWT)

+ Email / Password for auth a user.
+ tools: Node.js, Express, MongoDB & Redis.
+ MVC pattern used.
+ mongoose for storing user in DB
+ redis for storing refresh tokens --> validating them & blacklisting them at the same time.
+ joi used for data validation.

**production ready**.

## To start setting up the project

+ npm i.
+ setup .env file with your own data.
+ generate 256-bit keys for JWT --> node ./helpers/generate_keys.js
+ install & run redis (redis-server).
+ install & run mongodb & run mongodb.
+ start api --> npm start

+ (optional) change expiration time of access, refresh token according to needs --> ./helpers/jwt_helper.js