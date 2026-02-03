const mongoose = require('mongoose');

const incomeSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    source: {
        type: String,
        required: [true, 'Please add a source']
    },
    amount: {
        type: Number,
        required: [true, 'Please add an amount']
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Income', incomeSchema);
