import dynamic from "next/dynamic";
import { useMemo } from "react";

export default async function Page() {
    const Map = useMemo(() => dynamic(
        () => import('../components/Maps/Maps'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <>
            <div className="bg-white-700 mx-auto my-5 w-[98%] h-[480px]">
                <Map posix={[12.8797, 121.7740]} />
            </div>
        </>
    )
}