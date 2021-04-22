require('colors')
const mongoose = require('mongoose');


const dbConnection = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_CNX, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    console.log('\nBase de datos online! :D\n'.yellow);

  } catch (error) {
    console.error(error);
    throw new Error('Error iniciando la base de datos');
  }
};

module.exports = {
  dbConnection
}