var Device = require('../model/device');
var config = require('../config/config.js');

module.exports = function(app,eventEmitter,passport) {

    app.get('/api/getDevices/:userId', passport.authenticate('jwt', { session: false }), function(req, res) {
            
            Device.find({email:req.params.userId}).lean().exec(function(err, rec) {
                if(err)
                    res.status(500).send({message:err.message});
                else
                    res.json(rec);
            });
        })

    app.get('/api/commonPrams/:devId',passport.authenticate('jwt', { session: false }), function(req, res) {
        Device.find({deviceId:req.params.devId}).lean().exec(function(err, rec) {
            if(err){
                console.log('Device search failed: '+err);
                 res.json('error');
            }
         if(rec.length==1){
            //  rec[0]['serverIP'] =config.ipAddresss;
            res.json(JSON.stringify({'rec':rec[0], 'serverIP':config.ipAddress}));
         }
            
        else
            res.json('failed');
        })
    })

    app.post('/api/regDevice',passport.authenticate('jwt', { session: false }), function(req, res) {
        Device.find({deviceId:req.body.devId}).lean().exec(function(err, rec) {
            if(err){
                console.log('Device search failed: '+err);
                 res.json('error');
            }
            else if(rec.length==1 && rec[0].email==''){
                Device.update({deviceId:req.body.devId}, {
                    $set: {
                        email: req.body.email,
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
            }else if(rec.length==1 && rec[0].email!='' )
                res.json('exists');
            else if(rec.length==0)
                res.json('failed');
        })

    })

    app.get('/api/wiredAnalog/:devId/:devIp',passport.authenticate('jwt', { session: false }), function(req, res) {       
        Device.find({deviceId:req.params.devId}).lean().exec(function(err,rec){
            if(rec.length==1){
                // console.log(rec);
                if(!rec[0].status)
                    res.json('offline');
                else {
                    // eventEmitter.emit('COMMON_CONFIG_DATA',rec[0].ipAddress+':'+rec[0].port,rec[0].deviceId,res)
                    // eventEmitter.emit('COMMON_CONFIG_DATA',rec[0].ipAddress,rec[0].deviceId)
                    res.json('success');
                }
            }else
                res.json('Device is in Offline');
        })
    });

    app.put('/api/remove/:devId/:ipAddr',passport.authenticate('jwt', { session: false }), function(req, res) {
        Device.find({deviceId:req.params.devId}).lean().exec(function(err,rec){
            if(rec.length==1){
                Device.update({deviceId:req.params.devId}, {
                    $set: {
                        email: '',
                        aliasName:''
                    }
                }).lean().exec(function (err, docs) {
                    if (err) {
                        console.log('Device Id record update failed.. ' + err);
                    }
                    else{
                        res.json('success');
                    }
                })

            }
        })
    })

    app.post('/api/updateCommonConfig',passport.authenticate('jwt', { session: false }), function(req, res) {
        console.log('updateCommonConfig called');
        // console.log(req.body);
        Device.find({deviceId:req.body.DEVICEID}).lean().exec(function(err,rec){
            if(rec.length==1){
                // console.log(rec);
                if(!rec[0].status)
                    res.json('Offline');
                else {
                    var key = rec[0].ipAddress+':'+rec[0].port;
                    // console.log(req.body.data);
                    eventEmitter.emit('UPDATE_COMMON_DATA',key,req.body);
                    eventEmitter.emit('COMMON_CONFIG_DATA',key,rec[0].deviceId,res)
                    
                }
            }
        })

    })

    // app.post('/api/set_common_config',passport.authenticate('jwt', { session: false }), function(req, res) {
    //     Device.find({deviceId:req.body.DEVICEID}).lean().exec(function(err,rec){
    //         if(rec.length==1){
    //             var key='';
    //             if(!rec[0].status)
    //                 key = '0.0.0.0:0';
    //              else
    //                 key = rec[0].ipAddress+':'+rec[0].port;
    //             eventEmitter.emit('UPDATE_COMMON_DATA',key,req.body);
    //             res.json('success');
    //         }
    //         else
    //             res.json('fail');
    //     });
    // })

    app.post('/api/wiredpoints',passport.authenticate('jwt', { session: false }), function(req, res) {
        // console.log(req)
        Device.find({deviceId:req.body.devInfo.devId}).lean().exec(function(err,rec){
            if(rec.length==1){
                // console.log(rec);
                if(!rec[0].status)
                    res.json('offline');
                else {
                    var key = rec[0].ipAddress+':'+rec[0].port;
                    eventEmitter.emit('UPDATE_COMMON_DATA',key,req.body.common);
                    eventEmitter.emit('COMMON_CONFIG_DATA',key,rec[0].deviceId,res,req.body.data)
                    
                }
            }
        })
    })


}