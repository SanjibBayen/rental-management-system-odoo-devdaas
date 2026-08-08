import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'development-secret';

export const generateToken = (userId: string | number) => {
    return jwt.sign({ userId }, secret, { expiresIn: '7d' });
};

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};