const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models/User');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        me: async(_parent, _args, context) => {
            console.log(context)
            if(context.user) {
                return await User.findOne({
                    _id: context.user._id
                }).select()
            }
            throw new AuthenticationError('login error!!!!')
        }
    },
    Mutation: {
        login: async(_parent, args, _context) => {
            console.log(args)
            const user = await User.findOne({
                username: args.username
            })
            if(!user) {
                throw new AuthenticationError('Username or Password is invalid!')
            }
            const password = await user.isCorrectPassword(args.password)
            if(!password) {
                throw new AuthenticationError('Username or Password is invalid!')
            }
            const token = await signToken(user);
            return { user, token }
        },

        addUser: async (_, { username, email, password }) => {
            const user = await User.create({username, email, password})
            const token = signToken(user);
            return {token, user }
        },

        saveBook: async (_, {bookId, authors, description, title, image, link}, context) => {
                console.log(context.user._id)
                return await User.findOneAndUpdate(
                    {_id: context.user._id}, 
                    {
                        $addToSet: { savedBooks: {
                            bookId,
                            authors, 
                            description, 
                            title, 
                            image, 
                            link
                            }
                        }
                    }, 
                    {
                        new: true, 
                        runValidators: true
                    }
                );
        },

        removeBook: async (_, { userId, bookId }) => {
            return await User.findOneAndUpdate(
                { _id: userId }, 
                { $pull: { savedBooks: { _id: bookId } } }, 
                { new: true }
            )
        }

    }
}

module.exports = resolvers;