import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import AllRoom from "../Home/Room/AllRoom/AllRoom.js";
import { BsFillArrowUpCircleFill } from "react-icons/bs";
import Register from "./../Authentication/Register/Register";
import PrivateRoute from "../PrivateRoute/PrivateRoute.js";
import TrackerGroupVideo from "../Home/Room/Tracker/TrackerGroupVideo/TrackerGroupVideo.js";
const Home = React.lazy(() => import("../Home/Home.js"));
const Ganttt = React.lazy(() => import("../Home/Gantt/Gantt.js"));
const Room = React.lazy(() => import("../Home/Room/Room.js"));
const Message = React.lazy(() => import("../Home/Message/Message.js"));
const TimeSheet = React.lazy(() => import("../Home/TimeSheet/TimeSheet.js"));
const Setting = React.lazy(() => import("../Home/Settings/Setting.js"));
const States = React.lazy(() => import("../Home/States/States.js"));
const Dashboard = React.lazy(() => import("../Home/Dashboard/Dashboard.js"));
const Login = React.lazy(() => import("./../Authentication/Login/Login"));
const Tracker = React.lazy(() => import("./../Home/Room/Tracker/Tracker"));
const Error = React.lazy(() => import("../Error/Error"));
const Calender = React.lazy(() =>
  import("../Home/Room/Tracker/Calender/Calender.js")
);
const Notifications = React.lazy(() =>
  import("../Home/Notifications/Notifications.js")
);

const Routing = () => {
  //scroll to top window size
  useEffect(() => {
    const topButton = document.getElementById("topButton");
    window.onscroll = function () {
      if (window.pageYOffset > 100) {
        topButton.style.display = "block";
        topButton.style.position = "fixed";
        topButton.style.right = 0;
        topButton.style.bottom = 0;
        topButton.style.zIndex = "1000";
      } else {
        topButton.style.display = "none";
      }
    };
    topButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        left: 100,
        behavior: "smooth",
      });
    });
  }, []);
  return (
    <>
      <Routes>
        <Route path="*" element={<Error />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/gantt" element={<Ganttt />} />
          <Route path="/room" element={<AllRoom />} />
          <Route path="/room/:roomId" element={<Room />} />
          <Route path="/message" element={<Message />} />
          <Route path="/timesheet" element={<TimeSheet />} />
          <Route path="/settings" element={<Setting />} />
          <Route path="/states" element={<States />} />
          <Route path="/tracker/:trackerId" element={<Tracker />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/trackerGroupVideo/:roomID" element={<TrackerGroupVideo />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      <div>
        <button
          id="topButton"
          className="btn m-2 fs-2 bg-white"
          style={{
            display: "none",
            color: "#1BB096",
            zIndex: "999",
          }}
        >
          <BsFillArrowUpCircleFill style={{
            
          }} />
        </button>
      </div>
    </>
  );
};

export default Routing;
