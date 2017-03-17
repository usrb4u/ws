var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../server');
var should = chai.should();
var expect = chai.expect();

chai.use(chaiHttp);

describe("Device", function(){
    it('should list all devices of a user', function() {
        chai.request(server)
            .get('/api/getDevices/Srinivas')
            .end(function(err, res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body[0].should.be.a('array');
                res.body[0].should.have.property('deviceId');
                res.body[0].should.have.property('ipAddress');              
                res.body[0].should.have.property('aliasName');              
                res.body[0].should.have.property('userName');              
                res.body[0].should.have.property('regDate');              
                done();
            });
    });
});