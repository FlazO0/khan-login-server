const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Registro
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ error: false, message: 'Usuário registrado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Erro ao registrar usuário' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ error: true, message: 'Nome de usuário ou senha inválidos' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: true, message: 'Nome de usuário ou senha inválidos' });
        }
        const token = jwt.sign({ id: user._id }, "jibdsibvsd", { expiresIn: '2h' });
        res.status(200).json({ error: false, token });
    } catch (error) {
        res.status(500).json({ error: true, message: 'Erro ao fazer login' });
    }
});

module.exports = router;
