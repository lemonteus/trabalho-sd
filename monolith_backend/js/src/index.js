"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const web_push_1 = __importDefault(require("web-push"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3001;
app.use((0, cors_1.default)());
// Array para armazenar as assinaturas
const subscriptions = [];
// Configuração da Web Push
const vapidKeys = web_push_1.default.generateVAPIDKeys();
web_push_1.default.setVapidDetails('mailto:lemonsmateus@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);
app.use(body_parser_1.default.json());
// Endpoint para registrar assinaturas de clientes
app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    try {
        subscriptions.push(subscription);
        res.status(201).json({ message: 'Subscription added successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to add subscription', error });
    }
});
// Endpoint para enviar notificações
app.post('/notify', async (req, res) => {
    const { title, body } = req.body;
    try {
        const notifications = subscriptions.map(subscription => web_push_1.default.sendNotification(subscription, JSON.stringify({ title, body })));
        await Promise.all(notifications);
        res.status(200).json({ message: 'Notifications sent successfully' });
    }
    catch (error) {
        console.error('Error sending notifications:', error);
        res.status(500).json({ error: 'Failed to send notifications' });
    }
});
app.get('/vapidPublicKey', (req, res) => {
    res.json({ publicKey: vapidKeys.publicKey });
});
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
