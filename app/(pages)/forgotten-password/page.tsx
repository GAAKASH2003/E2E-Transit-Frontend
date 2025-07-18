"use client";
import { useState, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
export default function IndexPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isEmailGiven, setIsEmailGiven] = useState(false);
  const router = useRouter();
  async function handleVerify(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) {
      console.error("Email is required");
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/forgot-password`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      }
    );
    if (!response.ok) {
      alert("Failed to reset password. Please try again.");
      return;
    }
    alert("OTP sent to your email");
    setIsEmailGiven(true);
  }
  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !otp || !newpassword || !password) {
      alert("All fields are required");
      return;
    }
    if (newpassword !== password) {
      alert("Passwords do not match");
      return;
    }
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/verify`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword: password,
        }),
      }
    );
    if (!response.ok) {
      alert("Failed to reset password. Please try again.");
      return;
    }
    alert("Password reset successfully");
    router.push("/signup");
  }

  return (
    <main className="min-h-screen w-full bg-[#e8ebee] flex items-center justify-center p-4 bg-[url('/bg-image.jpg')] bg-cover bg-center">
      <div className="w-full max-w-[980px] flex flex-col lg:flex-row items-center lg:items-end justify-end gap-10 ">
        <div className="w-full max-w-sm rounded-2xl shadow-lg">
          <div className=" p-4 sm:p-6 space-y-4  bg-white/30 border border-white/40 border-solid rounded-lg shadow-lg backdrop-blur-3xl flex-col justify-between align-middle text-center">
            <div>
              <Image
                src="/logo.svg"
                alt="Logo"
                width={96}
                height={96}
                className="align-middle mx-auto"
              />
              <h1 className="mt-2 text-xl text-black font-bold">
                End to End Transit Solutions
              </h1>
              <br />
              <p className="text-black text-sm">
                {isEmailGiven
                  ? "Enter OTP sent to Email"
                  : "Enter your email to reset password"}
              </p>
            </div>
            <form
              onSubmit={isEmailGiven ? handleSubmit : handleVerify}
              className="space-y-3"
            >
              {!isEmailGiven ? (
                <input
                  type="text"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-md border-black border-2 focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[17px] text-black"
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border-black border-2 focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[17px] text-black"
                  />
                  <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newpassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border-black border-2 focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[17px] text-black"
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-md border-black border-2 focus:border-[#1877f2] focus:ring-1 focus:ring-[#1877f2] outline-none text-[17px] text-black"
                  />
                </>
              )}
              <button
                type="submit"
                className="w-full py-3 rounded-md bg-[#1877f2] hover:bg-[#166fe5] text-white font-bold text-xl transition-colors "
              >
                {isEmailGiven ? "Reset Password" : "Send OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
