const express = require('express');
const mongoose = require('mongoose');
const app = express();

// MongoDB 연결
mongoose.connect('mongodb://localhost:27017/testjin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 연결된 MongoDB 객체
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('MongoDB connected!');
});

// MongoDB 스키마
const jinjinSchema = new mongoose.Schema({
  name: String,
  product: String,
});

// MongoDB 모델
const jinjinModel = mongoose.model('jinjin', jinjinSchema);

// // GET /mymodel - 모든 데이터 가져오기
// app.get('/mymodel', async (req, res) => {
//   const data = await myModel.find();
//   res.send(data);
// });

// 모든 jinjin 데이터 불러오기 API
app.get('/api/jinjin', async (req, res) => {
  try {
    const jinjins = await jinjinModel.find();
    res.json(jinjins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 서버 실행
app.listen(3000, () => console.log('Server is running on port 3000'));
