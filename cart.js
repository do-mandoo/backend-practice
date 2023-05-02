const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
// const Item = require('./src/item');

// Express 애플리케이션 생성
const app = express();

app.use(cors()); // 모든 도메인에서의 요청을 허용합니다.

// MongoDB와 연결
mongoose.connect('mongodb://localhost:27017/cartPractice', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
  // useFindAndModify: false,
});

const db = mongoose.connection;

// MongoDB연결 중에 오류가 발생하면 오류 메시지를 콘솔에 표시
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', () => {
  console.log('MongoDB connected!');
});

//---
// 스키마 생성
const { Schema } = mongoose;
// const {
//   Types: { ObjectId },
// } = new mongoose.Schema();
const itemSchema = new Schema({
  name: String,
  age: Number,
  // idss: {
  //   type: mongoose.Types.ObjectId,
  //   required: true,
  // },
});

// 모델 생성
const Item = mongoose.model('Item', itemSchema);
//---s

// JSON 파싱
// app.use(express.json());

// 요청본문파싱
app.use(bodyParser.json());

// GET 데이터 가져오기

app.get('/getItems', async (req, res) => {
  try {
    const data = await Item.find();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 아이템 추가
app.post('/PostItems', async (req, res) => {
  try {
    // // console.log(req.body, 'req.body');
    // const { name } = req.body;
    // // console.log(name, idss, '_id');

    // // 중복된 아이템인지 확인
    // const existingItem = await Item.findOne({ name });
    // if (existingItem) {
    //   return res.status(409).json({ message: '이미 존재하는 아이템입니다.' });
    // }

    // // 새 아이템 생성
    // const item = new Item({ name });
    // await item.save();

    //---
    console.log(req, 'req.body');
    const item = new Item(req.body);
    await item.save();
    res.send(item);

    // res.status(201).json({ message: '아이템이 추가되었습니다.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: '서버 에러' });
  }
});

// 아이템 삭제
app.delete('/deleteItems/:id', async (req, res) => {
  // try {
  //   const { id } = req.params;
  //   console.log(req.params, 'req.params');

  //   // 삭제할 아이템 찾기
  //   const item = await Item.findById(id);
  //   if (!item) {
  //     return res.status(404).json({ message: '아이템이 존재하지 않습니다.' });
  //   }

  //   await item.remove();

  //   res.status(200).json({ message: '아이템이 삭제되었습니다.' });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ message: '서버 에러' });
  // }
  //---
  console.log(req.params.id, 'delete req');
  const data = await Item.findByIdAndDelete(req.params.id);
  res.send(data);
});

// 서버 시작
const port = 5000;
app.listen(port, () => {
  console.log('Server running on port %d', port);
});
