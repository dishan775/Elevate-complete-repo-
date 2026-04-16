const mongoose = require('mongoose');
const { setServers } = require('node:dns/promises');

const connectDB = async () => {
  try {
    // DNS Workaround for MongoDB Atlas SRV resolution in some environments
    try {
      await setServers(['8.8.8.8', '8.8.4.4']);
      console.log('📡 DNS servers set to Google Primary for Atlas resolution');
    } catch (dnsErr) {
      console.warn('⚠️ DNS setServers failed, attempting connection with default resolver');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn("⚠️ Continuing without MongoDB connection. Auth features will not work.");
  }
};

module.exports = connectDB;
