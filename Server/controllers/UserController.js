const UserService = require('../service/UserService');
const bcrypt = require('bcrypt');

exports.registerUser = async function registerUser(req, res) {
    try {
        const userData = req.body;
        console.log(userData, "userData");

        const existingUser = await UserService.getUserByEmail(userData.email);
        if (existingUser) {
            return res.status(409).json({ error: 'Unable to complete registration with the provided details.' });
        }
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(userData.password, saltRounds);
        const newUserId = await UserService.createUser({
            full_name: userData.full_name,
            email: userData.email,
            password_hash: passwordHash,
            wants_updates: userData.wants_updates
        });
        console.log(newUserId, "new");

        const sessionId = await UserService.createSession(newUserId);
        res.cookie('session_id', sessionId, {
            httpOnly: true,
            secure: false, // after production i should change it to true
            sameSite: 'Strict',
            maxAge: 3600000
        });

        res.status(201).json({ message: 'Register successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUser = async function loginUser(req, res) {
    try {
        const userData = req.body;
        const existingUser = await UserService.getUserDetails(userData.email);
        if (!existingUser) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordMatch = await bcrypt.compare(userData.password, existingUser.password_hash);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const sessionId = await UserService.createSession(existingUser.user_id);
        res.cookie('session_id', sessionId, {
            httpOnly: true,
            secure: false, //  
            sameSite: 'Strict',
            maxAge: 3600000
        });
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCurrentUser = async function getCurrentUser(req, res) {
    try {
        const sessionId = req.cookies.session_id;
        if (!sessionId) {
            return res.status(200).json(null);
        }
        const userId = await UserService.getUserIdBySession(sessionId);
        if (!userId) {
            return res.status(200).json(null);
        }
        const user = await UserService.getUserById(userId);
        if (!user) {
            return res.status(200).json(null);
        }
        res.status(200).json({
            full_name: user.full_name,
            email: user.email,
            role: user.role,
            wants_updates: user.wants_updates
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

exports.logoutUser = async function logoutUser(req, res) {
    const sessionId = req.cookies.session_id;
    if (sessionId) {
        await UserService.deleteSession(sessionId);
    }
    res.clearCookie('session_id', {
        httpOnly: true,
        sameSite: 'Strict',
        secure: false
    });
    res.status(200).json({ message: 'Logout successful' });
};


// // Get all users
// exports.getAllUsers = async function getAllUsers(req, res) {
//     try {
//         const users = await UserService.getAllUsers();
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Get user by username
// exports.getUserByUsername = async function getUserByUsername(req, res) {
//     try {
//         const username = req.params.username;
//         const user = await UserService.getUserByUsername(username);
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(user);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// exports.partialUpdateUserByUsername = async (req, res) => {
//     try {
//         const { username } = req.params;
//         const updates = req.body; // הנתונים לעדכון מגיעים מגוף הבקשה
//         const updatedUser = await userService.partialUpdateUserByUsername(username, updates);
//         if (!updatedUser) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json(updatedUser);
//     } catch (error) {
//         console.error('Error patching user:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
// // Create a new user


// // Update an existing user by username
// exports.updateUserByUsername = async function updateUserByUsername(req, res) {
//     try {
//         const username = req.params.username;
//         const userData = req.body;
//         const updated = await UserService.updateUserByUsername(username, userData);
//         if (!updated) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({ message: 'User updated successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Delete a user by username
// exports.deleteUserByUsername = async function deleteUserByUsername(req, res) {
//     try {
//         const username = req.params.username;
//         const deleted = await UserService.deleteUserByUsername(username);
//         if (!deleted) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.status(200).json({ message: 'User deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };