const Expense = require('../models/Expense');

// @desc    Get expenses
// @route   GET /api/expense
// @access  Private
const getExpenses = async (req, res) => {
    const expenses = await Expense.find({ user: req.user.id });
    res.status(200).json(expenses);
};

// @desc    Set expense
// @route   POST /api/expense
// @access  Private
const setExpense = async (req, res) => {
    if (!req.body.category || !req.body.amount || !req.body.description) {
        res.status(400).json({ message: 'Please add all fields' });
        return;
    }

    const expense = await Expense.create({
        user: req.user.id,
        category: req.body.category,
        description: req.body.description,
        amount: req.body.amount,
        date: req.body.date || Date.now()
    });

    res.status(200).json(expense);
};

// @desc    Update expense
// @route   PUT /api/expense/:id
// @access  Private
const updateExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(400).json({ message: 'Expense not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedExpense);
};

// @desc    Delete expense
// @route   DELETE /api/expense/:id
// @access  Private
const deleteExpense = async (req, res) => {
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
        res.status(400).json({ message: 'Expense not found' });
        return;
    }

    // Check for user
    if (!req.user) {
        res.status(401).json({ message: 'User not found' });
        return;
    }

    // Make sure the logged in user matches the expense user
    if (expense.user.toString() !== req.user.id) {
        res.status(401).json({ message: 'User not authorized' });
        return;
    }

    await expense.deleteOne();

    res.status(200).json({ id: req.params.id });
};

module.exports = {
    getExpenses,
    setExpense,
    updateExpense,
    deleteExpense,
};
