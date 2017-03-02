var assert      = require('assert'),
    jwt         = require('jsonwebtoken'),
    mocha       = require('mocha');

var KmsJwt      = require('../index.js'),
    testEnvVars = require('./test.env.inc.js');

var kmsArn = 'arn:aws:kms:us-east-1:286551237558:key/65710878-2067-49c4-a540-2c787ed9de77',
    signingKey = "",
    pubicKey = 'somesimplekindofkeywhichdoesnothing';

describe('Base Tests',function(){

    it('create signing key',function (done) {

        var kmsJwt = new KmsJwt({
            awsConfig: {
                region: process.env.AWS_REGION,
                accessKeyId : process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            },
            keyArn: kmsArn
        });

        kmsJwt.encrypt(pubicKey,function(err,data){
            signingKey = data;
            assert(err == null,'');
            done();
        });

    });

    it('verify jwt with signing key',function(done){

        var kmsJwt = new KmsJwt({
            awsConfig: {
                region: process.env.AWS_REGION,
                accessKeyId : process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            },
            keyArn: kmsArn,
            signingKey: signingKey
        });

        var jwtToken = jwt.sign({ user: 'secretMan', abilities: 'breaking things' }, pubicKey);

        kmsJwt.verify(jwtToken,function(err,data){
            console.log('fun',data);
            assert(err == null,'');
            assert(data.user == "secretMan",'');
            done();
        });

    });

});