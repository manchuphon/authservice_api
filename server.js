const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'my_super_secret_key'; // ใช้ environment variable เพื่อความปลอดภัย

app.use(cors({
  origin: '*', // อนุญาตทุก origin (ปรับได้ตามความต้องการ)
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ข้อมูล client ที่ถูกต้อง (ในระบบจริงควรเก็บในฐานข้อมูล)
const validClients = {
  client_id: 'manchuphon',
  client_secret: 'I_see_sky'
};

// Endpoint สำหรับสร้าง token
app.post('/auth', (req, res) => {
  const { client_id, client_secret } = req.body;

  if (!client_id || !client_secret) {
    return res.status(400).json({ error: 'Missing client_id or client_secret' });
  }

  if (client_id !== validClients.client_id || client_secret !== validClients.client_secret) {
    return res.status(401).json({ error: 'Invalid client_id or client_secret' });
  }

  const payload = { message: 'this is my credential' };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // token หมดอายุใน 1 ชั่วโมง
  res.status(200).json({ token });
});

// Endpoint สำหรับตรวจสอบ token
app.get('/verify', (req, res) => {
  let token = req.headers['authorization'];
  if (!token) {
    return res.status(400).json({ error: 'No token provided' });
  }

  // ลบ "Bearer " ออกถ้ามี
  if (token.startsWith('Bearer ')) {
    token = token.slice(7);
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
    res.status(200).json({ message: 'Token is valid', decoded });
  });
});

app.listen(PORT, () => {
  console.log(`Authen Service is running on port ${PORT}`);
});