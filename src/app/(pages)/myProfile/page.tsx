'use client';
import React, { useState, useEffect } from "react";
import Header from "@/app/components/Header";
import { useSession } from "next-auth/react";

export default function MyProfile(){
    const { data: session, status } = useSession();
    const isLoggedIn = !!session;
    return(
        <div>
            <Header isLoggedIn={isLoggedIn} activePage="my-profile" />
            <div className="bg-[#f7edda] h-screen flex justify-center items-center ">
                <div className="text-[#6F4E37]">Coming soon...</div>
            </div>
        </div>
    )
}