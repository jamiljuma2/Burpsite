#!/bin/bash

# Burpsite Backend Setup Script

echo "🔧 Installing Backend Dependencies..."
cd backend
npm install

echo "📋 Creating .env file..."
cp .env.example .env

echo "ℹ️  Please configure the .env file with your Neon database credentials:"
echo "   - DATABASE_URL: postgresql://user:password@host/database"
echo "   - DB_SSL: true"
echo ""
echo "   Or individual parameters:"
echo "   - DB_HOST: your-neon-host.neon.tech"
echo "   - DB_PORT: 5432"
echo "   - DB_NAME: burpsite"
echo "   - DB_USER: neondb_owner"
echo "   - DB_PASSWORD: your_password"
echo "   - DB_SSL: true"
echo ""
echo "📝 Edit backend/.env and then run:"
echo "   npm run dev"
echo ""
echo "✅ Backend setup complete!"
