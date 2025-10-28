const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "68e099214c197041e9c0ab9a"}));  //({ ...obj, owner: "68e099214c197041e9c0ab9a"})); isse hamari object ki pehli properties to aaygi saath ek nayi owner property add ho jaygi
  // map() ye har ek individual listing object m ek new property ko add kr dega  or saath hi ye usi array m changes nahi krta ek naya array create krta h 

  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();