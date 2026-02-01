import mongoose from 'mongoose';
import type { IUser } from '../types';
import { createModel } from '../utils/createModel';

const UserSchema = new mongoose.Schema({
  googleId: { type: String },
  email: { type: String, required: true },
  password: { type: String },
  f_name: { type: String, default: '' },
  headline: { type: String, default: '' },
  curr_company: { type: String, default: '' },
  curr_location: { type: String, default: '' },
  profile_pic: {
    type: String,
    default:
      'https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI='
  },
  cover_pic: {
    type: String,
    default:
      'https://img.freepik.com/premium-photo/hand-holds-user-person-icon-interface-blue-background-user-symbol-your-web-site-design-logo-app-ui-banner_150455-5212.jpg'
  },
  about: { type: String, default: '' },
  skills: { type: [String], default: [] },
  resume: { type: String },
  experience: [
    {
      designation: { type: String },
      company_name: { type: String },
      duration: { type: String },
      loaction: { type: String }
    }
  ],
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
  pending_friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
}, { timestamps: true });

const UserModel = createModel<IUser>('user', UserSchema);
export default UserModel;