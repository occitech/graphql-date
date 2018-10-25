var describe = global.describe;
var it = global.it;

var expect = require("chai").expect;
var Kind = require("graphql/language").Kind;

var GraphQLDate = require("../index.js");

describe("GraphQLDate", function() {
  describe("serialize", function() {
    it("should error when serializing a string value", function(done) {
      var str = "2015-07-24T10:56:42.744";
      expect(GraphQLDate.serialize.bind(GraphQLDate, str)).to.throw(
        /not an instance of Date/
      );
      done();
    });

    it("should error when serializing a string value", function(done) {
      var date = new Date("invalid");

      expect(GraphQLDate.serialize.bind(GraphQLDate, date)).to.throw(
        /an invalid Date/
      );
      done();
    });

    it("should serialize a date value", function(done) {
      var str = "2015-07-24T10:56:42.744";
      var date = new Date(str);
      var userTimezoneOffset = date.getTimezoneOffset() * 60000;
      var dateWithoutTimezone = new Date(date.getTime() - userTimezoneOffset);

      expect(GraphQLDate.serialize(dateWithoutTimezone)).to.equal(str);
      done();
    });
  });

  describe("parseValue", function() {
    it("should error when serializing a string value", function(done) {
      var str = "invalid";

      expect(GraphQLDate.parseValue.bind(GraphQLDate, str)).to.throw(
        /an invalid Date/
      );
      done();
    });

    it("should parse a value to date", function(done) {
      var str = "2015-07-24T10:56:42.744";
      var date = GraphQLDate.parseValue(str);
      expect(date).to.be.an.instanceOf(Date);
      expect(date.toJSON().slice(0, 23)).to.equal(str);
      done();
    });
  });

  describe("parseLiteral", function() {
    it("should error when parsing a ast int", function(done) {
      var ast = {
        kind: Kind.INT
      };
      expect(GraphQLDate.parseLiteral.bind(GraphQLDate, ast)).to.throw(
        /only parse strings/
      );
      done();
    });

    it("should error when parsing ast w/ invalid value", function(done) {
      var ast = {
        kind: Kind.STRING,
        value: "invalid"
      };
      expect(GraphQLDate.parseLiteral.bind(GraphQLDate, ast)).to.throw(
        /Invalid date$/
      );
      done();
    });

    it("should error when parsing ast w/ invalid value format", function(done) {
      var ast = {
        kind: Kind.STRING,
        value: "2015-07-24T10:56:42" // doesnt have ms in format
      };
      expect(GraphQLDate.parseLiteral.bind(GraphQLDate, ast)).to.throw(
        /Invalid date format/
      );
      done();
    });

    it("should parse a ast literal", function(done) {
      var ast = {
        kind: Kind.STRING,
        value: "2015-07-24T10:56:42.744"
      };
      var date = GraphQLDate.parseLiteral(ast);
      expect(date).to.be.an.instanceOf(Date);
      expect(date.toJSON().slice(0, 23)).to.equal(ast.value);
      done();
    });
  });

  it("should keep a date intact", function(done) {
    var date = new Date();
    var str = GraphQLDate.serialize(date);
    var result = GraphQLDate.parseValue(str);
    expect(result.toJSON()).to.equal(date.toJSON());
    done();
  });
});
