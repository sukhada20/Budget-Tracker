const mongoose = require('mongoose');

const envelopeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add an envelope name']
    },
    budget: {
        type: Number,
        required: [true, 'Please add a budget amount']
    },
    currentAmount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Envelope', envelopeSchema);
