// config/database.js
module.exports = {
    'dbUri' : 'mongodb://localhost:27017/tangent', 
    'ipAddress': '127.0.0.1',
    'COMMON_CONFIG':{
                        "PACKET_ID":"COMMON_CONFIG_DATA",
                        "GPS_EN_STATUS":"DIASBLE",
                        "DEVICEID":"XYZUVWCD123",
                        "CUSTOMER_ID":"",
                        "DS_IPADDR":"",
                        "DS_PORTNUMBER":1025,
                        "TS_IPADDR":'',
                        "TS_PORTNUMBER":21,
                        "PROTOCOL_SELECTED":0,
                        "DATA_FORMAT":0
                    },

    'UM_AIN_CONFIG':{
                        "PACKET_ID":"UM_AIN_CONFIG",
                        "AIN2_STATUS":"ENABLE",
                        "AIN2_NAME":"Battery_Voltage",
                        "AIN2_SCALEFACTOR":20.6,
                        "AIN2_OFFSET":20.6,
                        "AIN2_RATE":1
                    },

    


};