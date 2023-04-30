const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/testjin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('MongoDB connected!');
});

const mySchema = new mongoose.Schema({
  name: String,
  product: String,
});

const myModel = mongoose.model('jinjin', mySchema);

const app = express();

app.get('/', async (req, res) => {
  try {
    const jas = await myModel.find();
    res.json(jas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

const port = 5001;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});
