var chai = require('chai');

chai.should();
var expect = chai.expect;
var assert = chai.assert;

describe('basic test', function () {
  describe('SDC Mongo', function () {
    it('data check', function () {
      var data = { name: 'test' };

      assert.isNotNull(data, 'data should not be null');
      expect(data).to.be.an('object');
      expect(data).to.have.all.keys(['name']);
      expect(data).to.deep.include({name: 'test'});
    });
  });
});