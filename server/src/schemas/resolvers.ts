import { AuthenticationError } from "apollo-server-express";
import User from "../models/User.js";
import { signToken } from "../services/auth.js";
import { BookDocument } from "../models/Book.js";



interface UserLogin {
  email: string;
  password: string;
}
interface UserSignup {
  username: string;
  email: string;
  password: string;
}
interface BookData {
  bookData: BookDocument;
}

export const resolvers = {
  Query: {
    me: async (_parent: any, _args : any, context : any) => {
      console.log('Me Query context:',context);
      console.log('Context user:',context.user);
      if (!context.user){
        console.log('No user in context');
        throw new AuthenticationError("Not logged in");}
      return User.findById(context.user._id);
    },
  },
  // Query: {
  //   me: async (_parent: any, __args: any, context: any) => {
  //     const { user } = context;

  //     if (!user) {
  //       throw new AuthenticationError('You must be logged in to view this information');
  //     }
  //     try {
  //     // Fetch and return user data
  //     const foundUser = await User.findById(user._id).populate('savedBooks');
  //     return foundUser;
  //   } catch (err) {
  //     console.error('Error fetching user data:', err);
  //     throw new AuthenticationError('Error fetching user data');
  //   }
  // },

  Mutation: {
    login: async (_parent: any, { email, password }: UserLogin )=> {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user.username, user.email, user._id);
      console.log("Token in Resolver File:", token);
      //Client side
      return { token, user };
    },
    addUser: async (_parent : any, { username, email, password }: UserSignup) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      console.log('Token', token);
      return { token, user };
    },
    saveBook: async (_parent: any, { bookData }:BookData, context : any) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true }
      );
    },
    removeBook: async (_parent : any, { bookId }: { bookId: string }, context : any) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
}
export default resolvers;