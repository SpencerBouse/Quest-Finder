"use strict";

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema   = new Schema({
    first: {
      type: String,
      required: true
      },
    last: {
      type: String,
      required: true
      },
    username: {
      type: String,
      required: true
      },
    password: {
      type: String,
      required: true
      },
    imgsource: {
      type: String
      },
    description: {
      type: String
      },
    token: String
});

module.exports = mongoose.model('User', UserSchema);
