import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import { Thumbnail } from "./index";
import { useSession } from "next-auth/react";
import { type FC } from "react";

interface VideoComponentProps {
  videos: {
    id: string;
    title: string;
    thumbnailUrl: string;
    createdAt: Date;
    views: number;
  }[];
  users: {
    image: string;
    name: string;
  }[];
  refetch?: () => Promise<unknown>;
}

export const MultiColumnVideo: FC<VideoComponentProps> = ({
  videos,
  users,
}) => (
  <div className=" mx-auto grid grid-cols-1 gap-x-4 gap-y-8 md:mx-0 md:max-w-none md:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:max-w-none xl:grid-cols-3 2xl:mx-0 2xl:max-w-none 2xl:grid-cols-3  ">
    {videos.map((video, index) => {
      const user = users[index];
      if (!user) {
        return null;
      }
      return (
        <Link
          href={`/video/${video.id}`}
          className="flex flex-col items-start justify-between hover:bg-gray-100 dark:hover:bg-neutral-900 rounded-2xl"
          key={video.id}
        >
          <div className="relative w-full">
            <Thumbnail thumbnailUrl={video.thumbnailUrl} alt={`${video.title}'s thumbnail`} />
            <div className=" max-w-xl ">
              <div className="items-top relative mt-4 flex gap-x-4 ">
                <UserImage image={user.image || ""} name={user.name as string} />
                <div className="w-full">
                  <VideoTitle title={video.title} limitHeight={true} />
                  <VideoInfo views={video.views} createdAt={video.createdAt} />
                  <UserName name={user.name || ""} />
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
);

export const SingleColumnVideo: FC<VideoComponentProps> = ({
  videos,
  users,
}) => (
  <div>
    {videos.map((video, index) => {
      const user = users[index];
      if (!user) {
        return null;
      }
      return (
        <Link href={`/video/${video.id}`} key={video.id}>
          <div className="my-5 flex flex-col gap-4 hover:bg-gray-100 dark:hover:bg-neutral-900 lg:flex-row">
            <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:w-64 lg:shrink-0">
              <Thumbnail thumbnailUrl={video.thumbnailUrl} alt={`${video.title}'s thumbnail`} />
            </div>
            <div>
              <VideoTitle title={video.title} />
              <VideoInfo views={video.views} createdAt={video.createdAt} />

              <div className="relative mt-2 flex flex-row items-center gap-x-4">
                <UserImage image={user.image || ""} name={user.name as string} />
                <UserName name={user.name || ""} />
              </div>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
);

export const SmallSingleColumnVideo: FC<VideoComponentProps> = ({
  videos,
  users,
  refetch,
}) => (
  <>
    {videos.map((video, index) => {
      const user = users[index];
      if (!user) {
        return null;
      }
      if(video.id === "undefined" || video.id === undefined || video.id === "") return null;

      return (
        <Link href={`/video/${video.id}`} key={video.id + index} onClick={refetch}>
          <div className="overflow-hidden relative isolate my-4 flex flex-col gap-4 rounded-2xl border dark:border-neutral-700 hover:bg-gray-100 dark:hover:bg-neutral-900 lg:flex-row ">
            <div className=" aspect-[16/9] sm:aspect-[2/1] lg:w-52  lg:shrink-0">
              <Thumbnail notRounded={true} thumbnailUrl={video.thumbnailUrl} alt={`${video.title}'s thumbnail`} />
            </div>
            <div className="mt-2 flex w-full flex-col items-start overflow-hidden text-xs  max-lg:mx-2">
              <VideoTitle
                title={video.title}
                limitHeight={true}
                limitSize={true}
              />
              <VideoInfo views={video.views} createdAt={video.createdAt} />
              <UserName name={user.name || ""} />
            </div>
          </div>
        </Link>
      );
    })}
  </>
);

export function VideoTitle({
  title,
  limitHeight,
  limitSize,
}: {
  title: string;
  limitHeight?: boolean;
  limitSize?: boolean;
}) {
  return (
    <h1
      className={`max-w-md font-semibold leading-6 text-gray-900 dark:text-white group-hover:text-gray-600 group-hover:dark:text-gray-50 ${
        limitSize ? "text-base" : "text-lg"
      } ${limitHeight ? "max-h-12 w-full overflow-hidden" : ""}`}
    >
      {title}
    </h1>
  );
}

export function VideoDescription({ description }: { description: string }) {
  return (
    <p className="mt-2 h-5 max-w-md overflow-hidden text-sm leading-6 text-gray-600">
      {description}
    </p>
  );
}
export function VideoInfo({
  views,
  createdAt,
}: {
  createdAt: Date | string;
  views: number;
}) {
  return (
    <div className="mt-1 flex max-h-6 items-start overflow-hidden text-sm">
      <p className=" text-gray-600 dark:text-white">
        {views}
        <span> Views</span>
      </p>
      <li className="pl-2 text-sm text-gray-500 dark:text-gray-400"></li>
      <p className=" text-gray-600 dark:text-white">{moment(createdAt).fromNow()}</p>
    </div>
  );
}

export function UserImage({
  image,
  className = "",
  name,
}: {
  image: string;
  className?: string;
  name?: string;
}) {
  const {data: sessionData} = useSession();
  return (
    <div className={`relative h-10 w-10 ${className}`}>
      <Image
        src={image || "/profile.jpg"}
        alt={`${name ? name : sessionData ? sessionData?.user.name : "User"}'s profile picture`}
        className="rounded-full"
        fill
      />
    </div>
  );
}
export function UserName({ name }: { name: string }) {
  return (
    <p className="max-h-6 overflow-hidden text-sm font-semibold leading-6 text-gray-900 dark:text-white">
      {name}
    </p>
  );
}
