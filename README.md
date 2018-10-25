# graphql-date-timezoneless [![Build Status](https://travis-ci.org/occitech/graphql-date-timezoneless.svg)](https://travis-ci.org/occitech/graphql-date-timezoneless)

GraphQL Date Timezoneless Type

# Installation

```bash
npm i --save occitech/graphql-date-timezoneless
```

# Usage

```js
var GraphQLDateTimezoneless = require("graphql-date-timezoneless");

// Use graphql-date in your GraphQL objects for Date properties
var fooType = new GraphQLObjectType({
  name: "Foo",
  description: "Some foo type",
  fields: {
    created: {
      type: GraphQLDateTimezoneless,
      description: "Date foo was created"
    }
  }
});

var queryType = new GraphQLObjectType({
  name: "Query",
  fields: {
    foo: {
      type: fooType,
      resolve: function() {
        // ...
      }
    }
  }
});
```

# License

MIT
