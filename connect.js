const mongoose = require('mongoose');

const connect = async (uri) => {
    const options = {
        dbName: "alpha",
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };

    try {
      await mongoose.connect(uri, options);
      console.log('Successfully connected to MongoDB Atlas');
    } catch (error) {
      console.log('Error connecting to MongoDB Atlas:', error);
      process.exit(1);
    }
  };

  module.exports = connect;