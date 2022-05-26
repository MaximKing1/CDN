const { Schema, model } = require('mongoose');

module.exports = model(
  'UserManager',
  Schema({
    userID: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    ip: { type: String, required: true },
  })
);
