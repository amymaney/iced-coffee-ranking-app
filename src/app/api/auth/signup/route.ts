import { NextResponse } from "next/server";
import { registerUser } from '@/lib/auth';

export async function POST(req: Request){
    try{
        const {email, password} = await req.json();
        console.log("Received sign up request:", email);

        if(!email||!password){
            return NextResponse.json({error: 'Email and password are required'}, {status:400});
        }

        const result = await registerUser(email, password);

        if(result.error){
            return NextResponse.json({error: result.error}, {status:400});
        }
        
        return NextResponse.json({message: 'User registered successfully', user: result}, {status:201});
    } catch(error){
        console.log('Error in sign up', error);
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}