const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

async function main() {
    await mongoose.connect(MONGO_URL);
 }

 main()
 .then(() => {
    console.log("Connected to the database");
 })
 .catch( (err) => {
    console.log(err);
 });

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"6941a70b259b40b47eb7d2bf"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};

initDB();