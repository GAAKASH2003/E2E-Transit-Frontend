"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/lib/auth-actions";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigned, setIsSigned] = useState(false);
  const router = useRouter();

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  async function handleSignup(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      console.error("Email and password are required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error signing up:", errorData);
        throw new Error("Failed to sign up");
      }

      localStorage.setItem("email", email);
      alert("Signup successful, please enter the OTP sent to your email");
      router.push("/verify");
    } catch (error) {
      console.error(error);
    }
  }

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      console.error("Email and password are required");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error logging in:", errorData);
        throw new Error("Failed to log in");
      }

      localStorage.setItem("email", email);
      alert("Login successful");
      router.push("/profile");
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#e8ebee] flex items-center justify-center p-4 bg-[url('/bg-image.jpg')] bg-cover bg-center">
      <div className="w-full max-w-[980px] flex flex-col lg:flex-row items-center lg:items-end justify-end gap-10">
        <div className="w-full max-w-sm rounded-2xl shadow-lg">
          <div className="p-4 sm:p-6 space-y-4 bg-white/30 border border-white/40 rounded-lg shadow-lg backdrop-blur-3xl text-center">
            <div>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={96}
                height={96}
                className="mx-auto"
              />
              <h1 className="mt-2 text-xl text-black font-bold">
                End to End Transit Solutions
              </h1>
            </div>

            <form
              onSubmit={isSigned ? handleLogin : handleSignup}
              className="space-y-3"
            >
              <input
                type="text"
                placeholder="Email address or phone number"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-md border-black border-2 focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[17px] text-black"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-md border-black border-2 focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[17px] text-black"
              />
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xl transition-colors"
              >
                {isSigned ? "Log in" : "Sign Up"}
              </button>
            </form>

            <div className="text-center">
              <Link
                href="/forgotten-password"
                className="text-[#1877f2] text-sm hover:underline"
              >
                Forgotten password?
              </Link>
            </div>

            <div className="border-t border-gray-300 pt-4 text-center">
              <button
                className="inline-block bg-[#42b72a] hover:bg-[#36a420] text-white font-bold rounded-md px-6 py-3 text-base transition-colors"
                onClick={() => setIsSigned(!isSigned)}
              >
                {isSigned
                  ? "Create new account"
                  : "Already have an account? Log in"}
              </button>
            </div>

            <div className="border-gray-300 pt-4 text-center">
              <button
                type="button"
                onClick={() => signInWithGoogle()}
                className="inline-block bg-[#42b72a] hover:bg-[#36a420] text-white font-bold rounded-md px-6 py-3 text-base transition-colors"
              >
                Continue With Google
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
