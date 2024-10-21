import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo";
import { usePathname } from 'next/navigation';
import { useAuth } from "@/app/context/AuthContext";

export default function NavigationBar() {
    const { logout } = useAuth();
    const pathname = usePathname(); // Get the current pathname directly from the hook

    return (
        <Navbar isBordered className="z-50">
            <NavbarBrand>
                <AcmeLogo />
                <p className="font-bold text-inherit">FareShare</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={pathname === "/home"}>
                    <Link href="/home" color="secondary" aria-current={pathname === "/home" ? "page" : undefined}>
                        Feed
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname === "/profile"}>
                    <Link href="/profile" color="secondary" aria-current={pathname === "/profile" ? "page" : undefined}>
                        Profile
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button onClick={logout} color="secondary" href="#" variant="flat">
                        Logout
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
