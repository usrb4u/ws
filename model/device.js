var mongoose = require('mongoose');

var deviceSchema = mongoose.Schema({
	deviceId:String,
	ipAddress:String,
	status: Boolean,
	aliasName:String,
    userName:String,
	regDate:Date
});

var device = mongoose.model('device',deviceSchema);

module.exports = device;