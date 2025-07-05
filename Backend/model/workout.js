const mongo = require("mongoose")
const workoutSchema = new mongo.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: Date,
    exercise: String,
    sets: Number,
    reps: Number,
    weight: Number,
    notes: String,
})
module.exports = mongo.model("workout",workoutSchema)