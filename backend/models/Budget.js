const mongoose = require('mongoose');

const budgetSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    amount: {
        type: Number,
        required: [true, 'Please add a budget amount']
    },
    month: {
        type: String, // Format: "YYYY-MM"
        default: () => new Date().toISOString().slice(0, 7)
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Budget', budgetSchema);
