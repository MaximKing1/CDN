const mongoose = require('mongoose');

const UserManager = mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  ip: { type: String, required: true },
});

// export model user with UserSchema
module.exports = mongoose.model('UserManager', UserManager);
