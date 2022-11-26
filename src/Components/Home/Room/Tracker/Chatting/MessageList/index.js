import React, { useEffect, useState } from "react";
import Message from "../Message";
import CircularLoaderEditable from "react-loader-progressbar";
import "./MessageList.css";
import { Box, TextField, Button } from "@mui/material";
// import ReactScrollToBottom from "react-scroll-to-bottom";
import { useLocation, useParams } from "react-router-dom";
import ScrollableFeed from "react-scrollable-feed";
import { FiRefreshCcw } from "react-icons/fi";
import { GiCancel } from "react-icons/gi";
import cmntBack from "../../../../../Vendors/Dashboard-img/message_back.jpg";
import useAuth from "../../../../../../Hooks/useAuth";

function MessageList() {
  const [messages, setMessages] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [loader, setLoader] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [msgTagRef, setMsgTagRef] = useState({});
  const { trackerId } = useParams();
  const location = useLocation();
  const { pageRefresh, setPageRefresh, socket } = useAuth();
  const [replayText, setReplayText] = React.useState("");
  // console.log(replayText.length);
  const [searchValue, setSearchValue] = React.useState("");
  const [socketId, setSocketId] = React.useState("");

  
  //socket implementation
  useEffect(() => {
    socket.on("connect", () => {
      // alert("connected successfully with socket");
      setSocketId(socket.id);
      // console.log("connected successfully with socket", socket.id);
    });

    socket.emit("join", trackerId);
    socket.on("new_comm", (data) => {
      // console.log(data);
      const perseData = JSON.parse(data);
      // console.log(perseData);
      setMessages([...messages, perseData]);
    });

    return () => {
      socket.on("disconnect");
      socket.off();
    };
  }, [messages, socket, trackerId]);

  useEffect(() => {
    let axios = require("axios");
    let FormData = require("form-data");
    let data = new FormData();
    data.append("SopnoID", user?.sopnoid);
    data.append("action ", "fetch");
    data.append("task", trackerId);
    data.append("room", location.state.room);
    setLoader(true);
    let config = {
      method: "post",
      url: "https://ghorami.com/profile/login/api/utask_com_all.php",
      data: data,
    };
    axios(config)
      .then(function (response) {
        // console.log(response.data);
        setMessages(response.data?.reverse());
        const filterData = response.data?.filter((item) => {
          return item?.cm_details
            ?.toLowerCase()
            ?.includes(searchValue.toLowerCase());
        });
        setMessages(filterData);

        setLoader(false);
        // setPageRefresh(!pageRefresh);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [
    user?.master_url,
    user?.sopnoid,
    trackerId,
    location.state?.room,
    pageRefresh,
    searchValue,
  ]);
  // console.log(replayText.length);
  const handleSubmit = (e) => {
    e.preventDefault();

    if (messageText === "") {
      return;
    }
    if (!socketId) {
      const formData = new FormData();
      formData.append("t_comment", messageText);
      formData.append("poster", user?.sopnoid);
      formData.append("ser_refer", location.state?.serviceID);
      formData.append("room_id", location.state?.room);
      formData.append("maintas", trackerId);
      formData.append("heada", "comment");
      formData.append("mention_list", "");

      if (replayText.length > 0) {
        formData.append("rep_tag", msgTagRef?.cm_refer);
      } else {
        formData.append("rep_tag", "");
      }

      fetch(`${user?.master_url}/profile/login/api/utask_com_new.php`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((res) => {
          // console.log(res);
          setMessages([...messages, res]);
          setPageRefresh(!pageRefresh);
        });
    } else {
      const data = {
        rooma: location.state?.room,
        commenta: messageText,
        sendera: user?.sopnoid,
        maintasa: trackerId,
        senddatea: new Date().toLocaleString(),
        purposea: "comment",
        rep_taga: replayText.length > 0 ? msgTagRef?.cm_refer : "",
        mention_lista: "",
        ser_refera: location.state?.serviceID,
        at_ppic: user?.userpic,
        at_pname: user?.uname,
        heada: replayText.length > 0 ? "reply" : "comment",
        at_reply_ida: replayText.length > 0 ? msgTagRef?.cm_refer : "",
      };

      socket.emit("comment", JSON.stringify(data));
    }
    setReplayText("");
    setMessageText("");
    e.target.reset();
  };
  //for reply
  const handleReply = (message) => {
    // console.log(message.cm_refer);
    const replaySame = messages?.find(
      (msg) => msg?.cm_refer === message?.cm_refer
    );
    setReplayText(replaySame?.cm_details);
    setMsgTagRef(replaySame);
  };

  const renderMessages = () => {
    //reverse array
    return messages?.map((message, index) => {
      return (
        <ScrollableFeed key={index}>
          <Message
            message={message}
            user={user}
            messages={messages}
            handleReply={handleReply}
          />
        </ScrollableFeed>
      );
    });
  };

  React.memo(renderMessages, [messages]);

  return (
    <Box
      sx={{
        border: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
            md: "center",
          },
          justifyContent: {
            xs: "flex-start",
            sm: "space-between",
            md: "space-between",
          },
          flexWrap: "wrap",
          flexDirection: {
            xs: "column",
            sm: "row",
            md: "row",
          },
        }}
      >
        <span
          style={{
            fontSize: "1rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            marginTop: "1rem",
            paddingLeft: "1rem",
          }}
        >
          Comments{" "}
          <span
            style={{
              color: "#ff0000",
            }}
          >
            ({messages?.length})
          </span>
          <Button
            variant="text"
            sx={{
              // mt: 0.5,
              mr: 1,
            }}
            size="small"
            color="warning"
            onClick={() => {
              setReplayText("");
              setMsgTagRef({});
              setPageRefresh(!pageRefresh);
            }}
          >
            <FiRefreshCcw
              style={{
                fontSize: "1.4rem",
                color: "#ff0000",
              }}
            />
          </Button>
        </span>

        <Box
          sx={[
            {
              mr: 1,
              "@media screen and (max-width: 768px)": {
                mb: 0.5,
                ml: 1,
              },
            },
          ]}
        >
          <TextField
            id="outlined-basic"
            variant="outlined"
            type="search"
            size="small"
            label="Search comment..."
            color="warning"
            onChange={(e) => setSearchValue?.(e.target?.value)}
            // value={messageText}
            fullWidth
          />
        </Box>
      </Box>
      <Box
        className="message-list widthList"
        sx={[
          {
            height:
              window.innerHeight >= 500
                ? "calc(100vh - 305px)"
                : "calc(100vh - 100px)",
            backgroundImage: `url(${cmntBack})`,
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
          },
        ]}
      >
        {/* <ReactScrollToBottom> */}

        <ScrollableFeed>
          <Box className="message-list-container" id="scroll-bottom">
            {loader ? (
              <CircularLoaderEditable color="#fff" />
            ) : (
              renderMessages()
            )}
          </Box>
        </ScrollableFeed>
        {/* </ReactScrollToBottom> */}

        <Box>
          {replayText !== "" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "justify",
                flexDirection: "row-reverse",
                backgroundColor: "#E4F6F8",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",

                  color: "gray",
                  backgroundColor: "#F2EEE2",
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  // width: "fit-content",
                  my: 1,
                  mr: 1,
                  wordBreak: "break-all",
                  wordWrap: "break-word",
                }}
              >
                {replayText}
              </Box>
              <span
                style={{
                  cursor: "pointer",
                  marginTop: "0.8rem",
                  marginRight: "0.5rem",
                }}
                onClick={() => {
                  setReplayText("");
                  setMsgTagRef({});
                }}
              >
                <GiCancel />
              </span>
            </Box>
          )}
          {/* button and bottom fixed textField for typing message */}
          <form onSubmit={handleSubmit}>
            <Box
              sx={{
                width: "100%",
                backgroundColor: "white",
                zIndex: 9999,
              }}
              className="widthList2"
            >
              <TextField
                id="outlined-multiline"
                label="Type a comment"
                multiline
                rows="2"
                variant="outlined"
                color="warning"
                sx={{
                  backgroundColor: "#E4F6F8",
                }}
                fullWidth
                onChange={(e) => {
                  setMessageText?.(e.target?.value);
                }}
                InputProps={{
                  endAdornment: (
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <Button
                        {...(messageText?.length > 0
                          ? { disabled: false }
                          : { disabled: true })}
                        variant="contained"
                        color="warning"
                        size="small"
                        type="submit"
                      >
                        Send
                      </Button>
                    </Box>
                  ),
                }}
              />
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
}

export default React.memo(MessageList);
