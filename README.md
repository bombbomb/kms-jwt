# kms-jwt

Use encrypted public and private keys through KMS to validate JWT signatures.

Usage:

        var publicJwt = new KmsJwt({
            awsConfig: {
                region: process.env.AWS_REGION,
                accessKeyId : process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            },
            signingKey: signingKey
        });
        
        publicJwt.verify(jwt,function(err,decodedToken){
            if (err)
            {
                // handle invalid or expired token
            }
            else
            {
                // utilize decodedToken Payload
            }
        });
        
        
Create a Signing Key:

        var tokenSigner = new KmsJwt({
            awsConfig: {
                region: process.env.AWS_REGION,
                accessKeyId : process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_KEY
            },
            keyArn: kmsArn
        });

        tokenSigner.createSigningKey(publicOrPrivateKey,function(err,encryptedBase64EncodedKey){

            // store encryptedBase64EncodedKey where ever you want

        });
        