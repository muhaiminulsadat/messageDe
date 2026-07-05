import mongoose, {Schema} from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  emailVerified: boolean;
  profilePic?: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    emailVerified: {type: Boolean, required: true},
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
