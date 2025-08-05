import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';

// Path to users.json (in the root directory)
const usersFile = path.resolve('users.json');

// Helper to read users from file
function readUsersFromFile() {
  try {
    if (fs.existsSync(usersFile)) {
      const data = fs.readFileSync(usersFile, 'utf-8');
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (err) {
    return [];
  }
}

// Helper to write users to file
function writeUsersToFile(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// Signup controller
export const signup = async (req, res) => {
  const { username, password, type } = req.body;
  if (!username || !password || !type)
    return res.status(400).json({ message: 'Username, password, and type are required' });

  const users = readUsersFromFile();
  const existingUser = users.find(u => u.username === username);
  if (existingUser)
    return res.status(400).json({ message: 'User already exists' });

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    type // Save the user type
  };
  users.push(user);
  writeUsersToFile(users);

  res.status(201).json({ message: 'User created', user: { id: user.id, username: user.username, type: user.type } });
};

// Login controller
export const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: 'Username and password required' });

  const users = readUsersFromFile();
  const user = users.find(u => u.username === username);
  if (!user)
    return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res.status(400).json({ message: 'Invalid credentials' });

  // Generate JWT with user type
  const token = jwt.sign(
    { id: user.id, username: user.username, type: user.type },
    'your_jwt_secret', // Change this to a strong secret in production!
    { expiresIn: '1h' }
  );
  res.json({ message: 'Login successful', token, type: user.type });
};

// Middleware to verify JWT and get current user
export const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Current user controller
export const currentUser = (req, res) => {
  res.json({ user: req.user });
};