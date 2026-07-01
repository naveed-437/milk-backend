const mongoose = require('mongoose');

let connected = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/asn-dairy-hub';

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  connected = true;
  console.log(`MongoDB connected: ${uri}`);
};

const isDbConnected = () => connected;

module.exports = { connectDB, isDbConnected };
