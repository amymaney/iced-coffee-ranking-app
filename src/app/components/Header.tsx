"use client"

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

interface HeaderProps {
    isLoggedIn: boolean;
    activePage?: "home" | "explore" | "your-coffees" | "log-new" | "my-profile";
}

export default function Header({isLoggedIn, activePage}: HeaderProps){
    const router = useRouter();

    const linkClass = (page: string) => 
        `cursor-pointer py-2 px-3 rounded-3xl border transition-all duration-100 hover:bg-[#dae4f7] hover:shadow-lg hover:scake-[1.02]
        ${
            activePage === page 
                ? "bg-[#dae4f7] border-[#6f4e37]"
                : "bg-transparent border-transparent hover:border-[#6f4e37]"
        }`;
    
    return(
        <div className="flex justify-between bg-[#fffcf4] h-15">
            <div className="flex items-center justify-between px-6 py-4 text-[#4c3730] w-2/3 pr-20">
                <img 
                    alt="coffee bean"
                    src="/coffee-bean.png"
                    className="h-8 w-8"
                />
                <h3 onClick={() => router.push("/")} className={linkClass("home")}>
                    Home
                </h3>
                <h3 
                    className={linkClass("explore")}
                    onClick={() => router.push("/pages/explore")}
                >
                    Explore
                </h3>
                {isLoggedIn ? (
                    <>
                        <h3 
                            onClick={() => router.push("/pages/yourCoffee")}
                            className={linkClass("your-coffees")}
                        >
                            Your coffees
                        </h3>
                        <h3
                            onClick={() => router.push("/pages/newCoffee")}
                            className={linkClass("log-new")}
                        >
                            Log new
                        </h3>
                        <h3
                            onClick={() => router.push("/pages/myProfile")}
                            className={linkClass("my-profile")}
                        >
                            My profile
                        </h3>
                    </>
                    ) : (
                    <div className="w-65" />
                )}
            </div>
            <div className="px-6 py-2 items-center">
                {isLoggedIn ? (
                <h3
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className={linkClass("")}
                >
                    Sign out
                </h3>
                ) : (
                <h3 className="text-[#4c3730] py-2 px-1">You are not signed in</h3>
                )}
            </div>
        </div>
    )
}