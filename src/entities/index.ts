import mongoose from 'mongoose';
import { userSchema } from './user.entity';
import Book from './book.entity';

//Create the model class
const User = mongoose.model('users', userSchema);
const entities = [User, Book];
export { User, Book };
export default entities;
