"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationService = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const web_push_1 = __importDefault(require("web-push"));
const cors_1 = __importDefault(require("cors"));
const https_1 = require("firebase-functions/v2/https");
const logger = __importStar(require("firebase-functions/logger"));
const app = (0, express_1.default)();
const PORT = 3002;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
// Configuração da Web Push
const vapidKeys = web_push_1.default.generateVAPIDKeys();
web_push_1.default.setVapidDetails('mailto:lemonsmateus@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);
app.post('/notify', async (req, res) => {
    const { title, body } = req.body;
    try {
        const response = await fetch('http://localhost:3001/subscriptions');
        const subscriptions = await response.json();
        const notifications = subscriptions.map((subscription) => web_push_1.default.sendNotification(subscription, JSON.stringify({ title, body })).catch(error => {
            if (error.statusCode === 410) {
                // Remove expired subscription
                logger.log('Removing expired subscription:', subscription.endpoint);
                const response = fetch('http://localhost:3001/unsubscribe', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(subscription),
                });
            }
            throw error;
        }));
        await Promise.all(notifications);
        res.status(200).json({ message: 'Notifications sent successfully' });
    }
    catch (error) {
        logger.error('Error sending notifications:', error);
        res.status(500).json({ error: 'Failed to send notifications' });
    }
});
app.get('/vapidPublicKey', (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey });
});
exports.notificationService = (0, https_1.onRequest)(app);
