import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // For Google-authenticated users
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String }, // Only manual sign-up users will have this
  picture: { type: String, default: null },
  referralCode: {type: String, default: null},
  privileges: {type: String, default: "user"},
  emailVerified: {type: Boolean, default: false}, 
  phoneNumber: {type: Boolean, default: false}, 
  suspended: {type: Boolean, default: false},
  profile: {
    address: {type: String, default: null},
    dateOfBirth: {type: String, default: null},
    phone: {type: String, default: null}
  },
  location: {
    coordinates: {
      type: [Number],
      index: "2dsphere",
      default: []
    }
  },
  account_id: {type: String, default: null, ref:"SubAccount"},
  sub_account: {type: String, default: null},
  fcmToken: {type: String, default: null}
});

const UserModel = mongoose.model("user", UserSchema);
export default UserModel;