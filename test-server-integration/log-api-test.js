'user strict';
var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);

describe('log-api', function() {
  var csrfToken, connectsid;

  it('should correctly log a debug message', function(done){
    const bodyMock = {
      "message" : "message to log"    
    };

    agent
    .post('/api/log/debug')
    .set('Content-Type', 'application/json') //set header for this test
    .set('Accept', 'application/json')
    .send(bodyMock)
    .expect(200) //Status code
    // end handles the response
    .end(function(err, res) {
      console.log("called");
      if (err) {
        console.log(err);
        return done(err);
      } else {
        console.log("---res.body---");
        console.log(res.body);
        console.log("--------------");

        expect(res.body.info).to.equal("debug logged on server");
        expect(res.body.body.message).to.equal(bodyMock.message);
      }
      done();  
    });
  });

  it('should correctly log an error message', function(done){
    const bodyMock = {
      "message" : "message to log"    
    };

    agent
    .post('/api/log/error')
    .set('Content-Type', 'application/json') //set header for this test
    .set('Accept', 'application/json')
    .send(bodyMock)
    .expect(200) //Status code
    // end handles the response
    .end(function(err, res) {
      console.log("called");
      if (err) {
        console.log(err);
        return done(err);
      } else {
        console.log("---res.body---");
        console.log(res.body);
        console.log("--------------");

        expect(res.body.info).to.equal("error logged on server");
        expect(res.body.body.message).to.equal(bodyMock.message);
      }
      done();  
    });
  });

  it('should correctly log an exception message', function(done){

    const bodyMock = {
      errorUrl: "http://localhost/fake url",
      errorMessage: "dsadasdasd",
      cause: ( "cause" || "" )
    };

    agent
    .post('/api/log/exception')
    .set('Content-Type', 'application/json') //set header for this test
    .set('Accept', 'application/json')
    .send(bodyMock)
    .expect(200) //Status code
    // end handles the response
    .end(function(err, res) {
      console.log("called");
      if (err) {
        console.log(err);
        return done(err);
      } else {
        console.log("---res.body---");
        console.log(res.body);
        console.log("--------------");

        expect(res.body.info).to.equal("Exception logged on server");
        expect(res.body.body.errorUrl).to.equal(bodyMock.errorUrl);
        expect(res.body.body.errorMessage).to.equal(bodyMock.errorMessage);
        expect(res.body.body.cause).to.equal(bodyMock.cause);
      }
      done();  
    });
  });
});