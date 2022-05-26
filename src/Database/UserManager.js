const { Schema, model } = require('mongoose');

module.exports = model(
  'UserManager',
  Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now() },
    ip: { type: String, required: true },
  })
);
