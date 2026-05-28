const mongoose = require('mongoose');

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


UserSchema.plugin(passportLocalMongoose, {
  usernameField: "email"
});

module.exports = mongoose.model('User', UserSchema);