
var config = require('.././config').config

var dbCredentials = {
    dbName : 'my_sample_db'
};

var db;


exports.initDBConnection = function() {
    
    if (process.env.VCAP_SERVICES) {
        var vcapServices = JSON.parse(process.env.VCAP_SERVICES);
        if (vcapServices.cloudantNoSQLDB) {
            dbCredentials.host = vcapServices.cloudantNoSQLDB[0].credentials.host;
            dbCredentials.port = vcapServices.cloudantNoSQLDB[0].credentials.port;
            dbCredentials.user = vcapServices.cloudantNoSQLDB[0].credentials.username;
            dbCredentials.password = vcapServices.cloudantNoSQLDB[0].credentials.password;
            dbCredentials.url = vcapServices.cloudantNoSQLDB[0].credentials.url;

			
			
        } else {
            console.warn('Could not find Cloudant credentials in VCAP_SERVICES environment variable - data will be unavailable to the UI');
        }
    } else {
        console.warn('VCAP_SERVICES environment variable not set - data will be unavailable to the UI');
        // For running this app locally you can get your Cloudant credentials 
        // from Bluemix (VCAP_SERVICES in "cf env" output or the Environment 
        // Variables section for an app in the Bluemix console dashboard).
        // Alternately you could point to a local database here instead of a 
        // Bluemix service.
        
        dbCredentials.host = config.cloudant.host;
        dbCredentials.port = config.cloudant.port;
        dbCredentials.user = config.cloudant.username;
        dbCredentials.password = config.cloudant.password;
        dbCredentials.url = config.cloudant.url;
    }
    
    cloudant = require('cloudant')(dbCredentials.url);
    
    // check if DB exists if not create
    cloudant.db.create(dbCredentials.dbName, function (err, res) {
        if (err) { console.log('could not create db ', err); }
    });
    
    exports.dbConnection = cloudant.use(dbCredentials.dbName);
}

