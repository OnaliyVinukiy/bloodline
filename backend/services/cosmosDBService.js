import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const COSMOS_DB_CONNECTION_STRING = process.env.COSMOS_DB_CONNECTION_STRING;
const DATABASE_ID = "donorDB";
const CONTAINER_ID = "donors";

let db;

const connectToCosmos = async () => {
  if (!db) {
    const client = await MongoClient.connect(COSMOS_DB_CONNECTION_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = client.db(DATABASE_ID);
  }
  return db.collection(CONTAINER_ID);
};

export const updateDonorAvatar = async (email, avatarUrl) => {
  try {
    const donorCollection = await connectToCosmos();
    await donorCollection.updateOne(
      { email },
      { $set: { avatar: avatarUrl } },
      { upsert: true }
    );
    return true;
  } catch (error) {
    throw new Error("Error updating donor avatar in Cosmos DB");
  }
};
