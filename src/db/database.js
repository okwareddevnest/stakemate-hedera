const mongoose = require('mongoose');
require('dotenv').config();

// Database connection URI
let MONGODB_URI;

// Check if a complete DB_URI is provided
if (process.env.DB_URI) {
  MONGODB_URI = process.env.DB_URI;
} else {
  // Build URI from individual components
  const dbUser = encodeURIComponent(process.env.DB_USER || '');
  const dbPassword = encodeURIComponent(process.env.DB_PASSWORD || '');
  const dbHost = process.env.DB_HOST || 'localhost';
  const dbPort = process.env.DB_PORT || '27017';
  const dbName = process.env.DB_NAME || 'stakemate';
  
  // Include authentication only if user and password are provided
  const authPart = dbUser && dbPassword ? `${dbUser}:${dbPassword}@` : '';
  
  MONGODB_URI = `mongodb://${authPart}${dbHost}:${dbPort}/${dbName}`;
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);
    
    const conn = await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}:${conn.connection.port}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = { connectDB, mongoose }; 