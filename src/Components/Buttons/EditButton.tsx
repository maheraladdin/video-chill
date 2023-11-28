import { Transition, Dialog } from "@headlessui/react";
import React, { useState, useRef, Fragment } from "react";
import { Edit } from "../Icons";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Button } from "./index";
import { api } from "~/utils/api";
import { useSession } from "next-auth/react";
import { env } from "~/env.mjs";
import {useForm} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";

interface EditButtonProps {
  video: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
  };
  refetch: () => Promise<unknown>;
}

export function EditButton({ video, refetch }: EditButtonProps) {
  // ! Step 1 start
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);

  // ! Step 1 End
  // ! Step 2 start
  const [currentPage, setCurrentPage] = useState(1);
  // ! Step 2 End
  // ! Step 3 start
  const [image, setImage] = useState<File | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  // ! Step 3 End

  // user form
  // ! Step 2 start
  const  {register, getValues, formState: { errors }} = useForm();
  const addVideoUpdateMutation = api.video.updateVideo.useMutation();

  const { data: sessionData } = useSession();
  // ! Step 2 Stop

  // ! step 4
  const handleSubmit = () => {

    type UploadResponse = {
      secure_url: string;
    };

    const videoData = {
      id: video.id,
      userId: sessionData?.user.id as string,
      title: video.title || undefined,
      description: video.description || undefined,
      thumbnailUrl: video.thumbnailUrl || undefined,
    };


    const formData = new FormData();
    formData.append("upload_preset", "user_uploads");
    formData.append("file", croppedImage as string);

    // upload the image to cloudinary
    fetch(`https://api.cloudinary.com/v1_1/${env.NEXT_PUBLIC_CLOUDINARY_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    )
      .then((response) => response.json() as Promise<UploadResponse>)
      .then((data) => {
        // if the title, description, or thumbnailUrl have changed, update the video
        if (
          getValues("title") !== video.title ||
          getValues("description") !== video.description ||
          data.secure_url !== undefined
        ) {
          const newVideoData = {
            ...videoData,
            ...(data.secure_url && { thumbnailUrl: data.secure_url }),
          };

          // only include title and description if they've changed
          if (getValues("title") !== video.title) newVideoData.title = getValues("title");
          if (getValues("description") !== video.description) newVideoData.description = getValues("description");

          addVideoUpdateMutation.mutate(newVideoData, {
            onSuccess: () => {
              setOpen(false);
              void refetch();
            },
          });
        }
      })
      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };
  //! step 4 end
  //user form end
  // ! Step 2 start

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0] ? e.target.files[0] : null);
      setCurrentPage(2);
    }
  };
  // ! Step 2 Stop

  // ! Step 1 start
  const handleClick = () => {
    setCurrentPage(1);
    setOpen(true);
  };
  // ! Step 1 End

  return (
    <>
      {/* ! step 1 start */}
      <button onClick={handleClick}>
        <Edit className="mr-2 h-5 w-5 shrink-0 stroke-gray-600 hover:stroke-primary-600" />
      </button>

      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative "
          initialFocus={cancelButtonRef}
          onClose={setOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 translate-y-[-40vh] sm:translate-y-[0]">
                  {/* ! step 1 End */}
                  {/* step 2 start */}
                  {currentPage === 1 && (
                    <>
                      <div className="sm:flex sm:items-start  ">
                        <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Edit Video
                          </Dialog.Title>
                          <p className="mt-2 text-sm text-gray-500">
                            Edit your thumbnail, title, or description
                          </p>
                          <div className="col-span-full">
                            <label
                              htmlFor="cover-photo"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Cover photo
                            </label>
                            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                              <div className="text-center">
                                {croppedImage ? (
                                  <img src={croppedImage} alt="Cropped" />
                                ) : (
                                  <>
                                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                      <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-500"
                                      >
                                        <span>Upload a file</span>
                                        <input
                                          id="file-upload"
                                          name="file-upload"
                                          type="file"
                                          className="sr-only"
                                          onChange={onFileChange}
                                        />
                                      </label>
                                      <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-600">
                                      PNG, JPG, GIF up to 10MB
                                    </p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Title
                            </label>
                            <div className="mt-2">
                              <input
                                type="text"
                                id="title"
                                {...register("title", { required: true })}
                                className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 outline-none"
                              />
                              <ErrorMessage
                                  errors={errors}
                                  name="title"
                                  render={({ message }) => (
                                  <p className="text-xs text-red-500">
                                      {message}
                                  </p>
                                  )}
                                />
                            </div>

                            <label
                              htmlFor="title"
                              className="block text-sm font-medium leading-6 text-gray-900"
                            >
                              Description
                            </label>
                            <div className="mt-2">
                              <textarea
                                rows={4}
                                id="description"
                                {...register("description", {
                                  required: true,
                                })}
                                className="block w-full rounded-md border-0 p-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6 outline-none resize-none"
                              />
                              <ErrorMessage
                                  errors={errors}
                                  name="description"
                                  render={({ message }) => (
                                  <p className="text-xs text-red-500">
                                      {message}
                                  </p>
                                  )}
                                />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className=" relative mt-5 flex flex-row-reverse gap-2 sm:mt-4 ">
                        <Button
                          type="reset"
                          variant="primary"
                          size="lg"
                          onClick={() => handleSubmit()}
                        >
                          Save
                        </Button>
                        <Button
                          variant="secondary-gray"
                          size="lg"
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                  {/* step 2 End */}

                  {currentPage === 2 && (
                    <>
                      <ImageCropper
                        setCurrentPage={setCurrentPage}
                        setCroppedImage={setCroppedImage}
                        image={image}
                      />
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}



// step 3
export function ImageCropper({
  setCurrentPage,
  setCroppedImage,
  image,
  handleSubmit,
  imageType,
  setOpen,
}: {
   handleSubmit?: (croppedDataUrl: string) => void;
  setCurrentPage?: (page: number) => void;
  setCroppedImage: (image: string | null) => void;
  image: File | null | string;
  imageType?: "backgroundImage" | "image";
  setOpen?: (open: boolean) => void;
}) {
  interface CropperImageElement extends HTMLImageElement {
    cropper?: Cropper;
  }

  const cropperRef = useRef<CropperImageElement>(null);

  /**
   * @description Crops the image and sets the cropped image to state
   */
  const cropImage = () => {
    if (cropperRef.current) {
      const imageElement: CropperImageElement | null = cropperRef.current;
      const cropper: Cropper | undefined = imageElement.cropper;
      if (cropper) {
        const croppedDataUrl = cropper.getCroppedCanvas().toDataURL();
        setCroppedImage(croppedDataUrl);
        handleSubmit ? handleSubmit(croppedDataUrl) : null;
      }
    }
  };

  /**
   * @description Completes the crop, sets the cropped image to state, and closes the modal
   */
  const completeCrop = () => {
    cropImage();
    setCurrentPage ? setCurrentPage(1) : null;
  };

  /**
   * @description Cancels the crop and closes the modal
   */
  const cancelCrop = () => {
    setCurrentPage ? setCurrentPage(1) : null;
    setOpen ? setOpen(false) : null;
  };

  return (
    <div className="sm:flex sm:items-start">
      <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
        {image && (
          <div className="mt-5">
            <Cropper
              src={image instanceof File ? URL.createObjectURL(image) : image}
              style={{ height: "100%", width: "100%" }}
              aspectRatio={imageType === "image" ? 1 : 16 / 9}
              guides={false}
              ref={cropperRef}
            />
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="secondary-gray" size="lg" onClick={cancelCrop}>
                cancel
              </Button>
              <Button variant="primary" size="lg" onClick={completeCrop}>
                Crop Image
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
// step 3 end
