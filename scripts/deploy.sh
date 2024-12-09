#!/bin/bash

# Build the application
npm run build

# Run database migrations
npx prisma migrate deploy

# Start the server
npm run start
