const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.remvToken = functions.https.onRequest((req, res)=>{
    var time = `${new Date().getHours()}:${new Date().getMinutes()}`;
    var currentTimeStamp = new Date().getTime(time);

    admin.database().ref('/users').on('value', snap => {
        snap.forEach(snapshot => {
            var data = snapshot.val();
            var key = snapshot.key;
            var checkAcc = data.accType;
            
            if(checkAcc === "company"){
                var checkTokenDetails = data.tokenDetails;
                var timeStamp = new Date().getTime(data.timings.endTime);
                if(checkTokenDetails){
                    if(timeStamp === currentTimeStamp){
                        admin.database().ref('/token/' + key + '/registeredToken').remove()
                        .then((res)=>{
                            if(!checkTokenDetails.dailySettings){
                                admin.database().ref('/users/' + key + '/tokenDetails').remove();
                            }
                            else{
                                console.log(data);
                            }
                            return res;
                        })
                        .catch((err)=>{
                            console.log(err.message);
                        })
                    }
                }

            }
        })
    });
    return res.status(200).end();
})
