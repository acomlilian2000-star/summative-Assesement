const mongoose = require('mongoose');

// FIX: Add .default || to handle object wrapper imports safely
const passportLocalMongoose = require('passport-local-mongoose').default || require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  PhoneNumber: {
    type: String, 
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Now this will receive the correct function parameter instead of an object
UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model('User', UserSchema);