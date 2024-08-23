const express = require('express');
const mongoose = require('mongoose');
const CryptoJS=require('crypto-js')
const User = require('./models/User');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
const mongoURI = 'mongodb://127.0.0.1:27017/mydatabase';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));
//encryption
function encrypt(data,key){
  const cipherText=CryptoJS.AES.encrypt(data,key).toString()
  return cipherText;
}
//decryption
function decrypt(cipherText,key){
  try {
      const bytes = CryptoJS.AES.decrypt(cipherText,key);

      if(bytes.sigBytes > 0){
          const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
          return decryptedData;
      }else{
          throw new Error('Decryption Failed Invalid Key')
      }
  } catch (error) {
      throw new Error('Decryption Failed Invalid Key')
  }

}
// Basic Route
app.get('/', (req, res) => {
  res.send('Hello, Express and MongoDB!');
});

// Route to Add a User
app.post('/users', async (req, res) => {
  
  try {
    const { username, email, age } = req.body;
    const name=encrypt(username,"age")
    const newUser = new User({ name, email, age });
    const savedUser = await newUser.save();
    res.status(201).json({savedUser});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
//Route to retrive encrypted data
app.post('/decrypt',(req,res)=>{
  const { encryptedData } = req.body;

  const decryptedData = decrypt(encryptedData, "age");
  res.json({decryptedData});
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
