var Device = require('../model/device');


module.exports = function(app,eventEmitter) {
    app.get('/api/getDevices/:userId', function(req,res){
            
            Device.find({userName:req.params.userId}).lean().exec(function(err, rec) {
                if(err)
                    res.status(500).send({message:err.message});
                else
                    res.json(rec);
            });
        })

    app.post('/api/regDevice',function(req,res){
        Device.find({deviceId:req.body.devId}).lean().exec(function(err, rec) {
            if(err){
                console.log('Device search failed: '+err);
                 res.json('error');
            }
            else if(rec.length==1){
                Device.update({deviceId:req.body.devId}, {
                    $set: {
                        userName: req.body.userName,
                        aliasName:req.body.aliasName
                    }
                }).lean().exec(function (err, docs) {
                    if (err) {
                        console.log('Device Id record update failed.. ' + err);
                    }
                    else{
                        res.json('success');
                        console.log('updated device username');
                        // console.log(docs);
                    }
                })
            }
        })

    })

    app.get('/api/wiredAnalog/:devId/:devIp',function(req,res){        
        Device.find({deviceId:req.params.devId,ipAddress:req.params.devIp}).lean().exec(function(err,rec){
            if(rec.length==1){
                // console.log(rec);
                if(!rec[0].status)
                    res.json('offline');
                else {
                    eventEmitter.emit('COMMON_CONFIG_DATA',rec[0].ipAddress,rec[0].deviceId,res,1)
                    // eventEmitter.emit('COMMON_CONFIG_DATA',rec[0].ipAddress,rec[0].deviceId)
                    // res.json('success');
                }
            }
        })
    });

    app.post('/api/uAnalogInput',function(req,res){
        
        Device.find({deviceId:req.body.devInfo.devId,ipAddress:req.body.devInfo.ipAddr}).lean().exec(function(err,rec){
            if(rec.length==1){
                // console.log(rec);
                if(!rec[0].status)
                    res.json('offline');
                else {
                    eventEmitter.emit('COMMON_CONFIG_DATA',rec[0].ipAddress,rec[0].deviceId,res,3)
                    eventEmitter.emit('UM_AIN1_CONFIG',rec[0].ipAddress,req.body.analog1);
                    eventEmitter.emit('UM_AIN2_CONFIG',rec[0].ipAddress,req.body.analog2);
                    // eventEmitter.emit('COMMON_CONFIG_DATA',rec[0].ipAddress,rec[0].deviceId)
                    // res.json('success');
                }
            }
        })
    })


}