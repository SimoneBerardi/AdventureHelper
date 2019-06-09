const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
});

userSchema.methods.filterPublicContent = function () {
  this.password = null;
}

userSchema.pre('remove', function (next) {
  this.model('Campaign').deleteMany({ user: this._id }, next);
})

const User = mongoose.model('User', userSchema);

module.exports = User;