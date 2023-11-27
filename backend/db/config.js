const mongoose = require('mongoose');
mongoose.connect('mongodb://0.0.0.0:27017/exchangeDB');

let db = mongoose.connection;

db.on('error', (err)=>{
    console.log(err);
});
db.once('open', ()=>{
    console.log('db connected');
})

