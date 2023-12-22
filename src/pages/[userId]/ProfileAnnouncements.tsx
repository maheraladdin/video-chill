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
import moment from "moment";
import {AnnouncementButton} from "src/Components/Buttons";
import { useSession } from "next-auth/react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import { ErrorMessage as FromErrorMessage } from "@hookform/error-message"


const schema = z.object({
    announcement: z.string()
        .nonempty("Announcement cannot be empty")
        .min(5, "Announcement must be at least 10 characters")
        .max(200, "Announcement cannot be more than 500 characters"),
});


const ProfileAnnouncements: NextPage = () => {
  const router = useRouter();
  const { userId } = router.query;
  const { data: sessionData } = useSession();
  const { register, getValues, formState: {errors}, handleSubmit, resetField, } = useForm({
      resolver: zodResolver(schema),
  });

  const addAnnouncementMutation =
      api.announcement.addAnnouncement.useMutation();
  const addAnnouncement = (input: { userId: string; message: string }) => {
    addAnnouncementMutation.mutate(input, {
      onSuccess: () => {
        resetField("announcement");
        void refetch();
      },
    });
  };

  const handleAnnouncementSubmit = () => {
    addAnnouncement({
      userId: sessionData ? sessionData.user.id : ("none" as string),
      message: getValues("announcement"),
    });
  };

  const { data, isLoading, error, refetch } =
      api.announcement.getAnnouncementsByUserId.useQuery({
        id: userId as string,
        viewerId: sessionData?.user.id,
      }, {
        refetchOnWindowFocus: false,
      });
  const announcements = data?.announcements;
  const errorTypes = error || announcements?.length == 0 || !data;
  const Error = () => {
    if (isLoading) {
      return <LoadingMessage />;
    } else if (userId == sessionData?.user.id && errorTypes) {
      return (
          <PageErrorMessage
              icon="GreenHorn"
              message="No Announcements"
              description="You have yet to make an announcement. Post one now!"
          />
      );
    } else if (errorTypes) {
      return (
          <PageErrorMessage
              icon="GreenHorn"
              message="No Announcements"
              description="This page has yet to make an announcement."
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
            {userId == sessionData?.user.id ? (
                <form onSubmit={handleSubmit(handleAnnouncementSubmit)}>
                  <div className=" relative mt-2 flex flex-row gap-2">
                    <div className="w-full">
                      <textarea
                          rows={4}
                          id="announcement"
                          {...register("announcement")}
                          className="block w-full rounded-md border-0 p-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 outline-none resize-none"
                          placeholder="Add A Announcement"
                      />
                      <FromErrorMessage
                          errors={errors}
                          name="announcement"
                          render={({ message }) => (
                              <p className="text-xs text-error-600 mt-2">{message}</p>
                          )}
                      />
                    </div>
                    <div className="flex-shrink-0">
                      <button
                          type="submit"
                          className="inline-flex items-center rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </form>
            ) : null}
            {errorTypes ? (
                <Error />
            ) : (
                <ul role="list" className="-pt-8 divide-y divide-gray-200">
                  {announcements
                      ?.sort(
                          (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                      )
                      .map((announcement, index) => {
                        const user = data.user[index];
                        if (!user) {
                          return null;
                        }
                        return (
                            <li className="pt-4" key={announcement.id}>
                              <div className="flex gap-2 ">
                                <UserImage image={user.image || ""} name={user.name || ""} />
                                <div className="flex w-full flex-col ">
                                  <div className="flex flex-col">
                                    <div className="flex flex-row items-center gap-2">
                                      <p className="w-max text-sm font-semibold leading-6 text-gray-900">
                                        {user.name}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {moment(announcement.createdAt).fromNow()}
                                      </p>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {user.handle}
                                    </p>
                                  </div>
                                  <p className="my-2 text-sm text-gray-600">
                                    {announcement.message}
                                  </p>
                                  <AnnouncementButton
                                      EngagementData={{
                                        id: announcement.id,
                                        likes: announcement.likes,
                                        dislikes: announcement.dislikes,
                                      }}
                                      viewer={{
                                        hasDisliked: announcement.viewer.hasDisliked,
                                        hasLiked: announcement.viewer.hasLiked,
                                      }}
                                      refetch={refetch}
                                  />
                                </div>
                              </div>
                            </li>
                        );
                      })}
                </ul>
            )}
          </>
        </Layout>
      </>
  );
};

export default ProfileAnnouncements;