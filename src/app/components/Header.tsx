"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, signIn, useSession } from "next-auth/react";

interface HeaderProps {
    isLoggedIn: boolean;
    activePage?: "home" | "explore" | "your-coffees" | "log-new" | "my-profile";
}

export default function Header({isLoggedIn, activePage}: HeaderProps){
    const router = useRouter();
    const { data: session, status } = useSession();
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen(!menuOpen);

    const linkClass = (page: string) => 
        `cursor-pointer py-2 px-3 rounded-3xl border transition-all duration-100 hover:bg-[#dae4f7] hover:shadow-lg hover:scale-[1.02]
        ${
            activePage === page 
                ? "bg-[#dae4f7] border-[#6f4e37]"
                : "bg-transparent border-transparent hover:border-[#6f4e37]"
        }`;
    
    return(
        <div className="bg-[#fffcf4]">

            {/* Desktop header */}
            <div className="hidden lg:flex justify-between items-center px-6 py-4 text-[#4c3730]">
                <div className="flex items-center gap-10">
                    <img alt="coffee bean" src="/coffee-bean.png" className="h-8 w-8"/>
                    <h3 onClick={() => router.push("/")} className={linkClass("home")}>
                        Home
                    </h3>
                    <h3 onClick={() => router.push("/explore")} className={linkClass("explore")}>
                        Explore
                    </h3>
                    {isLoggedIn && (
                        <>
                        <h3 onClick={() => router.push("/yourCoffee")} className={linkClass("your-coffees")}>
                            My coffees
                        </h3>
                        <h3 onClick={() => router.push("/newCoffee")} className={linkClass("log-new")}>
                            Log new
                        </h3>
                        <h3 onClick={() => router.push("/myProfile")} className={linkClass("my-profile")}>
                            My profile
                        </h3>
                        </>
                    )}
                </div>
                <div>
                    {isLoggedIn ? (
                        <h3 onClick={() => signOut({ callbackUrl: "/" })} className={linkClass("")}>
                            Sign out
                        </h3>
                        ) : (
                        <h3 className="text-[#4c3730] py-2 px-1">You are not signed in</h3>
                    )}
                </div>
            </div>

            {/* Mobile header */}
            <div className="lg:hidden flex justify-between items-center px-6 py-4 text-[#4c3730]">
                <div className="flex items-center gap-4">
                    <img alt="coffee bean" src="/coffee-bean.png" className="h-8 w-8"/>
                    <h3 onClick={() => router.push("/")} className={linkClass("home")}>
                        Home
                    </h3>
                    <h3 onClick={() => router.push("/explore")} className={linkClass("explore")}>
                        Explore
                    </h3>
                </div>
                {/* Hamburger icon */}
                <button onClick={toggleMenu} className="text-[#6F4E37] focus:outline-none cursor-pointer">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        {menuOpen ? (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    ) : (
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    )}
                    </svg>
                </button>
            </div>

            {/* Mobile menu (hamburger menu) */}
            {menuOpen && (
                <div className={`lg:hidden text-[#4c3730] ${isLoggedIn ? 'bg-[#fffcf4]' : 'bg-[#f7edda]'} px-7 py-4 space-y-4`}>
                    {isLoggedIn && (
                        <>
                        <h3 onClick={() => router.push("/yourCoffee")} className={`${linkClass("your-coffees")}`}>
                            My coffees
                        </h3>
                        <h3 onClick={() => router.push("/newCoffee")} className={linkClass("log-new")}>
                            Log new
                        </h3>
                        <h3 onClick={() => router.push("/myProfile")} className={linkClass("my-profile")}>
                            My profile
                        </h3>
                        </>
                    )}
                    <div className="">
                        {isLoggedIn ? (
                            <h3 onClick={() => signOut({ callbackUrl: "/" })} className={linkClass("")}>
                                Sign out of {session?.email}
                            </h3>
                        ) : (
                            <div className="space-y-3">
                                 <button 
                                    onClick={() => signIn("google", { callbackUrl: process.env.NEXTAUTH_URL || "http://localhost:3000" })}
                                    className="bg-[#FFFCF4] rounded-3xl w-full px-3 py-3 shadow-md cursor-pointer text-center 
                                    flex items-center justify-center"
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/240px-Google_%22G%22_logo.svg.png"
                                        alt="Google logo"
                                        className="w-7 h-7 mr-5"
                                    />
                                    <h3 className="text-[#4C3730] text-xl">Sign in with Google</h3>
                                </button>
                                <button 
                                    onClick={() => signIn("microsoft", { callbackUrl: process.env.NEXTAUTH_URL || "http://localhost:3000" })}
                                    className="bg-[#FFFCF4] rounded-3xl w-full px-3 py-3 shadow-md cursor-pointer text-center 
                                    flex items-center justify-center"
                                >
                                    <img
                                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/512px-Microsoft_logo.svg.png"
                                        alt="Google logo"
                                        className="w-6 h-6 mr-5"
                                    />
                                    <h3 className="text-[#4C3730] text-xl">Sign in with Microsoft</h3>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}