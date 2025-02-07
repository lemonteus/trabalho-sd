"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = 3003;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
const users = [];
app.post('/users', (req, res) => {
    const user = req.body;
    users.push(user);
    res.status(201).json({ message: 'User added successfully' });
});
app.get('/users', (req, res) => {
    res.json(users);
});
app.listen(PORT, () => {
    console.log(`User service running on http://localhost:${PORT}`);
});
