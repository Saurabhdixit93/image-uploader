const mongoose = require('mongoose');

module.exports.ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL,{
          useNewUrlParser: true,
          useUnifiedTopology: true,
          
        });
        console.log(`MongoDB connected : ${conn.connection.host}`);
      } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};