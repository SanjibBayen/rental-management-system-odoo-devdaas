export type UserRole = 'admin' | 'staff' | 'landlord' | 'tenant';

export type UserStatus = 'active' | 'pending' | 'disabled' | 'invited';

export interface UserBase {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile extends UserBase {
    phone?: string;
    avatarUrl?: string;
    companyId?: string;
}

export interface UserCreateInput {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    phone?: string;
    companyId?: string;
}

export interface UserUpdateInput {
    firstName?: string;
    lastName?: string;
    role?: UserRole;
    status?: UserStatus;
    phone?: string;
    avatarUrl?: string;
}

export interface UserAuthPayload {
    accessToken: string;
    refreshToken: string;
    user: UserBase;
}
