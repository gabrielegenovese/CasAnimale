const mongoose = require("mongoose");
const { Schema } = mongoose;

/* Company schema fields */
const petSchema = new Schema({
    name: String,
    photo: String,
    gender: String, // todo implementare?
    species: String,
    breed: String,     // razza (può essere NULL)
    owner: String,     // id of user
    birth: Date,
});

module.exports = mongoose.model("Pet", petSchema);
