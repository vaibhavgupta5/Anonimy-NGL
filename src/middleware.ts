import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
export { default } from "next-auth/middleware"
import {getToken} from "next-auth/jwt"

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/signin", "/signup", "/", "/verify/:path*"],
};

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {


    const token = await getToken({req:request})
    const url = request.nextUrl

    console.log(token)
    console.log(url)



    if(token &&
        (
            url.pathname.startsWith("/signin") ||
            url.pathname.startsWith("/signup") ||
            url.pathname.startsWith("/verify") ||
            url.pathname.startsWith("/home")
        )
    ){
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();


}

