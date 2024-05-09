const {User} = require('../models');
const {signToken} = require('../utils/auth')

const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        user: async (parent, {userId}) => {
            return User.findOne({_id: userId})
        }
    },

    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            if(!user){
                //Throw error
            }

            //find correct password
            const correctPw = await user.isCorrectPassword(password);

            if(!correctPw){
                //throw error
            }
            const token = signToken(user);
            return {token, profile};
        },

        addUser: async (parent, {name, email, password}) => {
            const user = await User.create({name, email, password});
            const token = signToken(profile);
        },

        saveBook: async (parent, {userId, bookId}) => {
            return User.findOneAndUpdate(
                {_id: userId},
                {$addToSet: {books}},
                {new: true})
        },


        removeBook: async (parent, {bookId}) => {
            return User.find
        }

    }
}

module.exports = resolvers;