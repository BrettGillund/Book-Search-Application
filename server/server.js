const express = require('express');
const path = require('path');
const db = require('./config/connection');
const routes = require('./routes');
const app = express();
const PORT = process.env.PORT || 3001;
// apollo server
const { ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
// typedefs and resolvers 
const { typeDefs, resolvers } = require('./graphql')


app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

const serverStart = async (typeDefs, resolvers) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: authMiddleware
  })
  await server.start();
  server.applyMiddleware({app});

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Now listening on localhost:${PORT}`)
      console.log(`Open GraphQL at http://localhost:${PORT}${server.graphqlPath}`)});
  });
}

serverStart(typeDefs, resolvers);