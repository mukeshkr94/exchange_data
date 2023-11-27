const mongoose = require('mongoose');

const exchangeDataSchema = new mongoose.Schema({
    exchange_id:String,
    name:String,
    volume_1day_usd:String,
    url:String
});

module.exports = mongoose.model('Exchange', exchangeDataSchema);