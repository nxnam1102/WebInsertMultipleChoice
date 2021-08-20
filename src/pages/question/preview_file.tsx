import React, { useRef } from "react";
import AppPopup from "../../components/controls/popup";
import { ApiAddress } from "../../services/http_client.helper";
import ReactAudioPlayer from "react-audio-player";
import { Button } from "devextreme-react";

export const PreviewFile = (props: any) => {
  let formRef = props.formRef;
  let data = props.data;
  let type = data?.Type;
  console.log(data?.Path);
  const audioRef = useRef<any>(null);
  return (
    <div>
      <AppPopup
        height={500}
        width={800}
        popupRef={formRef}
        onHiding={() => {
          if (audioRef.current?.audioEl?.current) {
            audioRef.current.audioEl.current.pause();
          }
        }}
      >
        <div>
          {type === "image/url" ? (
            <img
              src={data.Path}
              width={700}
              height={400}
              alt={"urlimage"}
              style={{ objectFit: "contain" }}
            />
          ) : type === "image/server" ? (
            <img
              src={`${ApiAddress}/File/DownLoadFile?sourceFile=${data.Path}`}
              width={700}
              height={400}
              alt={"serverimage"}
              style={{ objectFit: "contain" }}
            />
          ) : type === "audio/url" ? (
            <ReactAudioPlayer
              ref={audioRef}
              src={data.Path}
              autoPlay
              controls
            />
          ) : type === "audio/server" ? (
            <ReactAudioPlayer
              ref={audioRef}
              src={`${ApiAddress}/File/DownLoadFile?sourceFile=${data.Path}`}
              autoPlay
              controls
            />
          ) : null}
        </div>
      </AppPopup>
    </div>
  );
};
