import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import Button from "~/Components/Buttons/Button";
import { signIn, signOut, useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import {
  DotsVertical,
  File,
  Settings,
  HelpCircle,
  MessagePlusSquare,
  Lock,
  LogOut,
  Brush,
  Search,
  Logo,
} from "./Icons";
import User from "./Icons/User";
import { useRouter } from "next/router";
import { type KeyboardEvent } from "react";
import { UserImage } from "./index";

type NavbarProps = {
  children?: JSX.Element;
}

type NavigationItem = {
  icon: (className: string) => JSX.Element;
  name: string;
  path: string;
  lineAbove: boolean;
}

// Navigation
function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ children }: NavbarProps) {
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  const signedInNavigation: NavigationItem[] = [
    {
      icon: (className) => <User className={className} />,
      name: "View Profile",
      path: `/${String(userId)}/ProfileVideos`,
      lineAbove: true,
    },
    {
      icon: (className) => <Brush className={className} />,
      name: "Creator Studio",
      path: "/Dashboard",
      lineAbove: false,
    },
    {
      icon: (className) => <HelpCircle className={className} />,
      name: "Help",
      path: "/Blog/Help",
      lineAbove: true,
    },
    {
      icon: (className) => <Settings className={className} />,
      name: "Settings",
      path: "/Settings",
      lineAbove: false,
    },
    {
      icon: (className) => <MessagePlusSquare className={className} />,
      name: "Feedback",
      path: "#",
      lineAbove: false,
    },
    {
      icon: (className) => <File className={className} />,
      name: "Terms of Service",
      path: "/Blog/TOS",
      lineAbove: true,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Privacy",
      path: "/Blog/Privacy",
      lineAbove: false,
    },
    {
      icon: (className) => <LogOut className={className} />,
      name: "Log Out",
      path: "sign-out",
      lineAbove: true,
    },
  ];

  const signedOutNavigation: NavigationItem[] = [
    {
      icon: (className) => <HelpCircle className={className} />,
      name: "Help",
      path: "/Blog/Help",
      lineAbove: true,
    },
    {
      icon: (className) => <MessagePlusSquare className={className} />,
      name: "Feedback",
      path: `mailto:vidchill@vidchill.com`,
      lineAbove: false,
    },
    {
      icon: (className) => <File className={className} />,
      name: "Terms of Service",
      path: "/Blog/TOS",
      lineAbove: true,
    },
    {
      icon: (className) => <Lock className={className} />,
      name: "Privacy",
      path: "/Blog/Privacy",
      lineAbove: false,
    },
  ];

  const Navigation = sessionData ? signedInNavigation : signedOutNavigation;

  const {register, getValues} = useForm({});

  const router = useRouter();

  const handleSearch = () => {
    try {
      router.push({
        pathname: "/SearchPage",
        query: {q: getValues("search")},
      });
    } catch (error) {
      console.error("Error navigating to search page:", error);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      void handleSearch();
    }
  };

  return (
    <>
      <div className="fixed z-50 w-full border-b border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm">
        <div className="mx-auto flex max-w-full px-6 lg:px-16 xl:grid xl:grid-cols-12">
          <div className="flex flex-shrink-0 items-center lg:static xl:col-span-2">
            <Link href="/#" aria-label="Home">
              <Logo className="h-10" />
            </Link>
          </div>
          <div className="w-full min-w-0 flex-1 lg:px-0 xl:col-span-8">
            <div className=" g:mx-0 flex items-center px-6 py-4 lg:max-w-none xl:mx-0 xl:px-0">
              <div className="w-full">
                <label htmlFor="search" className="sr-only">
                  Search
                </label>
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 stroke-gray-400" />
                  </div>
                  <input
                    id="search"
                    className="block outline-none w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 dark:ring-neutral-800 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-500 sm:text-sm sm:leading-6 dark:bg-neutral-700 dark:text-gray-400"
                    placeholder="Search"
                    {...register("search")}
                    type="search"
                    onKeyDown={handleKeyDown}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center lg:hidden">
            {/* Mobile menu button */}
            {children}
          </div>
          <div className="m-0 hidden w-max px-0 lg:flex lg:items-center lg:justify-end xl:col-span-2">
            {/* 3 dots  and Profile dropdown */}
            <Menu as="div" className="relative ml-5 flex-shrink-0">
              <div>
                <Menu.Button className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2">
                  {sessionData ? (
                    <UserImage image={sessionData?.user.image || ""} />
                  ) : (
                    <DotsVertical className="w-5 stroke-gray-700 dark:stroke-white" />
                  )}
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white dark:bg-neutral-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  {sessionData ? (
                    <div className="mx-4 my-2 flex">
                       <div className="h-9 w-9">
                        <UserImage image={sessionData?.user.image || ""} />
                       </div>
                      <div className="ml-3 flex flex-col justify-start truncate">
                        <p className="truncate text-sm font-semibold text-gray-700 dark:text-white">
                          {sessionData && <span>{sessionData.user?.name}</span>}
                        </p>
                        <p className="truncate text-sm text-gray-600 dark:text-white">
                          {sessionData && (
                            <span className="">{sessionData.user?.email}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="mx-4 my-2 flex text-center text-sm font-semibold text-gray-700 dark:text-white">
                      Menu
                    </p>
                  )}
                  {Navigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        <Link
                          onClick={(e) => {
                            e.preventDefault();
                            if (item.path === "sign-out") {
                              void signOut();
                            } else {
                              void router.push(item.path || "/");
                            }
                          }}
                          href={item.path || "/"}
                          className={classNames(
                            active ? "bg-gray-100 dark:bg-neutral-700" : "",
                            "block px-4 py-2 text-sm text-gray-700 dark:text-white",
                            item.lineAbove ? "border-t border-gray-200" : ""
                          )}
                        >
                          <div className="flex items-center ">
                            {item.icon("h-4 w-4 stroke-gray-700 dark:stroke-white")}
                            <div className="pl-2">{item.name}</div>
                          </div>
                        </Link>
                      )}
                    </Menu.Item>
                  ))}
                </Menu.Items>
              </Transition>
            </Menu>
            {/*Sign up login Buttons*/}
            {sessionData ? (
              ""
            ) : (
              <div className="flex flex-row space-x-3 ">
                <Button
                  variant="tertiary-gray"
                  size="md"
                  onClick={!sessionData ? () => void signIn() : () => ""}
                >
                  Log in
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  onClick={!sessionData ? () => void signIn() : () => ""}
                >
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
