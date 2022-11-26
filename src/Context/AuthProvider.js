import axios from "axios";
import React, { useCallback, useEffect, useRef } from "react";
// import socketIO from "socket.io-client";
import io from "socket.io-client";
export const AuthContext = React.createContext(null);

// const ENDPOINT = "https://173.212.230.192:8082/";
// // const ENDPOINT = "https://yeapbe.com:3400/";
// let socket;

const AuthProvider = ({ children }) => {
  const [pageRefresh, setPageRefresh] = React.useState(false);
  const [notificationData, setNotificationData] = React.useState([]);
  const [messageNotification, setMessageNotification] = React.useState([]);
  const [messageNotification2, setMessageNotification2] = React.useState([]);
  const socket = useRef();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    socket.current = io.connect("https://yeapbe.com:3450/", {
      transports: ["websocket"],
    });
    socket.current.on("connect", () => {
      console.log("connected");
      // alert(
      //   `
      //   ${socket.current.id} connected
      //   `
      // )
    });
    socket.current.on("disconnect", () => {
      console.log("disconnected");
    });
    // console.log(socket.current);

    return () => {
      socket.current.off('connect');
      socket.current.off('disconnect');
    };

  }
    , []);


  //get all message data
  useEffect(() => {
    if (user?.sopnoid) {
      const formData = new FormData();
      const date = new Date();
      formData.append("SopnoID", user?.sopnoid);
      formData.append("year", date.getFullYear());
      formData.append("month", date.getMonth() + 1);
      formData.append("action", "fetch");
      axios
        .post(
          `${user?.master_url}/profile/login/calender/user_message_all.php`,
          formData
        )
        .then((res) => {
          // console.log(res.data);
          setMessageNotification2(res.data?.[0]?.message_quantity);
        });
    }
  }, [user?.sopnoid, user?.master_url]);

  useEffect(() => {
    if (user?.sopnoid) {
      const formData = new FormData();
      formData.append("SopnoID", user?.sopnoid);
      formData.append("action", "fetch");
      formData.append("sta", "0");
      axios
        .post(
          `${user?.master_url}/profile/login/api/room/noti_ro_req_n.php`,
          formData
        )
        .then((res) => {
          // console.log(res.data);
          setNotificationData(res.data);
        });
    }
  }, [user?.master_url, user?.sopnoid, pageRefresh]);

  //all message notification data
  useEffect(() => {
    if (user?.sopnoid) {
      const formData = new FormData();
      formData.append("SopnoID", user?.sopnoid);
      formData.append("action", "check");

      axios
        .post(`${user?.master_url}/profile/message/message_notif.php`, formData)
        .then((res) => {
          // console.log(res.data);
          setMessageNotification(res.data);
        });
    }
  }, [user?.sopnoid, pageRefresh, user?.master_url]);

  //note all

  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const [noteData, setNoteData] = React.useState([]);
  useEffect(() => {
    if (user?.sopnoid) {
      const formData = new FormData();
      formData.append("SopnoID", user?.sopnoid);
      formData.append("year", year);
      formData.append("month", month);
      formData.append("action", "fetch");
      axios
        .post(
          `${user?.master_url}/profile/login/calender/utask_note_selected.php`,
          formData
        )
        .then((res) => {
          //  console.log(res.data);
          const filterData = res.data?.filter(
            (res) => res?.poster === user?.sopnoid
          );
          setNoteData?.(filterData);
        });
    }
  }, [user?.master_url, user?.sopnoid, pageRefresh, year, month]);

  //get local ip

  const messageStatus = useCallback(() => {
    const ip = localStorage.getItem("ip");
    const formData = new FormData();
    formData.append("SopnoID", user?.sopnoid);
    formData.append("action", "update_time");
    formData.append("user_ip", JSON.parse(ip));
    axios
      .post(
        `${user?.master_url}/profile/login/api/ui_update_userlog.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
      });
  }, [user?.master_url, user?.sopnoid]);

  React.useEffect(() => {
    let interval = "";
    if (user) {
      interval = setInterval(() => {
        messageStatus();
      }, 2000);
      return () => clearInterval(interval);
    } else {
      clearInterval(interval);
    }
  }, [user, messageStatus, pageRefresh]);
  // console.log(socket)

  return (
    <AuthContext.Provider
      value={{
        pageRefresh,
        setPageRefresh,
        notificationData,
        messageNotification,
        noteData,
        setNoteData,
        socket: socket.current,
        messageNotification2,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default React.memo(AuthProvider);
