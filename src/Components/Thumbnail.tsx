import React from "react";
import Image from "next/image";

type ThumbnailProps = {
    thumbnailUrl: string;
    alt: string;
    notRounded?: boolean;
};
export function Thumbnail({ thumbnailUrl, alt, notRounded }: ThumbnailProps) {
  return (
    <div className=" relative inset-0 h-0 w-full pb-[50%]">
      <Image
        src={thumbnailUrl || "/background.jpg"}
        alt={alt || "thumbnail"}
        fill
        className={`inset-0 left-0 top-0 ${notRounded ?  "" : "rounded-2xl"}`}
      />
    </div>
  );
}
