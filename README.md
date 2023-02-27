# FANSHOP

Online store where people can purchase clothes using paypal and see all their order information on their account
dashboard. The
website also has a fully working admin panel to add, edit or remove information about products and users.

![FanShop Home](https://i.imgur.com/LexWI9z.png "FanShop Home")

### FRONTEND

On client folder set up and .env with these variables:

```
NEXT_PUBLIC_BACKEND
NEXT_PUBLIC_CLOUDINARY_PRESET
NEXT_PUBLIC_CLOUDINARY_CLOUD
NEXT_PUBLIC_CLOUDINARY_APIKEY
NEXT_PUBLIC_CLOUDINARY_APISECRET
NEXT_PUBLIC_SECURE_LOCAL_STORAGE_HASH_KEY
```

Start the client with

```
npm run dev
```

--- 

### BACKEND

On api folder set up and .env with these variables:

```
PGHOST
PGDATABASE
PGPASSWORD
PGPORT
PGUSER
PORT
JWT_SECRET
ADMIN_EMAIL
ADMIN_PASSWORD
ADMIN_NAME
SEED_KEY
PAYPAL_API
PAYPAL_CLIENT
PAYPAL_SECRET
FRONTEND
BACKEND
ENV
```

Start the api with

```
npm run dev
```

***A PostgreSQL database can be created (if needed) with docker using the docker-compose file provided in this repo***

```
npm run pgup
```