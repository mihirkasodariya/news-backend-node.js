const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true, // Prevent duplicate subscriptions
        lowercase: true,
    },
    Subscription: {
        type: Boolean,
        default: true
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
