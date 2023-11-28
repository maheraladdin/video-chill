import { useEffect } from "react";
import { useSession } from "next-auth/react";

import {
  ClockRewind,
  Folder,
  HelpCircle,
  Home,
  MessagePlusSquare,
  Settings,
  ThumbsUp,
  UserCheck,
  VideoRecorder,
  User,
  Brush,
} from "./Icons";
import { useRouter } from "next/router";
import { DesktopSidebar, MobileSidebar } from "./sidebarComponents";

type NavigationItem = {
  name: string;
  path?: string;
  icon: (className: string) => JSX.Element;
  current: boolean;
}

type SidebarProps = {
  isOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  closeSidebar?: boolean;
}
export default function Sidebar({
  isOpen,
  setSidebarOpen,
  closeSidebar,
}: SidebarProps) {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const userId = sessionData?.user.id;

  // desktop navigation bar data
  const DesktopNavigation: NavigationItem[] = [
    {
      name: "Home",
      path: `/`,
      icon: (className) => <Home className={className} />,
      current: router.pathname === `/`,
    },
    {
      name: "Liked Videos",
      path: userId ? `/playlist/LikedVideos` : "sign-in",
      icon: (className) => <ThumbsUp className={className} />,
      current: router.pathname === `/playlist/LikedVideos`,
    },
    {
      name: "History",
      path: userId ? `/playlist/History` : "sign-in",
      icon: (className) => <ClockRewind className={className} />,
      current: router.pathname === `/playlist/History`,
    },
    {
      name: "Your Videos",
      path: userId ? `/${String(userId)}/ProfileVideos` : "sign-in",
      icon: (className) => <VideoRecorder className={className} />,
      current: router.asPath === `/${String(userId)}/ProfileVideos`,
    },
    {
      name: "Library",
      path: userId ? `/${String(userId)}/ProfilePlaylists` : "sign-in",
      icon: (className) => <Folder className={className} />,
      current: router.asPath === `/${String(userId)}/ProfilePlaylists`,
    },
    {
      name: "Following",
      path: userId ? `/${String(userId)}/ProfileFollowing` : "sign-in",
      icon: (className) => <UserCheck className={className} />,
      current: router.asPath === `/${String(userId)}/ProfileFollowing`,
    },
  ];

  // mobile navigation bar data in case of login
  const SignedInMobileNavigation: NavigationItem[] = [
    {
      name: "Profile",
      path: `/${String(userId)}/ProfileVideos`,
      icon: (className) => <User className={className} />,
      current: router.pathname === `/Profile`,
    },
    {
      name: "Creator Studio",
      path: `/Dashboard`,
      icon: (className) => <Brush className={className} />,
      current: router.pathname === `/CreatorStudio`,
    },
    {
      name: "Help",
      path: `/Blog/Help`,
      icon: (className) => <HelpCircle className={className} />,
      current: router.pathname === `/Blog/Help`,
    },
    {
      name: "Settings",
      path: `/Settings`,
      icon: (className) => <Settings className={className} />,
      current: router.pathname === `/Settings`,
    },
    {
      name: "Feedback",
      path: `mailto:vidchill@vidchill.com`,
      icon: (className) => <MessagePlusSquare className={className} />,
      current: router.pathname === `/Feedback`,
    },
  ];

  // mobile navigation bar data in case of logout
  const SignedOutMobileNavigation: NavigationItem[] = [
    {
      name: "Help",
      path: `/Blog/Help`,
      icon: (className) => <HelpCircle className={className} />,
      current: router.pathname === `/Blog/Help`,
    },

    {
      name: "Feedback",
      path: `mailto:vidchill@vidchill.com`,
      icon: (className) => <MessagePlusSquare className={className} />,
      current: router.pathname === `/Feedback`,
    },
  ];

  const mobileNavigation = sessionData
    ? SignedInMobileNavigation
    : SignedOutMobileNavigation;

  useEffect(() => {
    DesktopNavigation.forEach((nav) => {
      nav.current = nav.path === router.pathname;
    });
    mobileNavigation.forEach((nav) => {
      nav.current = nav.path === router.pathname;
    });
  }, [router.pathname]);

  return (
    <>
      <DesktopSidebar DesktopNavigation={DesktopNavigation} closeSidebar={closeSidebar} />
      {/* Static sidebar for Mobile Animation */}
      <MobileSidebar setSidebarOpen={setSidebarOpen} isOpen={isOpen} mobileNavigation={mobileNavigation} />
    </>
  );
}
