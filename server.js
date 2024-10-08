const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');

// 初始化 express
const app = express();

// 中介軟體
app.use(cors());
app.use(bodyParser.json());

// 連接 MongoDB
const dbURI = process.env.MONGODB_URI || 'mongodb+srv://charmytseng0118:HxaYYUAjwhL9X5v7@test.k1cpz.mongodb.net/?retryWrites=true&w=majority&appName=Test';
mongoose.connect(dbURI)
  .then(() => console.log('已成功連接 MongoDB'))
  .catch(err => console.log('連接 MongoDB 出錯:', err));

// 定義資料模型
const DataSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
});

const DataModel = mongoose.model('Data', DataSchema);

// API 路由：獲取所有資料
app.get('/data', async (req, res) => {
  try {
    const data = await DataModel.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// API 路由：新增資料
app.post('/data', async (req, res) => {
  const newData = new DataModel(req.body);
  try {
    await newData.save();
    res.status(201).json(newData);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// API 路由：更新資料
app.put('/data/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, comment } = req.body;

  try {
    const updatedData = await DataModel.findByIdAndUpdate(id, { name, email, comment }, { new: true });
    
    if (!updatedData) {
      return res.status(404).json({ message: '資料未找到' });
    }

    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).json({ message: '伺服器錯誤' });
  }
});

// 提供靜態資源
app.use(express.static(path.join(__dirname))); // 提供根目錄的靜態文件

// 根路徑處理：返回 index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 啟動伺服器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`伺服器運行在 http://localhost:${PORT}`);
});
