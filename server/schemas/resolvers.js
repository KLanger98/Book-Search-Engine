const {User} = require('../models');
const {signToken, AuthenticationError} = require('../utils/auth')



const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (parent, {userId}) => {
            return User.findOne({_id: userId})
        },
        me: async (parent, args, context) => {
            if(context.user) {
                return User.findOne({_id: context.user._id})
            }
            throw AuthenticationError;
        }
    },

    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user){
                throw AuthenticationError;
            }

            //Check password
            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                throw AuthenticationError;
            }
            const token = signToken(user);
            return {token, profile};
        },

        addUser: async (parent, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user)

            return {token, user}
        },

        saveBook: async (parent, {bookId, userId, authors, description, title, image, link}) => {
            return User.findOneAndUpdate(
                {_id: userId},
                {$addToSet: {savedBooks: {bookId, authors, description, title, image, link}}},
                {
                new: true,
                runValidators: true
                })
        },


        removeBook: async (parent, {userId, bookId}) => {
            return User.findOneAndUpdate(
                {_id: userId},
                {$pull: {savedBooks: {bookId: bookId}}},
                {new: true}
            )
        }

    }
}

module.exports = resolvers;