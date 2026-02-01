import mongoose from 'mongoose';

/**
 * Wraps mongoose.model() and returns a correctly typed Model.
 * Centralizes the (as unknown as Model<T>) workaround for TS2589
 * (Mongoose's complex schema types cause "type instantiation excessively deep").
 */
export function createModel<T>(
  name: string,
  schema: mongoose.Schema
): mongoose.Model<T> {
  return mongoose.model(name, schema) as unknown as mongoose.Model<T>;
}
