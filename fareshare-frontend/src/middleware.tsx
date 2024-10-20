// middleware.ts or middleware.js
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token'); // Access the token cookie
    // Define paths that should be protected
    const protectedPaths = ['/profile', '/dashboard', '/home'];

    // Check if the user is trying to access a protected route
    if (protectedPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
        if (!token) {
            // If the token is not present, redirect to the login page
            return NextResponse.redirect(new URL('/login', request.url));
        }
    } else {
        // If the user is authenticated and tries to access login or register pages
        if (token) {
            return NextResponse.redirect(new URL('/profile', request.url)); // Redirect to profile or dashboard
        }
    }

    // Continue with the request if no redirects were made
    return NextResponse.next();
}

// Apply middleware only to these routes
export const config = {
    matcher: ['/login', '/signup', '/profile', '/dashboard', '/home'], // Specify routes to protect
};
