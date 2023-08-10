const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'ewfsfsadfdfdffadsfdsffdsfdf'; 

module.exports = {
  async registerUser(req, res) {
    try {
      const { name, email, phone_no, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, phone_no, password: hashedPassword });

      res.status(201).json(user);
    } catch (error) {
      console.log(error)

      res.status(500).json({ error: 'Internal server error' });
    }
  },

  async loginUser(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password)
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: '1d' });
      res.json({ token });
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Internal server error' });
    }
  },
};
