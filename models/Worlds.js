const mongoose = require ('mongoose');

const WorldsSchema = new mongoose.Schema({
    name: {
      type: String
      
    },
    timePeriod: {
      type: String,
      default: "Medieval"
    },
    worldTypeGame: {
      type: Boolean,
      default: false
    },
    users: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'users'
        } 
      }
    ], 
    posts: [
      {
        messages: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'posts'
        }
      }
    ]
});

module.exports = User = mongoose.model('world', WorldsSchema)