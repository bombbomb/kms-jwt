var AWS     = require('aws-sdk');
var jwt     = require('jsonwebtoken');

function KmsJwt(options)
{

    options = options || { awsConfig: {}, keyArn: null, signingKey: null };

    this.signingKey = options.signingKey;
    this.keyArn = options.keyArn;

    this.publicKey = null;
    this.kms = new AWS.KMS(options.awsConfig);

}

KmsJwt.prototype.encrypt = function(publicKey, callback)
{
    try
    {
        var params = {
            Plaintext: publicKey,
            KeyId: this.keyArn
        };
        this.kms.encrypt(params,function(err,data){
            var result = null;
            if (!err && data.CiphertextBlob)
            {
                result = data.CiphertextBlob.toString('base64');
            }
            callback(err,result);

        });

    }
    catch(e)
    {
        callback(e,null);
    }
};

KmsJwt.prototype.retrievePublicKey = function(token, callback)
{
    try
    {
        var self = this;
        if (this.keyArn)
        {
            this.kms.decrypt({ CiphertextBlob : new Buffer(this.signingKey, 'base64') },function(err,data){
                if (!err)
                {
                    self.publicKey = data.Plaintext.toString();
                }
                callback(err,data);
            });
        }
    }
    catch(e)
    {
        callback(e,null);
    }
};

KmsJwt.prototype.verify = function(token, callback)
{

    var self = this;
    var verifyToken = function(token,callback) {
        try
        {
            var decoded = jwt.verify(token, self.publicKey);
            if (decoded.hasOwnProperty('exp') && decoded.exp < Date.now()/1000)
            {
                callback("JWT token expired",null);
            }
            else
            {
                callback(null, decoded);
            }
        }
        catch (e)
        {
            callback(e.message);
        }
    };

    if (!this.publicKey)
    {
        this.retrievePublicKey(token,function(err, data){
            if (err)
            {
                callback(err,null);
            }
            else
            {
                verifyToken(token,callback);
            }
        });
    }
    else
    {
        verifyToken(token,callback);
    }

};


module.exports = KmsJwt;
