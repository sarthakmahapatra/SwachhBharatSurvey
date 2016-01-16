
var db = require('./db.js');

exports.GetItemByMember = function (member,callback) {

    db.dbConnection.find({ selector: { phnum : member.phnum } }, function (er, result) {
        console.log('Find returned ' + result)
        if (er) {
            console.log(ex);
            throw er;
        }
        
        
        callback(result, member);
    });
};

exports.GetAllSurveyItem = function (callback) {

    db.dbConnection.find({ selector: { type : 'survey' } }, function (er, result) {
        console.log('Find returned ' + result)
        if (er) {
            throw er;
        }
        
        
        callback(result);
    });
};



    exports.GetItemByPhnum = function (id, callback) {
        
    db.dbConnection.find({ selector: { phnum : id } }, function (er, result) {
        console.log('Find returned ' + result)
            if (er) {
                throw er;
            }
            
            
            callback(result, id);
        });
    //db.dbConnection.search('name', 'confId', { q: 'phnum:9886703616' }, function (er, result) {
    //    if (er) {
    //        throw er;
    //    }
        
    //    console.log('Showing %d out of a total %d books by Dickens', result.rows.length, result.total_rows);
    //    for (var i = 0; i < result.rows.length; i++) {
    //        console.log('Document id: %s', result.rows[i].id);
    //    }
    //});
};