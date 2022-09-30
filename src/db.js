const { MongoClient, ServerApiVersion } = require("mongodb");

const db_uri = process.env.DB_URI;
const db_name = process.env.DB_NAME;
const collection_name = process.env.COLLECTION_NAME;

const client_options = {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
};

async function dbInit() {
  try {
    const client = await MongoClient.connect(db_uri, client_options);
    const db = client.db(db_name);
    const collection = db.collection(collection_name);
    return { client, db, collection };
  } catch (err) {
    console.error(`Error: could not initialize MongoClient: ${err}`);
    process.exit(1);
  }
}

module.exports = dbInit;
