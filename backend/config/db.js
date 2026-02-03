const mongoose = require('mongoose');

const connectDB = async () => {
    // Check if the URI is actually loaded
    if (!process.env.MONGODB_ATLAS_URI) {
        console.error("Error: MONGODB_ATLAS_URI is not defined in .env file");
        process.exit(1);
    }

    try {
        const conn = await mongoose.connect(process.env.MONGODB_ATLAS_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Connection Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;