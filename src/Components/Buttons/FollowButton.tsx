import React, {useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { UserPlus } from "~/Components/Icons";
import Button from "./Button";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface FollowButton {
  followingId: string;
  hideIcon?: boolean;
  viewer: {
    hasFollowed: boolean;
  };
  refetch?: () => void;
}
export default function FollowButton({
  followingId,
  hideIcon,
  viewer,
  refetch = () => {},
}: FollowButton) {
  const { data: sessionData } = useSession();
  const [isFollowing, setIsFollowing] = useState(viewer.hasFollowed);
  const addFollowMutation = api.user.addFollow.useMutation();
  const handleFollow = (input: { followingId: string; followerId: string }) => {
    setIsFollowing(!isFollowing);
    addFollowMutation.mutate(input);
    void refetch();
  };

    useEffect(() => {
        setIsFollowing(viewer.hasFollowed);
    }, [viewer.hasFollowed]);

  return (
    <>
      <Button
        variant={isFollowing ? "secondary-gray" : "primary"}
        size="xl"
        onClick={
          sessionData
            ? () =>
                handleFollow({
                  followingId: followingId ? followingId : "",
                  followerId: sessionData ? sessionData.user.id : "",
                })
            : () => void signIn()
        }
        className="flex"
      >
        <UserPlus
          className={classNames(
            hideIcon
              ? "hidden"
              : `mr-2 h-5 w-5 shrink-0
              ${isFollowing ? "stroke-gray-600 " : "stroke-white "}
              `
          )}
        />
        {isFollowing ? "Following" : "Follow"}
      </Button>
    </>
  );
}
