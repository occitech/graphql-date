var assertErr = require("assert-err");
var GraphQLScalarType = require("graphql").GraphQLScalarType;
var GraphQLError = require("graphql/error").GraphQLError;
var Kind = require("graphql/language").Kind;

module.exports = new GraphQLScalarType({
  name: "DateTimezoneless",
  /**
   * Serialize date value into string
   * @param  {Date} value date value
   * @return {String} date as string
   */
  serialize: function(value) {
    assertErr(
      value instanceof Date,
      TypeError,
      "Field error: value is not an instance of Date"
    );
    assertErr(
      !isNaN(value.getTime()),
      TypeError,
      "Field error: value is an invalid Date"
    );
    return value.toJSON().slice(0, 23);
  },
  /**
   * Parse value into date
   * @param  {*} value serialized date value
   * @return {Date} date value
   */
  parseValue: function(value) {
    var date = new Date(value);
    var result = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    assertErr(
      !isNaN(result.getTime()),
      TypeError,
      "Field error: value is an invalid Date"
    );
    return result;
  },
  /**
   * Parse ast literal to date
   * @param  {Object} ast graphql ast
   * @return {Date} date value
   */
  parseLiteral: function(ast) {
    assertErr(
      ast.kind === Kind.STRING,
      GraphQLError,
      "Query error: Can only parse strings to dates but got a: " + ast.kind,
      [ast]
    );

    var astDate = new Date(ast.value);
    var result = new Date(
      astDate.getTime() - astDate.getTimezoneOffset() * 60000
    );

    assertErr(
      !isNaN(result.getTime()),
      GraphQLError,
      "Query error: Invalid date",
      [ast]
    );
    assertErr(
      ast.value === result.toJSON().slice(0, 23),
      GraphQLError,
      "Query error: Invalid date format, only accepts: YYYY-MM-DDTHH:MM:SS.SSS",
      [ast]
    );

    return result;
  }
});
