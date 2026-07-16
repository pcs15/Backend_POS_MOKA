import db from '../config/db.js';

export const getUserByUsername = async (username) => {
    const [rows] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
    return rows[0];
};

export const createUser = async (username, hashedPassword) => {
    const [result] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
    return result.insertId;
};

export default {
    getUserByUsername,
    createUser
};
