import {HelpCircle,Settings} from "~/Components/Icons";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type NavigationItem = {
    name: string;
    path?: string;
    icon: (className: string) => JSX.Element;
    current: boolean;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

type DesktopSidebarProps = {
    closeSidebar?: boolean;
    DesktopNavigation: NavigationItem[]
}

export default function DesktopSidebar({closeSidebar, DesktopNavigation}: DesktopSidebarProps) {

    const router = useRouter();
    const { data: sessionData } = useSession();

    return (
    <div
        className={classNames(
            closeSidebar ? "lg:w-20" : "lg:w-56",
            "bottom-0 top-16  hidden lg:fixed lg:z-40 lg:flex lg:flex-col"
        )}
    >
        {/*  Sidebar component FOR DESKTOP, swap this element with another sidebar if you like */}

        <div className="flex grow flex-col gap-y-5 overflow-y-auto border border-gray-200 bg-white px-6 pb-4">
            <nav className="flex flex-1 flex-col pt-8">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1 ">
                            {DesktopNavigation.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (item.path === "sign-in") {
                                                void signIn();
                                            } else {
                                                void router.push(item.path || "/");
                                            }
                                        }}
                                        className={classNames(
                                            item.current
                                                ? " bg-gray-50 text-primary-600"
                                                : " text-gray-700 hover:bg-gray-50 hover:text-primary-600",
                                            "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                        )}
                                    >
                                        {item.current
                                            ? item.icon("h-5 w-5 shrink-0 stroke-primary-600 ")
                                            : item.icon(
                                                "h-5 w-5 shrink-0  stroke-gray-500  group-hover:stroke-primary-600"
                                            )}
                                        <p className={classNames(closeSidebar ? "hidden" : "")}>
                                            {item.name}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li>

                    <li className="mt-auto">
                        <Link
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                {
                                    sessionData
                                        ? void router.push("/Settings")
                                        : void signIn();
                                }
                            }}
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                        >
                            <Settings
                                className={
                                    "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                                }
                            />
                            <p className={classNames(closeSidebar ? "hidden" : "")}>
                                Settings
                            </p>
                        </Link>
                        <Link
                            href="/Blog/Help"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                        >
                            <HelpCircle
                                className={
                                    "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                                }
                            />
                            <p className={classNames(closeSidebar ? "hidden" : "")}>
                                Help
                            </p>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
    )
}