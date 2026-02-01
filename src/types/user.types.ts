import mongoose from 'mongoose';

export interface IExperience {
  designation?: string;
  company_name?: string;
  duration?: string;
  loaction?: string;
}

export interface IUser {
  _id: mongoose.Types.ObjectId;
  googleId?: string;
  email: string;
  password?: string;
  f_name?: string;
  headline?: string;
  curr_company?: string;
  curr_location?: string;
  profile_pic?: string;
  cover_pic?: string;
  about?: string;
  skills?: string[];
  resume?: string;
  experience?: IExperience[];
  friends?: mongoose.Types.ObjectId[];
  pending_friends?: mongoose.Types.ObjectId[];
  createdAt?: Date;
  updatedAt?: Date;
}
