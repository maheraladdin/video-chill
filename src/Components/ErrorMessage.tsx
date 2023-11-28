import { GreenHorn, GreenPeople, GreenPlay } from "./Icons";
import ReactLoading from "react-loading";
import {type ReactNode} from "react";

export function ErrorMessage({
  children,
  message,
  description,
  icon,
  className,
}: {
  children?: ReactNode;
  icon?: "GreenHorn" | "GreenPeople" | "GreenPlay";
  message: string;
  description?: string;
  className?: string;
}) {
  const IconSelection = ({
    icon,
    className,
  }: {
    icon?: string;
    className: string;
  }) => {
    if (icon === "GreenHorn") {
      return <GreenHorn className={className} />;
    } else if (icon === "GreenPeople") {
      return <GreenPeople className={className} />;
    } else {
      return <GreenPlay className={className} />;
    }
  };

  return (
    <div className={`relative mt-16 flex w-full  flex-col items-center justify-center gap-2 text-center ${className}`}>
      <IconSelection className="center items-center" icon={icon} />
      <h1 className="text-2xl font-semibold text-gray-900">{message}</h1>
      <p className="max-w-xs text-gray-600">{description}</p>
      {children}
    </div>
  );
}

export function LoadingMessage() {
  return (
    <div className="relative mt-16 flex w-full  flex-col items-center justify-center gap-2 text-center">
      <ReactLoading
        type={"spinningBubbles"}
        color={"#11999E"}
        height={250}
        width={200}
      />
      <h1 className="text-2xl font-semibold text-gray-900">Loading</h1>
    </div>
  );
}
