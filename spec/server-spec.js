var assert = require('assert');
var expect = require('chai').expect;

describe('Hello Mongo', function() {
  describe('Finding Mongo', function() {
    it('should return delicious mango', function() {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});

describe('Hello SDC', function () {
  it('should print hello SDC', function () {
    expect('Hello SDC').to.be.a('string');
  });


});