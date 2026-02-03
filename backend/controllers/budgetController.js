const Budget = require('../models/Budget');

// @desc    Get budget
// @route   GET /api/budget
// @access  Private
const getBudget = async (req, res) => {
    const budget = await Budget.find({ user: req.user.id });
    res.status(200).json(budget);
};

// @desc    Set budget
// @route   POST /api/budget
// @access  Private
const setBudget = async (req, res) => {
    if (!req.body.amount) {
        res.status(400).json({ message: 'Please add amount' });
        return;
    }

    // Check if budget already exists for this month? 
    // Simplified: Just create new or update existing if we really want to enforce one per month. 
    // Current requirement: "Set monthly budget". Let's just create a new entry for simplicity as per MVP.
    // Or better: Update if exists for current month, else create.

    const date = new Date();
    const monthStr = date.toISOString().slice(0, 7); // YYYY-MM

    // Check if budget exists for this user and month
    let budget = await Budget.findOne({ user: req.user.id, month: monthStr });

    if (budget) {
        budget.amount = req.body.amount;
        await budget.save();
        res.status(200).json(budget);
    } else {
        budget = await Budget.create({
            user: req.user.id,
            amount: req.body.amount,
            month: monthStr
        });
        res.status(201).json(budget);
    }
};

module.exports = {
    getBudget,
    setBudget,
};
