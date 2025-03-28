"use client";
import { useState, useEffect } from "react";
import { SquareArrowLeft, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function SignInPage(){
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const {data: session} = useSession();
  const [showPassword, setShowPassword] = useState(false);

  // Redirects if user already signed in 
  useEffect(() => {
    if (session) {
      router.push("/"); // Redirect to home after signing in
    }
  }, [session, router]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if(res?.error){
      setError("Invalid credentials, please try again.");
    }
    else{
      router.push('/');
    }
  };

  return(
    <div className="min-h-screen bg-[#a98467] flex flex-col items-center justify-center">
      <div className="absolute top-6 left-6 z-10">
        <SquareArrowLeft 
          onClick={() => router.push("/")}
          className="cursor-pointer w-8 h-8 text-[#f0ead2]" 
        />
      </div>
      <div className="w-full max-w-lg mx-auto p-10 bg-[#f0ead2] shadow-md rounded-xl">
          <h1 className="text-2xl font-bold mb-4 text-center text-[#432818]">sign in</h1>
          <form className="space-y-4" onSubmit={handleSignIn}>
              <div>
                  <label htmlFor="email" className="block text-md font-medium font-semibold text-[#432818] mb-2">email address</label>
                  <input
                    type="text"
                    name="login-email"
                    className="w-full p-2 rounded-xl bg-white placeholder:text-sm"
                    placeholder=""
                    onChange={(e)=>setEmail(e.target.value)}
                    value={email}
                    required
                  />
              </div>
              <div>
                  <label htmlFor="password" className="block text-md font-medium font-semibold text-[#432818] mb-2">password</label>
                  <div className="flex flex-row">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="login-password"
                      className="w-full p-2 rounded-xl bg-white placeholder:text-sm mb-5"
                      placeholder=""
                      value={password}
                      onChange={(e)=>setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#6c584c] pb-5 pl-3 cursor-pointer"
                    >
                      {showPassword ? (
                        <Eye className="w-8 h-8" />
                      ) : (
                        <EyeOff className="w-8 h-8" /> 
                      )}
                    </button>
                  </div>

              </div>
              {error && <p className="text-[#991218] text-center">{error}</p>}
              <div className="flex justify-center">
                <button type="submit" className="bg-[#adc178] text-[#432818] px-4 py-2 font-semibold rounded-xl w-30 cursor-pointer">
                  sign in
                </button>
              </div>
              
          </form>
      </div>
    </div>
    
  )
}