import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  PageErrorMessage,
  Layout,
  LoadingMessage,
  ProfileHeader,
  UserImage,
} from "~/Components";
import { FollowButton } from "src/Components/Buttons";
import { useSession } from "next-auth/react";
import Link from "next/link";
const ProfileFollowigs: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();

  const {
    data: user,
    isLoading,
    error,
    refetch: refetchUser,
  } = api.user.getUserFollowings.useQuery({
    id: userId as string,
    viewerId: sessionData?.user.id,
  });
  const errorTypes =
    !user?.followings || error || user?.followings?.length === 0;

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (userId == sessionData?.user.id && errorTypes) {
      return (
        <PageErrorMessage
          icon="GreenHorn"
          message="No people followed"
          description="You have yet to follow anyone else. Follow someone now!"
        />
      );
    } else if (errorTypes) {
      return (
        <PageErrorMessage
          icon="GreenPeople"
          message="No people followed"
          description="This page has yet to follow a new person. "
        />
      );
    } else {
      return <></>;
    }
  };
  return (
    <>
      <Layout>
        <>
          <ProfileHeader />
          {errorTypes ? (
            <Error />
          ) : (
            <ul role="list" className="-mt-8 divide-y divide-gray-200">
              {user?.followings.map((following) => (
                <li className="py-4" key={following.following.id}>
                  <div className="flex gap-2">
                    <Link
                      href={`/${following.following.id}/ProfileVideos`}
                    >
                      <UserImage
                        className="!h-10 !w-10 "
                        image={following.following?.image || ""}
                        name={following.following.name as string}
                      />
                    </Link>
                    <div className="flex w-full flex-row justify-between">
                      <div className="flex flex-col text-sm">
                        <p className="font-semibold text-gray-900">
                          <Link
                              href={`/${following.following.id}/ProfileVideos`}
                          >
                          {following.following.name}
                          </Link>
                        </p>
                        <p className="text-gray-600">
                          <Link
                              href={`/${following.following.id}/ProfileVideos`}
                          >
                          {following.following?.handle}
                          </Link>
                        </p>
                      </div>
                      <FollowButton
                        followingId={following.following.id}
                        viewer={{ hasFollowed: following.viewerHasFollowed }}
                        refetch={refetchUser}
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      </Layout>
    </>
  );
};

export default ProfileFollowigs;
