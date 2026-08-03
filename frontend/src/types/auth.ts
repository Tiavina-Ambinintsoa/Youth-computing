export interface User {
    id: number,
    username: string,
    email: string,
    role: {
        id: number,
        name: string,
        type: string,
    };
}

export interface LoginPayload {
    identifier: string,
    password: string,
}

export interface RegisterPayload {
    username: string,
    email: string,
    password: string,
}

export interface AuthResponse {
    jwt: string,
    user: User,
}