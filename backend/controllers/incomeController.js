const Income = require('../models/Income');

// @desc    Get incomes
// @route   GET /api/income
// @access  Private
const getIncomes = async (req, res) => {
    const incomes = await Income.find({ user: req.user.id });
    res.status(200).json(incomes);
};

// @desc    Set income
// @route   POST /api/income
// @access  Private
const setIncome = async (req, res) => {
    if (!req.body.source || !req.body.amount) {
        res.status(400).json({ message: 'Please add source and amount' });
        return;
    }

    const income = await Income.create({
        user: req.user.id,
        source: req.body.source,
        amount: req.body.amount,
        date: req.body.date || Date.now()
    });

    res.status(200).json(income);
};

// @desc    Delete income
// @route   DELETE /api/income/:id
// @access  Private
const deleteIncome = async (req, res) => {
    const income = await Income.findById(req.params.id);

    if (!income) {
        res.status(400).json({ message: 'Income not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the goal user
    if (income.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await income.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getIncomes,
    setIncome,
    deleteIncome,
};
