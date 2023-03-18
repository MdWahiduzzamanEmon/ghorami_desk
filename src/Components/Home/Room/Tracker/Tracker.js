import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import TrackerNav from "./TrackerNav/TrackerNav";
import { Grid, Box } from "@mui/material";
import CheckList from "./Checklist/CheckList";

import Messenger from "./Chatting/Messenger/index";
import Attachment from "./Attachment/Attachment";
import Assigner from "./../Assigner/Assigner";
import Watching from "../Watching/Watching";
import Admin from "../Admin/Admin";

import RoomAndTaskIdDetails from "./../RoomAndTaskIdDetails/RoomAndTaskIdDetails";
let interval2 = null;
let Interval = null;

const Tracker = () => {
  useEffect(() => {
    document.title = "Ghorami Desk - Tracker";
  }, []);
  const { trackerId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isActiveInterval, setIsActiveInterval] = useState(false);
  const [screenShot, setScreenShot] = useState("");
  const [stream, setStream] = useState(false);
  const location = useLocation();
  const [twoCompApiLoad, setTwoCompApiLoad] = useState(false);
  // console.log(isActiveInterval);
  const takeScreenShot = async () => {
    // console.log("takeScreenShot");
    // take video shoot and set it to state  screenShot
    try {
      let displayMediaOptions = {
        video: {
          cursor: "never",
        },
        audio: false,
      };
      let video = document.getElementById("video");
      const stream = await navigator.mediaDevices.getDisplayMedia(
        displayMediaOptions
      );
      // console.log(stream);
      video.srcObject = stream;
      video.play();
      if (stream.active === true) {
        setStream(true);
      }

      // if (isActiveInterval) {
      // console.log(true);
      Interval = setInterval(() => {
        let canvas = document.createElement("canvas");
        canvas.width = video?.videoWidth;
        canvas.height = video?.videoHeight;
        canvas
          .getContext("2d")
          .drawImage(video, 0, 0, canvas.width, canvas.height);
        let data = canvas.toDataURL("image/png").split(",")[1];
        setScreenShot(data);
        interval2 = setInterval(captureScreen(data), 10000);
      }, 10000);
      // } else {
      //   clearInterval(Interval);
      // }

      return () => {
        clearInterval(Interval);
        video.srcObject = null;
      };
    } catch (err) {
      console.log(err);
    }
  };

  const captureScreen = (data) => {
    const date = new Date();
    const Today =
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
    let Localtime =
      date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
    let axios = require("axios");
    let FormData = require("form-data");
    let dataForm = new FormData();
    dataForm.append("poster", user.sopnoid);
    dataForm.append("ser_refer", location.state.serviceID);
    dataForm.append("maintas", trackerId);
    dataForm.append("room_id", location.state.room);
    dataForm.append("date", Today);
    dataForm.append("heada", "screenShot");
    dataForm.append("time", Localtime);
    dataForm.append("encoded_string4", data);
    // console.log(Localtime);
    let config = {
      method: "post",
      url: `${user.master_url}/profile/ap_utask_screen_up_web.php`,
      data: dataForm,
    };
    axios(config)
      .then(function (response) {
        // console.log(response.data);
        // setTaskDatas(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const stopCapture = () => {
    setIsActiveInterval(false);
    setScreenShot("");
    setStream(false);
    const video = document.getElementById("video");
    let tracks = video?.srcObject?.getTracks();
    tracks.forEach((track) => {
      track.stop();
    });
    video.srcObject = null;
    clearInterval(interval2);
    clearInterval(Interval);
  };

  //admin check restriction
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    let axios = require("axios");
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state?.room);
    formData.append("task", trackerId);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/api/utask_tag_all.php
`,
        formData
      )
      .then((res) => {
        // console.log(res.data);

        // matching with shopnoId
        const check = res.data.find((item) => item?.as_gid === user?.sopnoid);
        // console.log(check);
        if (check===undefined) {
          setAdmin(false);
        } else {
          setAdmin(true);
        }

        //  setLoader(false);
      });
  }, [
    user.master_url,
    trackerId,
    location.state?.room,
    user.sopnoid,
    twoCompApiLoad,
  ]);
  // console.log(admin);
  return (
    <Box
      style={{
        // height: '100vh',
        width: "100%",
      }}
    >
      <video id="video" autoPlay hidden></video>

      <TrackerNav
        trackerId={trackerId}
        takeScreenShot={takeScreenShot}
        // stopInterval={stopInterval}
        setIsActiveInterval={setIsActiveInterval}
        isActiveInterval={isActiveInterval}
        screenShot={screenShot}
        stream={stream}
        setStream={setStream}
        stopCapture={stopCapture}
        admin={admin}
        // Localtime={Localtime}
      />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1 }}>
        <Grid item xs={12} sm={12} lg={2} xl={2} md={4}>
          <CheckList trackerId={trackerId} admin={admin} />
          <RoomAndTaskIdDetails trackerId={trackerId} />
        </Grid>
        <Grid item xs={12} lg={5} xl={5} md={8}>
          <Messenger trackerId={trackerId} />
        </Grid>
        <Grid
          item
          xs={12}
          lg={3}
          xl={3}
          md={6}
          sx={[
            {
              "@media only screen and (max-width: 1024px)": {
                mt: "2rem",
              },
            },
          ]}
        >
          <Attachment trackerId={trackerId} />
        </Grid>
        <Grid
          item
          xs={12}
          lg={2}
          sm={12}
          xl={2}
          md={6}
          sx={[
            {
              "@media only screen and (max-width: 1024px)": {
                mt: "2rem",
              },
            },
          ]}
        >
          <Grid container direction="column" spacing={1}>
            <Grid item xs={12}>
              <Assigner
                trackerId={trackerId}
                admin={admin}
                setTwoCompApiLoad={setTwoCompApiLoad}
                twoCompApiLoad={twoCompApiLoad}
              />
            </Grid>
            <Grid item xs={12}>
              <Watching trackerId={trackerId} />
            </Grid>
            <Grid item xs={12}>
              <Admin
                trackerId={trackerId}
                admin={admin}
                setTwoCompApiLoad={setTwoCompApiLoad}
                twoCompApiLoad={twoCompApiLoad}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default React.memo(Tracker);
