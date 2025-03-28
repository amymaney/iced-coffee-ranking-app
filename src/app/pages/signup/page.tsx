"use client";
import { FormEvent, useState, ChangeEvent } from "react";
import { SquareArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [waitMsg, setWaitMsg] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordValid, setPasswordValid] = useState<boolean>(true);

// Regex for password validation
const passwordRules = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    // Check if the password is valid according to the regex
    if (!passwordRules.test(password)) {
        setPasswordValid(false);
        return; 
    }

    setWaitMsg("Please wait...");

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    setWaitMsg("");
    if (res.ok) {
        setWaitMsg("Registration successful, redirecting to sign in page...");
        setTimeout(() => router.push("/api/auth/signin"), 2000);
    } else {
        setError(data.error || "Sign-up failed");
    }
  };

    // Handle input changes for email and password
    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) =>{
        setPasswordValid(true);
        setPassword(e.target.value)
    }

  return (
    <div className="min-h-screen bg-[#a98467] flex flex-col items-center justify-center">
      <div className="absolute top-6 left-6 z-10">
        <SquareArrowLeft
          onClick={() => router.push("/")}
          className="cursor-pointer w-8 h-8 text-[#f0ead2]"
        />
      </div>
      <div className="w-full max-w-lg mx-auto p-10 bg-[#f0ead2] shadow-md rounded-xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-[#432818]">sign up</h1>
        <form className="space-y-4" onSubmit={handleSignUp}>
          <div>
            <label className="block text-md font-semibold text-[#432818] mb-2">email address</label>
            <input
              type="email"
              className="w-full p-2 rounded-xl bg-white placeholder:text-sm"
              onChange={handleEmailChange}
              value={email}
              required
            />
          </div>
          <div>
            <label className="block text-md font-semibold text-[#432818] mb-2">password</label>
            <div className="flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-2 rounded-xl bg-white placeholder:text-sm"
                value={password}
                onChange={handlePasswordChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#6c584c] pl-3 cursor-pointer"
              >
                {showPassword ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
              </button>
            </div>
          </div>
            {!waitMsg && passwordValid &&<div className="h-1"></div>}
            {!passwordValid && (
                <p className="text-[#991218] text-center font-semibold">
                    Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.
                </p>
            )}
            {error && <p className="text-[#991218] text-center font-semibold">{error}</p>}
            {waitMsg &&<p className="text-center text-[#656d4a] font-semibol">{waitMsg}</p>}
            <div className="flex justify-center">
                <button
                type="submit"
                className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded-xl w-30 cursor-pointer"
                >
                sign up
                </button>
            </div>
        </form>
      </div>
    </div>
  );
}
