import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';

export const UserSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
  try {
    if (!this.isModified('password')) {
      return next();
    }

    const hashed = await bcrypt.hash(this.password, 10);
    this.password = hashed;
    return next();
  } catch (err) {
    return next(err);
  }
});

UserSchema.pre('findOneAndUpdate', async function(
  next: mongoose.HookNextFunction,
) {
  const updateFields = this.getUpdate();
  const password = updateFields.password;
  try {
    const rounds = bcrypt.getRounds(password);
    if (rounds === 0) {
      updateFields.password = await bcrypt.hash(password, 10);
    }
    return next();
  } catch (error) {
    updateFields.password = await bcrypt.hash(password, 10);
    return next();
  }
});
