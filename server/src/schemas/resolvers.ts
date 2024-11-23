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
    me: async (_ : any, __ : any, context : any) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      return User.findById(context.user._id);
    },
  },
  Mutation: {
    login: async (_ : any, { email, password }: UserLogin )=> {
      const user = await User.findOne({ email });
      if (!user || !(await user.isCorrectPassword(password))) {
        throw new AuthenticationError("Incorrect credentials");
      }
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    addUser: async (_ : any, { username, email, password }: UserSignup) => {
      const user = await User.create({ username, email, password });
      const token = signToken(user.username, user.email, user._id);
      return { token, user };
    },
    saveBook: async (_ : any, { bookData }:BookData, context : any) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      return User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true }
      );
    },
    removeBook: async (_ : any, { bookId }: { bookId: string }, context : any) => {
      if (!context.user) throw new AuthenticationError("Not logged in");
      return User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
    },
  },
};