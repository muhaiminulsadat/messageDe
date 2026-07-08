import mongoose, {Schema} from "mongoose";

export interface IUser {
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  fullName?: string;
  profilePic?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    emailVerified: {type: Boolean, required: true},
    image: {type: String},
    fullName: {type: String},
    profilePic: {type: String},
    password: {type: String},
  },
  {
    timestamps: true,
    collection: "user",
  },
);

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
