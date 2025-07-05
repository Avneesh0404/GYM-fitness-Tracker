const mongo = require('mongoose')
const userSchema = new mongo.Schema({
    name: {type:String},
    email:{type: String,unique : true},
    password:{type:String,require:true,unique:true}
})
 
module.exports = mongo.model("User", userSchema)