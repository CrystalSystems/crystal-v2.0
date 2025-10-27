// ❗❗❗ NOT USED
// backend/src/modules/user/user.middleware.js

import { getDB } from '../../core/engine/db/connectDB.js';
import { ObjectId } from 'mongodb';

const users = () => getDB().collection('users');

export const updateLastSeenMiddleware = async (req, res, next) => {
  if (!req.userId || !req.userId._id) {
    console.log('updateLastSeenMiddleware: No userId, skipping');
    return next();
  }

  try {
    const userIdObjectId = new ObjectId(req.userId._id);
    const now = new Date();
    const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);

    console.log(`updateLastSeenMiddleware: Checking lastSeen for userId ${req.userId._id}`);

    // 1. Finding a user by projecting only the status.'lastSeen' field
    const user = await users().findOne(
      { _id: userIdObjectId },
      { projection: { "status.lastSeen": 1 } }
    );

    // Check: If the user is not found OR
    // the status.lastSeen field does not exist OR
    // the last visit time is older than 30 seconds
    const needsUpdate = !user ||
      !user.status?.lastSeen ||
      user.status.lastSeen < thirtySecondsAgo;

    if (needsUpdate) {
      console.log(`updateLastSeenMiddleware: Updating lastSeen for userId ${req.userId._id}`);

      // 2. Update: Using $set to change nested field and updatedAt
      await users().updateOne(
        { _id: userIdObjectId },
        {
          $set: {
            "status.lastSeen": now,
            "updatedAt": now // manually update the timestamp
          }
        }
      );
      console.log(`updateLastSeenMiddleware: Updated lastSeen for userId ${req.userId._id}`);
    } else {
      console.log(`updateLastSeenMiddleware: Skipped update for userId ${req.userId._id}, lastSeen too recent`);
    }
  } catch (error) {
    // We log the error in the middleware and continue so as not to block the request.
    console.error('updateLastSeenMiddleware error:', error);
  }
  next();
};