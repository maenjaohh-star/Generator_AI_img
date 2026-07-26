"use client";

import { useState } from "react";
import { login } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth.store";

export default function LoginForm() {

    const router = useRouter();

    const loginStore = useAuthStore();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleLogin() {

        try {

            setLoading(true);

            setError("");

            const result = await login({

                email,

                password

            });

            loginStore.login(

    		result.data.token,

		result.data.user

	    );

            router.push("/dashboard");

        }

        catch (e: any) {

            setError(

                e?.response?.data?.message ??

                "Login gagal"

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="w-full max-w-md rounded-xl border p-8 space-y-5">

            <h1 className="text-2xl font-bold">

                Login

            </h1>

            <input

                className="w-full border rounded-lg p-3"

                placeholder="Email"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

            />

            <input

                type="password"

                className="w-full border rounded-lg p-3"

                placeholder="Password"

                value={password}

                onChange={(e)=>setPassword(e.target.value)}

            />

            {

                error &&

                <p className="text-red-500 text-sm">

                    {error}

                </p>

            }

            <button

                onClick={handleLogin}

                disabled={loading}

                className="w-full rounded-lg bg-black text-white py-3"

            >

                {

                    loading ?

                    "Signing In..."

                    :

                    "Login"

                }

            </button>

        </div>

    );

}