const asyncHandler = require('express-async-handler');
const Envelope = require('../models/Envelope');

// @desc    Get envelopes
// @route   GET /api/envelopes
// @access  Private
const getEnvelopes = asyncHandler(async (req, res) => {
    const envelopes = await Envelope.find({ user: req.user.id });
    res.status(200).json(envelopes);
});

// @desc    Set envelope
// @route   POST /api/envelopes
// @access  Private
const setEnvelope = asyncHandler(async (req, res) => {
    if (!req.body.name || !req.body.budget) {
        res.status(400);
        throw new Error('Please add a name and budget amount');
    }

    const envelope = await Envelope.create({
        user: req.user.id,
        name: req.body.name,
        budget: req.body.budget,
        currentAmount: req.body.budget // Initially, current amount equals the budget
    });

    res.status(200).json(envelope);
});

// @desc    Update envelope
// @route   PUT /api/envelopes/:id
// @access  Private
const updateEnvelope = asyncHandler(async (req, res) => {
    const envelope = await Envelope.findById(req.params.id);

    if (!envelope) {
        res.status(400);
        throw new Error('Envelope not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the envelope user
    if (envelope.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const updatedEnvelope = await Envelope.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    res.status(200).json(updatedEnvelope);
});

// @desc    Delete envelope
// @route   DELETE /api/envelopes/:id
// @access  Private
const deleteEnvelope = asyncHandler(async (req, res) => {
    const envelope = await Envelope.findById(req.params.id);

    if (!envelope) {
        res.status(400);
        throw new Error('Envelope not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    // Make sure the logged in user matches the envelope user
    if (envelope.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    await envelope.deleteOne();

    res.status(200).json({ id: req.params.id });
});

// @desc    Spend from envelope
// @route   POST /api/envelopes/:id/spend
// @access  Private
const spendFromEnvelope = asyncHandler(async (req, res) => {
    const envelope = await Envelope.findById(req.params.id);

    if (!envelope) {
        res.status(400);
        throw new Error('Envelope not found');
    }

    // Check for user
    if (!req.user) {
        res.status(401);
        throw new Error('User not found');
    }

    if (envelope.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    const { amount } = req.body;
    if (!amount || amount <= 0) {
        res.status(400);
        throw new Error('Please provide a valid amount to spend');
    }

    if (envelope.currentAmount < amount) {
        res.status(400);
        throw new Error('Insufficient funds in envelope');
    }

    envelope.currentAmount -= amount;
    await envelope.save();

    res.status(200).json(envelope);
});

module.exports = {
    getEnvelopes,
    setEnvelope,
    updateEnvelope,
    deleteEnvelope,
    spendFromEnvelope
};
