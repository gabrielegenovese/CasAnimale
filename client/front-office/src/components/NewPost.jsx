import React, { useState } from "react";
import PostManage from "../services/PostManage";
import { Image, useToast } from "@chakra-ui/react";
import { Uploader } from "uploader";
import { UploadButton } from "react-uploader";

const NewPost = ({ type }) => {
  const toast = useToast();

  const sendData = async (data) => {
    data.preventDefault();
    const msg = await PostManage.newPost({
      title,
      photo,
      type,
      description,
    });
    if (msg.status.toString() === "200") {
      toast({
        title: "Post added successfully!",
        status: "success",
        duration: 3000,
        variant: "subtle",
      });
      window.location.reload();
    } else {
      toast({
        title: "Ops something went wrong!",
        description: "If you can't proceed with the posting try to re-access.",
        status: "error",
        duration: 3000,
        variant: "subtle",
      });
    }
  };

  const [title, setTitle] = useState([]);
  const [photo, setPhoto] = useState("");
  const [description, setDescription] = useState("");

  const uploader = Uploader({
    apiKey: "free",
  });

  const options = { multi: false };

  function checkPhoto() {
    if (photo === "") return true;
    else return false;
  }

  return (
    <div data-theme="lemonade" className="flex flex-1 justify-center">
      <div className="flex flex-1 justify-center">
        <div
          className="flex justify-center"
          style={{ width: "90%", flex: "0 1 auto", alignItems: "center" }}
        >
          <form onSubmit={sendData} className="flex justify-center w-full">
            <div className="mx-3 mt-0 card justify-center w-full ">
              <div className="card-body text-center py-0">
                <h1 className="card-title font-semibold text-md justify-center uppercase">
                  Create a new post!
                </h1>
                <div className="form-control">
                  <label className="label" for="postTitle">
                    <span className="label-text">
                      Type the title{" "}
                      <span className="text-sm text-gray-400">*</span>
                    </span>
                  </label>
                  <input
                    id="postTitle"
                    required
                    type="text"
                    placeholder="Title"
                    className="input input-bordered"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-control">
                  <label className="label" for="postDescription">
                    <span className="label-text">
                      Type the description of the post{" "}
                      <span className="text-sm text-gray-400">*</span>
                    </span>
                  </label>
                  <textarea
                    id="postDescription"
                    className="input input-bordered w-full"
                    placeholder="Type the text"
                    required
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <div className="form-control">
                  <label className="label" for="postPhoto">
                    <span className="label-text">Set a photo</span>
                  </label>
                  <UploadButton
                    id="postPhoto"
                    uploader={uploader} // Required.
                    options={options} // Optional.
                    onComplete={(files) => {
                      // Optional.
                      if (files.length === 0) {
                        console.log("No files selected.");
                      } else {
                        console.log("Files uploaded");
                        console.log(files.map((f) => setPhoto(f.fileUrl)));
                      }
                    }}
                  >
                    {({ onClick }) =>
                      checkPhoto() ? (
                        <>
                          <div className="rounded-lg pt-1 flex items-center justify-center border-dashed border-2 border-gray-300">
                            <button
                              className="text-gray-400 text-center"
                              onClick={onClick}
                            >
                              <Image
                                id="changephoto"
                                src={photo}
                                className="input input-bordered"
                                boxSize="fill"
                                alt="UPLOAD A PHOTO"
                              />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="rounded-lg py-1 flex items-center justify-center">
                            <button className="" onClick={onClick}>
                              <Image
                                id="changephoto"
                                src={photo}
                                className="input input-bordered"
                                boxSize="fill"
                                alt="Upload a photo"
                              />
                            </button>
                          </div>
                        </>
                      )
                    }
                  </UploadButton>
                </div>
                <div>
                  <button className="btn btn-secondary mt-3">Post</button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewPost;
