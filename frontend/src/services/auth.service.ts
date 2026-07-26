import { api } from "@/lib/api";

export interface LoginRequest {

    email: string;

    password: string;

}

export interface LoginResponse {

    success: boolean;

    data: {

        user: {

            id: string;

            email: string;

            name?: string;

        };

        token: string;

    };

}

export async function login(

    body: LoginRequest

) {

    const response = await api.post<LoginResponse>(

        "/auth/login",

        body

    );

    return response.data;

}