const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = mongoose.Schema({
    email: {
        type: String, 
        trim: true, 
        lowercase: true, 
        unique: true,
        validate: {
            validator: function(v) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
        required: [true, "Email is required!"]
    },
    avatar : {type: String},
    passwordHash : {type: String, required: true},
    fullName: { type: String, required: true },
    active: { type: Boolean, default: true, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user', required: true },
});

UserSchema.virtual('password')
.get(function() {
  return this._password;
})
.set(function(value) {
  this._password = value;
  var salt = bcrypt.genSaltSync(12);
  this.passwordHash = bcrypt.hashSync(value, salt);
});

// UserSchema.virtual('passwordConfirmation')
// .get(function() {
//   return this._passwordConfirmation;
// })
// .set(function(value) {
//   this._passwordConfirmation = value;
// });

// UserSchema.path('passwordHash').validate(function(v) {
//   if (this._password || this._passwordConfirmation) {
//     if (!val.check(this._password).min(6)) {
//       this.invalidate('password', 'must be at least 6 characters.');
//     }
//     if (this._password !== this._passwordConfirmation) {
//       this.invalidate('passwordConfirmation', 'must match confirmation.');
//     }
//   }
  
//   if (this.isNew && !this._password) {
//     this.invalidate('password', 'required');
//   }
// }, null);

// UserSchema.path('firstName').validate(function(v) {
//   if (!val.check(v).max(100)) {
//     this.invalidate('firstName', 'must be less than 100 characters');
//   }  
// }, null);

// UserSchema.path('lastName').validate(function(v) {
//   if (!val.check(v).max(100)) {
//     this.invalidate('lastName', 'must be less than 100 characters');
//   }
// }, null);

// UserSchema.path('emailAddress').validate(function(v) {
//   if (!val.check(v).isEmail()) {
//     this.invalidate('emailAddress', 'must be a valid email address');
//   }
// }, null);

module.exports = mongoose.model('User', UserSchema);