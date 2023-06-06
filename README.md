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
        
RipSecrets<br><br>
We implement pipeline secret scanning on all pull request events to prevent credentials from being merged. If the pipeline scanner detects a secret in your changed files it will gate the pull request and you will need to purge the found credential from your code and re-open the PR. To prevent getting gated by this tool and as best practice you should install the secret scanner locally in a pre-commit hook to prevent the secret from ever being committed to the repo in the first place. You can find documentation on how to set it up locally [here](https://bombbomb.atlassian.net/wiki/spaces/CORE/pages/2039775312/Pipeline+Secret+Scanner+Local+Setup)<br>
Ripsecrets has ways to bypass secret scanning although we should not be ignoring secrets that turn up in the scans. If something is out of your control and blocking the pipeline you can bypass it in one of the following ways<br>
1. Adding "# pragma: allowlist secret" to the end of the line with the secret.<br>
2. Adding the specific secret underneath the "[secrets]" block in .secretsignore<br>
3. Adding the filepath to ignore the whole file aboove the "[secrets]" block in .secretsignore