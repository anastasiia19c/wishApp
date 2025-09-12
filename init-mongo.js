// utilise la DB définie, ou "wishdb" par défaut
const dbName = process.env.MONGO_INITDB_DATABASE || "wishdb";
db = db.getSiblingDB(dbName);

// crée au moins une collection + un doc 
db.createCollection("seed");
db.seed.insertOne({ seededAt: new Date() });
