import { type NextPage } from "next";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import {
  MultiColumnPlaylist,
  ProfileHeader,
  Layout,
  PageErrorMessage,
  LoadingMessage,
} from "~/Components";
import { useSession } from "next-auth/react";
const ProfilePlaylists: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();

  const { data, isLoading, error } = api.playlist.getPlaylistsByUserId.useQuery(
    userId as string,
    {
      refetchOnWindowFocus: false,
    }
  );
  const errorTypes = !data || data?.length === 0 || error;

  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (userId == sessionData?.user.id && errorTypes) {
      // if user is on their own profile and has no playlists
      return (
        <PageErrorMessage
          message="No Playlists Created"
          description="You have not yet created a playlist inside your library."
        />
      );
    } else if (errorTypes) {
      // if user is on another user's profile and they have no playlists
      return (
        <PageErrorMessage
          message="No Playlists created"
          description="Profile has not yet created a playlist."
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
            <MultiColumnPlaylist
              playlists={data.map((playlist) => ({
                id: playlist.id,
                title: playlist.title,
                description: playlist.description || "",
                videoCount: playlist.videoCount,
                playlistThumbnail: playlist?.playlistThumbnail || "",
                createdAt: playlist.createdAt,
              }))}
            />
          )}
        </>
      </Layout>
    </>
  );
};

export default ProfilePlaylists;
