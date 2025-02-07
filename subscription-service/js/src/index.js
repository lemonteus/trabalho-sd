"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionService = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const https_1 = require("firebase-functions/v2/https");
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const subscriptions = [];
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    if (getSubscriptionIndex(subscription.endpoint, subscription) !== -1) {
        res.status(400).json({ message: 'Subscription already exists' });
    }
    subscriptions.push(subscription);
    res.status(201).json({ message: 'Subscription added successfully' });
});
app.delete('/unsubscribe', (req, res) => {
    const subscription = req.body;
    const index = getSubscriptionIndex(subscription.endpoint, subscription);
    if (index !== -1) {
        subscriptions.splice(index, 1);
    }
    res.status(200).json({ message: 'Subscription removed successfully' });
});
app.get('/subscriptions', (req, res) => {
    res.json(subscriptions);
});
exports.subscriptionService = (0, https_1.onRequest)(app);
function getSubscriptionIndex(endpoint, subscription) {
    return subscriptions.findIndex(sub => sub.endpoint === subscription.endpoint);
}
