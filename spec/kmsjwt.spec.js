var assert = require('assert'),
  jwt = require('jsonwebtoken'),
  mocha = require('mocha'),
  sinon = require('sinon');

var KmsJwt = require('../index.js'),
  testEnvVars = require('./test.env.inc.js');

var kmsArn = '',
  signingKey = '',
  publicKey = 'somesimplekindofkeywhichdoesnothing';

function createV2JwtPayload() {
  return {
    "aud": "DevSiteApiClient",
    "jti": "blahblahblahblahblahblahblahblah",
    "nbf": (Date.now() / 1000) - 60,
    "exp": (Date.now() / 1000) + 60,
    "sub": "Random-User-Id",
    "scopes": [
      "email:manage",
      "email:read"
    ],
    "bbcid": "Random-Client-Id"
  }
}

describe('KMS-JWT', function() {

  var testUser1, testUser2, jwtPayload1, jwtPayload2, tokenV1, tokenV2, randomToken;

  before(function () {
    jwtPayload2 = createV2JwtPayload();
    tokenV2 = jwt.sign(jwtPayload2, publicKey);
  });

  it('verifies JWT', function() {

    const kmsjwt = new KmsJwt();
    const retrieveStub = sinon.stub(kmsjwt, 'retrievePublicKey')
      .callsFake(function(token, callback) {
        this.publicKey = publicKey;
        callback(null, publicKey);
      });

    kmsjwt.verify(tokenV2, function (err, data) {
      assert(!err);
      assert(data !== null);
      assert(data.hasOwnProperty('aud'));
      assert(data.aud == 'DevSiteApiClient');
    });

  });

  it('createSigningKey calls kms.encrypt', function() {
    const kmsjwt = new KmsJwt();
    const spy = sinon.spy(kmsjwt.kms, 'encrypt');

    kmsjwt.createSigningKey(publicKey, function(err, result) {
      assert(spy.calledOnce);
    });
  });

  it('retrievePublicKey calls kms.decrypt', function() {
    const kmsjwt = new KmsJwt({signingKey: publicKey});
    const spy = sinon.spy(kmsjwt.kms, 'decrypt');

    kmsjwt.retrievePublicKey(tokenV2, function(err, result) {
      assert(spy.calledOnce);
    });
  });

});
