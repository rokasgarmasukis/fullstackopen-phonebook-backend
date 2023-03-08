const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

mongoose.set('strictQuery', false)

mongoose.connect(MONGO_URI)

const Schema = mongoose.Schema;
const numberSchema = new Schema({
  name: String,
  number: String,
});

const Number = mongoose.model('Number', numberSchema);

if (process.argv.length === 2) {
  Number.find({}).then(result => {
    result.forEach(entry => {
      console.log(`${entry.name}: ${entry.number}`)
    })
    mongoose.connection.close()
  })
} else if (process.argv.length === 4){
  const name = process.argv[2];
  const number = process.argv[3];
  
  const newNumber = Number({
    name,
    number,
  });
  
  newNumber.save().then(result => {
    console.log(result)
    mongoose.connection.close()
  })
}

