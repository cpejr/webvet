const mongoose = require (mongoose);

const covenantSchema = new mongoose.Schema({
    name: String,
    managers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})