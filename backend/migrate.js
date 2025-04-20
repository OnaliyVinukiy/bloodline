const { MongoClient } = require('mongodb');


const uri = 'mongodb://bloodline:pIaCzZehI8mPkgcJOJL60HTxAzHR8da90iZnyZlSCW5zqgfR69URF9qAut7e6fIDxk3pNeH4pRwqACDbXxKcDg%3D%3D@bloodline.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@bloodline@';

const oldDbName = 'donorDB';
const newDbName = 'bloodline';
const collectionName  = 'stock';

const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true, // ensure SSL is enabled
    tlsAllowInvalidCertificates: true // helps resolve SSL errors in local dev
  });
  
  async function migrateDocuments() {
    try {
      await client.connect();
      const oldCollection = client.db(oldDbName).collection(collectionName);
      const newCollection = client.db(newDbName).collection(collectionName);
  
      const docs = await oldCollection.find({}).toArray();
      console.log(`Found ${docs.length} documents. Migrating...`);
  
      if (docs.length > 0) {
        await newCollection.insertMany(docs);
        console.log("Migration complete!");
      } else {
        console.log("No documents found.");
      }
    } catch (err) {
      console.error("Migration failed:", err);
    } finally {
      await client.close();
    }
  }
  
  migrateDocuments();