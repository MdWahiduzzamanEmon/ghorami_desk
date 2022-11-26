import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { HiOutlineClock } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import StartAndExpire from "../StartAndExpire/StartAndExpire";
let interval = null;

const TrackerNav = ({
  trackerId,
  takeScreenShot,
  stream,
  screenShot,
  setIsActiveInterval,
  isActiveInterval,
  setStream,
  stopCapture,
  admin,
}) => {
  //for time tracking
  const [isActive, setIsActive] = useState(false);
  const [lastTime, setLastTime] = useState("");
  const [isPaused, setIsPaused] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const [taskDatas, setTaskDatas] = useState([]);
  const [startEndDate, setStartEndDate] = useState([]);
  const [load, setLoad] = useState(false);

  const date = new Date();
  const location = useLocation();
  const navigate = useNavigate();

  let tempData = "";

  const Today =
    date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();

  // let Localtime =
  //   date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

  let lastTimeValue = lastTime?.split(":");

  const dataParse = lastTimeValue?.map((item) => {
    return parseInt(item);
  });

  // console.log(dataParse);
  const [times, setTimes] = useState({});
  const [times2, setTimes2] = useState({
    seconds: 0,
    minutes: 0,
    hours: 0,
    days: 0,
  });
  // console.log(times2);

  useEffect(() => {
    let time = {};
    for (let i = 0; i < dataParse?.length; i++) {
      time["day"] =
        dataParse?.[0] === undefined ||
          isNaN(dataParse?.[0]) ||
          dataParse?.[0] === ""
          ? 0
          : dataParse?.[0];
      time["hour"] =
        dataParse?.[1] === undefined ||
          isNaN(dataParse?.[1]) ||
          dataParse?.[1] === ""
          ? 0
          : dataParse?.[1];

      time["minute"] =
        dataParse?.[2] === undefined ||
          isNaN(dataParse?.[2]) ||
          dataParse?.[2] === ""
          ? 0
          : dataParse?.[2];
      time["second"] =
        dataParse?.[3] === undefined ||
          isNaN(dataParse?.[3]) ||
          dataParse?.[3] === ""
          ? 0
          : dataParse?.[3];
    }
    const movies = time;
    setTimes(movies);
    setTimes2({
      seconds: time.second,
      minutes: time.minute,
      hours: time.hour,
      days: time.day,
    });
  }, [dataParse?.[0], dataParse?.[1], dataParse?.[2], dataParse?.[3]]);

  React.useEffect(() => {
    let interval = null;
    // console.log(stream);
    if (isActive && isPaused === false && stream === true) {
      interval = setInterval(() => {
        times.second++;

        setTimes(times);

        if (times.second === 60) {
          times.second = 0;
          times.minute++;

          setTimes(times);
        }
        if (times.minute === 60) {
          times.minute = 0;
          times.hour++;

          setTimes(times);
        }
        if (times.hour === 24) {
          times.hour = 0;
          times.day++;

          setTimes(times);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused, times, stream]);

  React.useEffect(() => {
    let interval = null;
    // console.log(stream);
    if (isActive && isPaused === false && stream === true) {
      interval = setInterval(() => {
        times2.seconds++;

        setTimes2({ ...times2 });
        if (times2.seconds === 60) {
          times2.seconds = 0;
          times2.minutes++;

          setTimes2({ ...times2 });
        }
        if (times2.minutes === 60) {
          times2.minutes = 0;
          times2.hours++;

          setTimes2({ ...times2 });
        }
        if (times2.hours === 24) {
          times2.hours = 0;
          times2.days++;

          setTimes2({ ...times2 });
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isActive, isPaused, times2, stream]);

  // const wT = `${times.day}:${times.hour}:${times.minute}:${times.second}`;
  // console.log(times, wT);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
    // setIsActiveInterval(true);
    takeScreenShot();
    interval = setInterval(() => {
      timeHandle();
      tempData = "false";
    }, 10000);

    setIsActiveInterval(!isActiveInterval);
    // captureScreen();

    // interval2 = setInterval(captureScreen, 10000);
  };

  const timeHandle = () => {
    let axios = require("axios");
    let FormData = require("form-data");
    let data = new FormData();
    if (tempData.length === 0) {
      const date1 = new Date();
      let Localtime =
        date1.getHours() + ":" + date1.getMinutes() + ":" + date1.getSeconds();
      console.log("Localtime", Localtime);
      data.append("poster", user.sopnoid);
      data.append("ser_refer", location.state.serviceID);
      data.append("maintas", trackerId);
      data.append("room_id", location.state.room);
      data.append("date", Today);
      data.append("heada", "confirmation");
      data.append("startTime", Localtime);
      data.append("endTime", "0");
      data.append("state", "1");
      data.append("button_state", true);
      data.append("work_time", lastTime);
      // tempData = false;
      // setTempData(false);
      let config1 = {
        method: "post",
        url: `${user.master_url}/profile/login/api/utask_record_new.php`,
        data: data,
      };

      axios(config1)
        .then(function (response) {
          console.log(response.data);
          // setTaskDatas(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
    if (tempData.length > 0) {
      const date2 = new Date();
      let Localtime1 =
        date2.getHours() + ":" + date2.getMinutes() + ":" + date2.getSeconds();
      // console.log(wT);
      data.append("poster", user.sopnoid);
      data.append("ser_refer", location.state.serviceID);
      data.append("maintas", trackerId);
      data.append("room_id", location.state.room);
      data.append("date", Today);
      data.append("heada", "confirmation");
      data.append("startTime", "0");
      data.append("endTime", Localtime1);
      data.append("state", "2");
      data.append("button_state", false);
      data.append(
        "work_time",
        `${times.day}:${times.hour}:${times.minute}:${times.second}`
      );
      let config1 = {
        method: "post",
        url: `${user.master_url}/profile/login/api/utask_record_new.php`,
        data: data,
      };

      axios(config1)
        .then(function (response) {
          // console.log(response.data);
          // setTaskDatas(response.data);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const handlePauseResume = () => {
    setIsActive(false);
    setIsPaused(!isPaused);
    // setTempData(!tempData);
    tempData = "false";
    timeHandle();
    clearInterval(interval);
    // clearInterval(interval2);
    setIsActiveInterval(!isActiveInterval);
    setStream(false);
    stopCapture();
  };

  useEffect(() => {
    let axios = require("axios");
    let FormData = require("form-data");
    let data = new FormData();
    data.append("SopnoID", user.sopnoid);
    data.append("action", "fetch");
    data.append("task", trackerId);
    data.append("room", location.state.room);

    let config = {
      method: "post",
      url: `${user.master_url}/profile/login/api/utask_details_all.php`,
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setTaskDatas(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [user.master_url, trackerId, user.sopnoid, location.state.room]);

  //get last time

  useEffect(() => {
    let axios = require("axios");
    let FormData = require("form-data");
    let data = new FormData();
    data.append("poster", user.sopnoid);
    data.append("ser_refer", location.state.serviceID);
    data.append("maintas", trackerId);
    data.append("room_id", location.state.room);
    data.append("state", "1");

    let config = {
      method: "post",
      url: `${user.master_url}/profile/login/api/utask_record_last.php
`,
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setLastTime(response.data[0].last_time);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [
    user.master_url,
    trackerId,
    user.sopnoid,
    location.state.room,
    location.state.serviceID,
  ]);

  //get start and last time

  useEffect(() => {
    let axios = require("axios");
    let FormData = require("form-data");
    let data = new FormData();
    data.append("SopnoID", user.sopnoid);
    data.append("action", "fetch");
    data.append("task", trackerId);
    data.append("room", location.state.room);

    let config = {
      method: "post",
      url: `${user.master_url}/profile/login/api/utask_dateline.php
`,
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setStartEndDate(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [user.master_url, trackerId, user.sopnoid, location.state.room, load]);

  return (
    <div>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #ccc",
          p: ".5rem",
        }}
      >
        <Box>
          <Box
            sx={{
              display: "flex",

              justifyContent: {
                xs: "flex-start",
                sm: "flex-start",
                md: "flex-start",
              },
              alignItems: {
                sm: "left",
                md: "center",
                xs: "left",
              },
              flexDirection: {
                xs: "column",
                md: "row",
              },
            }}
          >
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginRight: ".5rem",
              }}
            >
              {taskDatas?.[0]?.t_title}
              {""}
            </span>
            {taskDatas?.[0]?.t_state === "1" && (
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#ff0000",
                }}
              >
                {" "}
                (New)
              </span>
            )}
            {taskDatas?.[0]?.t_state === "2" && (
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#ff0000",
                }}
              >
                {" "}
                (In Progress)
              </span>
            )}
            {taskDatas?.[0]?.t_state === "3" && (
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#ff0000",
                }}
              >
                {" "}
                (Completed)
              </span>
            )}
            {taskDatas?.[0]?.t_state === "4" && (
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#ff0000",
                }}
              >
                {" "}
                (Payment)
              </span>
            )}
          </Box>
          <span
            style={{
              color: "#7F7F7F",
            }}
            title={taskDatas?.[0]?.t_note}
          >
            {taskDatas?.[0]?.t_note.length > 100
              ? taskDatas?.[0]?.t_note.slice(0, 25) + "..."
              : taskDatas?.[0]?.t_note}
          </span>
          <span
            style={{
              color: "#7F7F7F",
              fontSize: ".9rem",
              marginLeft: ".5rem",
            }}
          >
            | {taskDatas?.[0]?.ta_timestamp}
          </span>
          <span
            style={{
              fontSize: ".9rem",
              fontWeight: "bold",
            }}
          >
            {" "}
            | Start Date- {startEndDate?.[0]?.ta_startdate}
          </span>
          <span
            style={{
              fontSize: ".9rem",
              fontWeight: "bold",
            }}
          >
            {" "}
            | Due Date- {startEndDate?.[0]?.ta_enddate}
          </span>
          <span>
            {admin && (
              <Button
                sx={{
                  ml: 0.5,
                }}
                variant="contained"
                size="small"
                color="secondary"
              >
                <StartAndExpire
                  trackerId={trackerId}
                  setLoad={setLoad}
                  load={load}
                />
              </Button>
            )}
          </span>
        </Box>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: {
              xs: "column",
              sm: "column",
              md: "row",
            },
          }}
        >
          {/* digital timer with hours, minutes, seconds */}
          {/* <HiOutlineClock
            style={{
              fontSize: "2rem",
              color: "#ccc",
              marginRight: "1rem",
            }}
          /> */}
          <span>
            {times2.days} Days, {times2.hours} Hours: {times2.minutes} Minute:{" "}
            {times2.seconds} Seconds
          </span>

          {!isActive ? (
            <Button
              variant="contained"
              size="small"
              sx={{
                mx: 1,
                my: {
                  md: 0,
                  sm: 1,
                  xs: 1,
                },
              }}
              onClick={handleStart}
            >
              Start
            </Button>
          ) : (
            <Button
              variant="contained"
              color="error"
              size="small"
              sx={{
                mx: 1,
                my: {
                  md: 0,
                  sm: 1,
                  xs: 1,
                },
              }}
              onClick={handlePauseResume}
            >
              Stop
            </Button>
          )}
          <Button
            variant="contained"
            size="small"
            sx={[
              {
                backgroundColor: "#028979",
                px: 1.5,
                "&:hover": {
                  backgroundColor: "#028979",
                },
                "@media only screen and (max-width: 1024px)": {
                  // fontSize: "0.7rem",
                  p: 1,
                },
              },
            ]}
            onClick={() => {
              navigate("/calender", {
                state: {
                  room: location.state.room,
                  serviceID: location.state.serviceID,
                  taskID: trackerId,
                },
              });
            }}
          >
            Calender
          </Button>
          <Button
            size="small"
            sx={[
              {
                mx: 1,
                backgroundColor: "#E0862E",
                px: 1.5,
                "&:hover": {
                  backgroundColor: "#E0862E",
                },
                "@media only screen and (max-width: 1024px)": {
                  // fontSize: "0.4rem",
                  p: 1,
                },
                "@media screen and (max-width: 898px)": { mt: 1 },
              }, 
            ]}
            onClick={() => {
              navigate("/timesheet", {
                state: {
                  room: location?.state.room,
                  serviceID: location?.state.serviceID,
                  taskID: trackerId,
                  admin: admin,
                },
              });
            }}
            variant="contained"
          >
            TimeSheet
          </Button>
          <Button
            size="small"
            sx={[
              {
                mx: 1,
                backgroundColor: "#E0862E",
                "&:hover": {
                  backgroundColor: "#E0862E",
                },
                "@media only screen and (max-width: 1024px)": {
                  // fontSize: "0.7rem",
                  p: 1,
                },
                "@media screen and (max-width: 898px)": { mt: 1 },
              },
            ]}
            onClick={() => {
              navigate(`/trackerGroupVideo/${trackerId}`, { 
                state: {
                  room: location?.state.room,
                  serviceID: location?.state.serviceID,
                  taskID: trackerId,
                  admin: admin,
                },
              });
            }}
            variant="contained"
          >
            Video
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default React.memo(TrackerNav);
