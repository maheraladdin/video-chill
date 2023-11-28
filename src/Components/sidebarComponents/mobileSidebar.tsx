import {Close, File, Lock, Logo, LogOut} from "~/Components/Icons";
import {UserImage} from "~/Components";
import Button from "~/Components/Buttons/Button";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import { useSession, signIn } from "next-auth/react";

type NavigationItem = {
    name: string;
    path?: string;
    icon: (className: string) => JSX.Element;
    current: boolean;
}


type mobileSidebarProps = {
    isOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    mobileNavigation: NavigationItem[]
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function MobileSidebar({isOpen, setSidebarOpen, mobileNavigation}: mobileSidebarProps) {
    const router = useRouter();
    const {data: sessionData} = useSession();
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-50 lg:hidden"
                onClose={setSidebarOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="transition-opacity ease-linear duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="transition-opacity ease-linear duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-900/80" />
                </Transition.Child>

                <div className="fixed inset-0 flex">
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-x-full"
                        enterTo="translate-x-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-x-0"
                        leaveTo="-translate-x-full"
                    >
                        <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                            <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                <button
                                    type="button"
                                    className="-m-2.5 p-2.5"
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <span className="sr-only">Close sidebar</span>

                                    <Close className="h-6 w-6" aria-hidden="true" />
                                </button>
                            </div>
                            {/* Sidebar component FOR MOBILE, swap this element with another sidebar if you like */}
                            <div className=" flex grow  flex-col gap-y-5 overflow-y-auto border-r  border-gray-200 bg-white  px-6 pb-4">
                                <nav className="flex flex-1 flex-col pt-4">
                                    <ul role="list" className="flex flex-1 flex-col gap-y-4">
                                        <Logo className="w-24" />
                                        <li className="border-t">
                                            <ul role="list" className="-mx-2 space-y-1  pt-3 ">
                                                {mobileNavigation.map((item) => (
                                                    <li key={item.name}>
                                                        <Link
                                                            href={item.path || "/"}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                void router.push(item.path || "/");
                                                            }}
                                                            className={classNames(
                                                                item.current
                                                                    ? " bg-gray-50 text-primary-600"
                                                                    : " text-gray-700 hover:bg-gray-50 hover:text-primary-600",
                                                                "group flex gap-x-3 rounded-md px-2 py-1.5 text-sm font-semibold leading-6"
                                                            )}
                                                        >
                                                            {item.current
                                                                ? item.icon(
                                                                    "h-5 w-5 shrink-0 stroke-primary-600"
                                                                )
                                                                : item.icon(
                                                                    "h-5 w-5 shrink-0  stroke-gray-500  group-hover:stroke-primary-600"
                                                                )}
                                                            {item.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>

                                        <li className="mt-auto border-b ">
                                            <Link
                                                href="/Blog/Privacy"
                                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                                            >
                                                <Lock
                                                    className={
                                                        "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                                                    }
                                                />
                                                Privacy
                                            </Link>
                                            <Link
                                                href="/Blog/TOS"
                                                className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                                            >
                                                <File
                                                    className={
                                                        "h-5 w-5 shrink-0 stroke-gray-500 group-hover:stroke-primary-600"
                                                    }
                                                />
                                                Terms of Service
                                            </Link>
                                        </li>

                                        {sessionData ? (
                                            <div className="my-2 flex flex-row">
                                                <UserImage image={sessionData?.user.image || ""} />
                                                <div className="ml-2 flex flex-col  justify-start truncate text-sm ">
                                                    <p className="font-semibold text-gray-700">
                                                        {sessionData && (
                                                            <span>{sessionData.user?.name}</span>
                                                        )}
                                                    </p>
                                                    <p className="text-gray-600 truncate">
                                                        {sessionData && (
                                                            <span>{sessionData.user?.email}</span>
                                                        )}
                                                    </p>
                                                </div>
                                                <Button variant="tertiary-gray" href="#" size="lg">
                                                    <LogOut className="w-5 stroke-gray-600" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <li className="space-y-2">
                                                <Button
                                                    variant="primary"
                                                    size="2xl"
                                                    className="w-full"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        {
                                                            void signIn();
                                                        }
                                                    }}
                                                >
                                                    {" "}
                                                    Sign Up
                                                </Button>
                                                <Button
                                                    variant="secondary-gray"
                                                    size="2xl"
                                                    className="w-full"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        {
                                                            void signIn();
                                                        }
                                                    }}
                                                >
                                                    {" "}
                                                    Log In
                                                </Button>
                                            </li>
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    )
}