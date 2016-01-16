

var db = require('.././db/db')
var dal = require('.././db/dal')
var survey = require('.././objects/item')
var Twitter = require('twitter')
var config = require('.././config').config

var client = new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
});

var params = { screen_name: 'nodejs' };


var welcomStr = "Welcome to Swaachh Bharat Survey."
var enterPINStr = " To continue please enter your six digit area pin code.<playtext></playtext> followed by the pound key"
var Q1 = 'Question one, rate your city in cleaniness from a scale of one  to ten. <playtext></playtext> followed by the pound key'
var Q2 = 'Question two, Do you segregate your waste at home, into dry waste and wet waste.<playtext></playtext>  please press one for yes. <playtext></playtext> or press two for no'
var Q3 = 'Question three, Do you feel Swaachh Bharat is working. <playtext></playtext> please press one for yes.<playtext></playtext>  or press two for no'
var Q4 = ''
var thankStr = 'Thank you for taking this survey'
var alreadyDoneStr = 'A survey has already registered from the number'
var returningCallStr = 'Welcome back, your survey will continue now '
var sorryStr = 'Sorry did not catch that'

exports.validateCall = function (request, response) {
    
    
    response.set('Content-Type', 'text/xml')
    console.log(request.query);
    
    //if (request.query.event == 'NewCall') {
    
    var phnum = request.query.cid.substring(request.query.cid.length - 10, request.query.cid.length)
    
    console.log("Got new call from " + phnum)
    
    var surveyItem;
    
    dal.GetItemByPhnum(phnum, function (result, id) {
        if (!result.docs.length > 0) {
            
            
            
            //new data
            var member = result.docs[0];
            response.write("<response><playtext>" + welcomStr + "</playtext><collectdtmf l=\"6\" t=\"#\" o=\"5000\"><playtext>" + enterPINStr + "</playtext></collectdtmf></response>");
            
            var hiddenPhun = phnum
            hiddenPhun = hiddenPhun.replaceAt(2, 'X')
            hiddenPhun = hiddenPhun.replaceAt(3, 'X')
            hiddenPhun = hiddenPhun.replaceAt(4, 'X')
            hiddenPhun = hiddenPhun.replaceAt(5, 'X')
            
            
            surveyItem = {}
            surveyItem.phnum = phnum
            surveyItem.status = 1
            surveyItem.type = 'survey'
            
            surveyItem.data = {}
            
            surveyItem.data.isCompleted = false
            surveyItem.data.A1 = ''
            surveyItem.data.A2 = ''
            surveyItem.data.A3 = ''
            surveyItem.data.A4 = ''
            surveyItem.data.PIN = ''
            surveyItem.data.hiddenPhun = hiddenPhun
         

        }
        else {
            
            var doc = result.docs[0];
            
            var responseStr = '<response>'
            
            if (request.query.event == 'NewCall') {
                
                responseStr = responseStr + '<playtext>'
                
                if (doc.status >= 4) {
                    responseStr = responseStr + alreadyDoneStr
                }
                else {
                    responseStr = responseStr + returningCallStr
                }
                
                
                responseStr = responseStr + '</playtext>'


            } else if (request.query.event == 'GotDTMF') {
                
                if (request.query.data.trim() != '' || request.query.data.trim() != '#')
                    updateDoc(doc, request.query.data);
                else
                    responseStr = responseStr + '<playtext>' + sorryStr + '</playtext>'

            }
            
            var str = getResponseString(doc)
            
            responseStr = responseStr + str + '</response>'
            
            response.write(responseStr);
            surveyItem = doc;
        }
        console.log(request.query.event);
        console.log('\n Sending backsasa... \n');
        response.end()
        
        
        db.dbConnection.insert(surveyItem, phnum, function (err, doc) {
            if (err) {
                console.log(err);
                           // response.sendStatus(500);
            } else { }
                          //  response.sendStatus(200);
                      
        });
            
    }

    );
    
    console.log('Pin entered correctly');
   
}

function updateDoc(doc, DTMF) {
    
    switch (doc.status) {

        case 1: doc.data.PIN = DTMF; break;
        case 2: doc.data.A1 = DTMF; break;
        case 3:
            {
                if (DTMF == 1)
                    doc.data.A2 = 'Yes';
                else
                    doc.data.A2 = 'No';
                break;
            }
        case 4:
            {
                if (DTMF == 1)
                    doc.data.A3 = 'Yes';
                else
                    doc.data.A3 = 'No';
                break;
            }
        
        default:
    }
    
    if (doc.status >= 4) {
        doc.data.isCompleted = true;
        
        var tweetStr = "Thank you " + doc.data.hiddenPhun + " for taking up Swachh Bharat Survey. Take your survey now call 08067947486. #SwachhBharatSurvey"
        
        client.post('statuses/update', { status: tweetStr }, function (error, tweet, response) {
            if (!error) {
                console.log(tweet);

            } else
                console.log('ERROR : ' + error)
        });
    }
    else
        doc.status++;

};

function getResponseString(doc) {
    
    if (doc.data.isCompleted) {
        return "<playtext>" + thankStr + "</playtext><hangup/>"
    }
    
    switch (doc.status) {

        case 1: return "<collectdtmf t=\"#\" o=\"8000\"><playtext>" + enterPINStr + "</playtext></collectdtmf>"; break;
        case 2: return "<collectdtmf t=\"#\" o=\"8000\"><playtext>" + Q1 + "</playtext></collectdtmf>"; break;
        case 3: return "<collectdtmf l=\"1\" t=\"#\" o=\"8000\"><playtext>" + Q2 + "</playtext></collectdtmf>"; break;
        case 4: return "<collectdtmf l=\"1\" t=\"#\" o=\"8000\"><playtext>" + Q3 + "</playtext></collectdtmf>"; break;
  
        
        default: return "<playtext>" + thankStr + "</playtext><hangup/>"; break;
    }
    

};

exports.getAllSurveyData = function (request, response) {
    
    response.set('Content-Type', 'application/json')
    
    
    
    dal.GetAllSurveyItem(function (result) {
        
        var data = []
        
        if (result != null && result.docs.length > 0) {
            for (var i = 0; i < result.docs.length ; i++) {
                data.push(result.docs[i].data)
            };
            
        }
        
        response.write(JSON.stringify(data))
        response.end()

    })
};



exports.register = function (request, response) {
    if (request.method == 'POST') {
        var body = '';
        
        request.on('data', function (data) {
            body += data;
            
            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });
        
        request.on('end', function () {
            var post = JSON.parse(body);
            
            
            
            dal.GetItemByMember(post, function (result, member) {
                
                if (result.docs.length > 0) {

                }
                else {
                    db.dbConnection.insert({
                        name : post.name,                
                        confId : post.confId,
                        phnum : post.phnum
                    }, post.phnum, function (err, doc) {
                        if (err) {
                            console.log(err);
                           // response.sendStatus(500);
                        } else { }
                          //  response.sendStatus(200);
                      
                    });
                }
            }
            );
            
            if (post.members.length > 0) {
                for (var i = 0; i < post.members.length ; i++) {
                    
                    var member = post.members[i];
                    
                    dal.GetItemByMember(member, function (result, member) {
                        
                        if (result.docs.length > 0) {

                        }
                        else {
                            db.dbConnection.insert({
                                name : member.name,                
                                confId : member.confId,
                                phnum : member.phnum
                            }, member.phnum, function (err, doc) {
                                if (err) {
                                    console.log(err);
                                  //  response.sendStatus(500);
                                } else { }
                                    //response.sendStatus(200);
                                
                            });
                        }
                    }
                    );

                };
                

            }
            response.sendStatus(200);
            response.end();

            //db.dbConnection.insert({
            //    name : post.name,                
            //    confId : post.confId,
            //    phnum : post._id
            //            },post._id, function (err, doc) {
            //    if (err) {
            //        console.log(err);
            //        response.sendStatus(500);
            //    } else
            //        response.sendStatus(200);
            //    response.end();
            //});

            // use post['blah'], etc.
        });
    }
};

String.prototype.replaceAt = function (index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
}
