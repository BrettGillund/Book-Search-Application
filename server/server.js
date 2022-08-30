const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const app = express();
const PORT = process.env.PORT || 3001;
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   // csrfPrevention: true,
//   // cache: 'bounded',
// })


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// server.applyMiddleware({app})

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

const serverStart = async (typeDefs, resolvers) => {
  const apollo_server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  })
  await apollo_server.start();
  apollo_server.applyMiddleware({app});

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`Use GraphQL at http://localhost:${PORT}${apollo_server.graphqlPath}`)});
  });
}

serverStart(typeDefs, resolvers);