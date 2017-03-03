var Device = require('../model/device');

module.exports = function(app) {
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

    app.get('/api/wiredAnalog/:devId',function(req,res){
        console.log(req.params.devId);
        res.json('success');
    })


}