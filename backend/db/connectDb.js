import mongoose from 'mongoose';

const dbConnect = async () => {
  try {
    const db = await mongoose.connect(process.env.DATABASE_URL);
    console.log(`Conncted to database on port: ${db.connection.port}`);
  } catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    process.exit(1);
  }
};

export default dbConnect;
