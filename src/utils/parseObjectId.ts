import mongoose from 'mongoose';
import { AppError } from '../middleware/errorHandler';

/**
 * Parses a value (e.g. from req.body, req.params, req.query) into a MongoDB ObjectId.
 * @throws AppError 400 if value is missing, not a string, or not a valid 24-char hex string
 */
export function parseObjectId(value: unknown, name: string): mongoose.Types.ObjectId {
    const raw = Array.isArray(value) ? value[0] : value;
    if (raw == null || typeof raw !== 'string' || !mongoose.Types.ObjectId.isValid(raw)) {
        throw new AppError(`${name} must be a valid 24-character hex string`, 400);
    }
    return new mongoose.Types.ObjectId(raw);
}
