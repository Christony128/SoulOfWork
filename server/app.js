require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const cors=require('cors');
const mongoose=require('mongoose');
const Users=require('./models/userSchema');
const Clients=require('./models/clientSchema');
const Logins=require('./models/loginSchema');
const Transactions=require('./models/transactionSchema');

const db=process.env.DB_URI;
const PORT=process.env.PORT || 5000
app.use(express.json());
app.use(cors());

mongoose.connect(db)
.then(() => {console.log("MongoDB connected successfully")
  app.listen(PORT, () => {
  console.log("Server listening on port 5000");
});
})
.catch(err => console.error("MongoDB connection error:", err));
app.post('/login',async (req,res)=>{
  try{
    const{email,password}=req.body;
    if(!email || !password){
      return res.status(400).json({ error: "Missing email or password" });
    }
    const login=await Logins.findOne({email});
    if(!(login)){
      return res.status(401).json({ error: "User not found" });
      

    }
    if(login.password!==password){
      return res.status(401).json({error: "incorrect password"});
    }
    const user=await Users.findById(login.userid);
    res.status(200).json({user});
  }
  catch(err){
    console.log(err);
  }
})
  

app.post('/signup',async(req,res)=>{
  try{
    const { name, email, password, address, contact} = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if(req.body.rolegiver=="givemeadmin"){
      role="admin";
    }
    else{
      role="standard";
    }
    const user=new Users({name,email,address,contact,role})
    const userSaved=await user.save();
    const login=new Logins({email, password, userid: userSaved._id});
    const loginSaved=await login.save();
    res.status(201).json({login: loginSaved,user: userSaved});
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
})

app.post('/add-user',async (req,res)=>{
  try{
  const user=new Users(req.body);
  const saved= await user.save();
  res.status(201).json(saved);
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
});
app.post('/add-client',async (req,res)=>{
  try{
    const client=new Clients(req.body);
    const saved=await client.save();
    res.status(201).json(saved);
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
});
app.post('/add-transaction',async (req,res)=>{
  try{

  const transaction=new Transactions(req.body);
  const saved= await transaction.save();
  res.status(201).json(saved);
  }
  catch(err){
    res.status(400).json({error:err.message});
  }
});
app.get('/users', async (req, res) => {
  try {
    const users = await Users.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({error:err.message});
  }
});
app.get('/clients', async (req, res) => {
  try {
    const clients = await Clients.find();
    res.json(clients);
  } catch (err) {
    res.status(500).json({error:err.message});
  }
});
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transactions.find();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({error:err.message});
  }
});
app.post('/users/edit/:id', async(req,res)=>{
  const id=req.params.id;
    const user=await Users.findByIdAndUpdate(id,req.body, {new: true})
    const login=await Logins.findOne({userid: id})
    await Logins.findByIdAndUpdate(login._id,{email: req.body.email,password: req.body.password,userid: req.body._id})
    .then(data=>{console.log(data)
    res.json({ message: 'User updated'});
  })
  .catch(err=>{console.log(err)
    res.status(500).json({ error: 'Update failed' });
  })


})
app.post('/clients/edit/:id', async(req,res)=>{
  const id=req.params.id;
    await Clients.findByIdAndUpdate(id,req.body, {new: true})
  .then(data=>{console.log(data)
    res.json({ message: 'Client updated'});
  })
  .catch(err=>{console.log(err)
    res.status(500).json({ error: 'Update failed' });
  })
})
app.post('/transactions/edit/:id', async(req,res)=>{
  const id=req.params.id;
    await Transactions.findByIdAndUpdate(id,req.body, {new: true})
  .then(data=>{console.log(data)
    res.json({ message: 'Transaction updated'});
  })
  .catch(err=>{console.log(err)
    res.status(500).json({ error: 'Update failed' });
  })


})

app.post('/users/delete/:id', async(req,res)=>{
  const id=req.params.id;
  const login=await Logins.findOne({userid: id})
    await Logins.findByIdAndDelete(login._id);
    await Users.findByIdAndDelete(id)
  .then(data=>{console.log(data)
    res.json({ message: 'User updated'});
  })
  .catch(err=>{console.log(err)
    res.status(500).json({ error: 'Update failed' });
  })


})
app.post('/clients/delete/:id', async(req,res)=>{
  const id=req.params.id;
    await Clients.findByIdAndDelete(id)
  .then(data=>{console.log(data)
    res.json({ message: 'Client updated'});
  })
  .catch(err=>{console.log(err)
    res.status(500).json({ error: 'Update failed' });
  })
})

app.post('/transactions/delete/:id', async(req,res)=>{
  const id=req.params.id;
    await Transactions.findByIdAndDelete(id)
  .then(data=>{console.log(data)
    res.json({ message: 'Transaction updated'});
  })
  .catch(err=>{console.log(err)
    res.status(500).json({ error: 'Update failed' });
  })


})
//

app.use(express.static(path.join(__dirname, '../client/build')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

