const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
// MongoDB 연결
mongoose
  .connect('mongodb://localhost:27017/testjin', {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch(e => {
    console.error(e, 'its error');
  });
app.use(express.json({ extended: false }));

app.get('/', res => {
  res.send('hisud');
});

// // 스키마 생성
// const Schema = mongoose.Schema;
// const mySchema = new Schema({
//   name: String,
//   product: String,
// });

// // 모델 생성
// const myModel = mongoose.model('jinjin', mySchema);

// // Express 애플리케이션 생성
// const app = express();

// // 요청 본문 파싱
// app.use(bodyParser.json());

// // GET /mymodel - 모든 데이터 가져오기
// app.get('/mymodel', async (req, res) => {
//   const data = await myModel.find();
//   res.send(data);
// });

// // GET /mymodel/:id - 특정 데이터 가져오기
// app.get('/mymodel/:id', async (req, res) => {
//   const data = await myModel.findById(req.params.id);
//   res.send(data);
// });

// // POST /mymodel - 데이터 생성
// app.post('/mymodel', async (req, res) => {
//   const data = new myModel(req.body);
//   await data.save();
//   res.send(data);
// });

// // PUT /mymodel/:id - 데이터 업데이트
// app.put('/mymodel/:id', async (req, res) => {
//   const data = await myModel.findByIdAndUpdate(req.params.id, req.body);
//   res.send(data);
// });

// // DELETE /mymodel/:id - 데이터 삭제
// app.delete('/mymodel/:id', async (req, res) => {
//   const data = await myModel.findByIdAndDelete(req.params.id);
//   res.send(data);
// });

// 서버 시작
app.listen(3000, () => {
  console.log('서버 시작됨');
});
