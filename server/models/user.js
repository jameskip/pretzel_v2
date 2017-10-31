const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: String,
  username: {
    type: 'String',
    unique: true },
  password: String,
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message',
  }],
  avatar: String,
});

// hash password before saving it to the db
userSchema.pre('save', function (next) {
  const user = this;

  bcrypt.hash(user.password, null, null, (err, hash) => {
    if (err) {
      return next(err);
    }

    user.password = hash;
    next();
  });
});

// promise-based password compare
userSchema.methods.comparePassword = function (password) {
  const user = this;

  return new Promise((fulfill, reject) => {
    bcrypt.compare(password, user.password, (err, res) => {
      if (err) {
        return reject(err);
      }
      fulfill(res);
    });
  });
};

module.exports = mongoose.model('User', userSchema);
