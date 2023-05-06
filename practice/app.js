const express = require('express');
const mongoose = require('mongoose');

// MongoDB연결
mongoose.connect('mongodb://localhost:27017/testjin', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

// MongoDB연결 중에 오류가 발생하면 오류 메시지를 콘솔에 표시
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// MongoDB에 처음 연결할 때 한 번 실행.
db.once('open', function () {
  console.log('MongoDB connected!');
});

// 스키마 생성
const mySchema = new mongoose.Schema({
  name: String,
  product: String,
});

// 모델 생성
const myModel = mongoose.model('jinjin', mySchema);

// Express 애플리케이션 생성
const app = express();

// GET 데이터 가져오기
app.get('/', async (req, res) => {
  try {
    const jas = await myModel.find();
    res.json(jas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 서버 시작
const port = 5001;
app.listen(port, () => {
  console.log('Listening to port %d', port);
});
