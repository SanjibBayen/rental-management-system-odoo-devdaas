import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET_KEY || 'development-secret';

export const generateToken = (user_id: string | number) => {
    return jwt.sign({ user_id }, secret, { expiresIn: '7d' });
};

const t

export const verifyToken = (token: string) => {
    try {
        return jwt.verify(token, secret);
    } catch (error) {
        return null;
    }
};