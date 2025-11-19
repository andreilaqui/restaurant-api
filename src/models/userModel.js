const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // for password hashing and salting

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    sparse: true // allows null but enforces uniqueness if present https://www.mongodb.com/docs/v7.0/core/index-sparse/?msockid=03c8f066768f64c1303fe4bd77a26552
  },
  phone: {
    type: String,
    unique: true,
    sparse: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  }
}, { timestamps: true });

// hash password before saving
userSchema.pre('save', async function (next) {  //pre() is a mongoose middleware to do something before an event (save in this case)
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);