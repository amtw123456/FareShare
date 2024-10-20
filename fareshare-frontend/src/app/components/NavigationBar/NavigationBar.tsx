import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button } from "@nextui-org/react";
import { AcmeLogo } from "./AcmeLogo";
import { usePathname } from 'next/navigation';

export default function NavigationBar() {
    const pathname = usePathname(); // Get the current pathname directly from the hook

    return (
        <Navbar isBordered>
            <NavbarBrand>
                <AcmeLogo />
                <p className="font-bold text-inherit">ACME</p>
            </NavbarBrand>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                <NavbarItem isActive={pathname === "/home"}>
                    <Link href="/home" aria-current={pathname === "/home" ? "page" : undefined}>
                        Feed
                    </Link>
                </NavbarItem>
                <NavbarItem isActive={pathname === "/profile"}>
                    <Link href="/profile" aria-current={pathname === "/profile" ? "page" : undefined}>
                        Profile
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Logout
                    </Button>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}
