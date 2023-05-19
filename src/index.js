require('dotenv').config(); // .env 파일 로드
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const Item = require('./models/item');
const saltRounds = 10;

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

// 요청본문파싱
app.use(bodyParser.json());

// 회원가입- 모든 사용자 정보를 가져옴.
app.get('/getSignup', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// 회원가입- 새로운 사용자를 생성
app.post('/signup', async (req, res) => {
  // 회원가입 할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
  try {
    const { name, email, password } = req.body;
    // 이미 있는 name과 email인지 확인.
    const existingUser = await User.findOne({ $or: [{ name }, { email }] });
    if (existingUser) {
      return res.status(409).json({ message: 'Name or Email already exists!' });
    }
    // salt를 생성하고 password를 hash 함.
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    // 데이터베이스에 사용자를 저장.
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
});
//---
// 로그인
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // 사용자를 데이터베이스에서 찾는다
    const user = await User.findOne({ email: email });

    // 사용자가 없거나 비밀번호가 일치하지 않으면 에러를 반환한다
    if (!user) {
      return res.status(401).json({ message: '이메일 혹은 비밀번호를 다시 확인하세요.' });
    }
    // passwords를 Compare함.
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: '유효하지 않은 이메일 또는 비밀번호입니다.' });
    }

    // JWT를 token에 저장.
    const token = jwt.sign({ email }, process.env.JWT_SECRET);

    // 로그인 성공
    res.status(200).json({ success: true, token });
  } catch (err) {
    // 오류 처리
    console.error('로그인 중 오류가 발생했습니다:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
//---
// POST 사용자 정보 수정
app.post('/userInfoUpdate/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const { name, password } = req.body;

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 사용자 식별을 위해 이메일로 사용자를 찾음
    const user = await User.findOne({ email: userId });

    if (!user) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    // 사용자 정보 수정
    user.name = name;
    user.password = hashedPassword;

    await user.save();

    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 오류');
  }
});
// GET 로그인한 정보만 가져오기
app.get('/profile/:id', async (req, res) => {
  try {
    // 로그인한 사용자의 아이디 가져오기
    const userId = req.params.id;

    // 사용자 정보 조회
    const user = await User.findOne({ email: userId });

    if (!user) {
      return res.status(404).send('사용자를 찾을 수 없습니다.');
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 오류');
  }
});
//---
// GET 데이터 가져오기
app.get('/getItems', async (req, res) => {
  try {
    const data = await Item.find();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

// 아이템 추가
app.post('/PostItems', async (req, res) => {
  try {
    // console.log(req.body, 'req.body');
    // const { name } = req.body;
    // // console.log(name, idss, '_id');

    // 중복된 장바구니 아이템 검사
    const existingCartItem = await Item.findOne(req.body);
    // 이미 장바구니에 있는 아이템인 경우 수량을 증가
    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
      return res.status(200).json({ message: 'Item quantity updated in cart.' });
    }

    // 새 아이템 생성
    const item = new Item(req.body);
    await item.save();
    res.send(item);

    // res.status(201).json({ message: '아이템이 추가되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
});

// 아이템 삭제
app.delete('/deleteItems/:id', async (req, res) => {
  try {
    console.log(req.params.id, 'delete req');
    const data = await Item.findByIdAndDelete(req.params.id);
    res.send(data);
    //   const { id } = req.params;
    //   console.log(req.params, 'req.params');

    //   // 삭제할 아이템 찾기
    //   const item = await Item.findById(id);
    //   if (!item) {
    //     return res.status(404).json({ message: '아이템이 존재하지 않습니다.' });
    //   }

    //   await item.remove();

    //   res.status(200).json({ message: '아이템이 삭제되었습니다.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '서버 에러' });
  }
  //---
});

// 아이템 수량 증가
app.put('/increase/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    console.log(item, 'itme');
    if (!item) throw new Error('Item not found');
    item.quantity += 1;
    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 아이템 수량 감소
app.put('/decrease/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item) throw new Error('Item not found');
    if (item.quantity === 1) {
      // 수량이 1개일 때는 삭제 처리
      const deletedItem = await Cart.findByIdAndDelete(id);
      if (!deletedItem) throw new Error('Item not found');
      res.status(200).json(deletedItem);
    } else {
      item.quantity -= 1;
      await item.save();
      res.status(200).json(item);
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 서버 시작
const port = 5000;
app.listen(port, () => {
  console.log('Server running on port %d', port);
});
