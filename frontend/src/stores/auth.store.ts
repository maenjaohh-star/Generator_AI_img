import { create } from "zustand";

export interface User {

    id: string;

    email: string;

    name?: string;

}

interface AuthState {

    token: string | null;

    user: User | null;

    login: (

        token: string,

        user: User

    ) => void;

    logout: () => void;

    load: () => void;

}

export const useAuthStore = create<AuthState>(

    (set) => ({

        token: null,

        user: null,

        login(token, user) {

            localStorage.setItem(

                "token",

                token

            );

            localStorage.setItem(

                "user",

                JSON.stringify(user)

            );

            set({

                token,

                user

            });

        },

        logout() {

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            set({

                token: null,

                user: null

            });

        },

        load() {

            const token =

                localStorage.getItem("token");

            const user =

                localStorage.getItem("user");

            set({

                token,

                user:

                    user

                        ? JSON.parse(user)

                        : null

            });

        }

    })

);