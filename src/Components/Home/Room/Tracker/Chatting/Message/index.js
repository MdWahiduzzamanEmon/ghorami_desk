import React from "react";
import "./Message.css";
import { Avatar, Box } from "@mui/material";
import { deepOrange } from "@material-ui/core/colors";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { MdReplyAll } from "react-icons/md";
import parse from "html-react-parser";
// import Message from "./../../../../Message/Message";

const useStyles = makeStyles((theme) =>
  createStyles({
    messageRow: {
      display: "flex",
    },
    messageBlue: {
      marginLeft: "20px",
      marginBottom: "10px",
      padding: "9px",
      backgroundColor: "#A8DDFD",
      width: "fit-content",
      wordBreak: "break-word",
      //height: "50px",
      // overflow: "hidden",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #97C6E3",
      borderRadius: "10px",
    },

    messageContent: {
      padding: 0,
      margin: 0,
      wordBreak: "break-word",
    },
    orange: {
      color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    avatarNothing: {
      color: "transparent",
      backgroundColor: "transparent",
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    displayNameLeft: {
      marginLeft: "20px",
      // color: "#97ACB7",
      color: "#000",
    },
    displayNameRight: {
      marginRight: "20px",
      display: "flex",
      justifyContent: "flex-start",
      flexDirection: "row-reverse",
      textAlign: "right",
      alignItems: "center",
      // color: "#97ACB7",
      color: "#000",
    },
  })
);

function Message(props) {
  const { message, user, handleReply, messages } = props;
  const classes = useStyles();
  // const [check, setCheck] = React.useState([]);
  // console.log(message);
  // console.log(messages);

  // useEffect(() => {
  //   const checkMessageRefOrTag = messages?.filter(
  //     (msg) => msg?.cm_rep_tag === message?.cm_refer
  //   );
  //   console.log(checkMessageRefOrTag);
  //   setCheck([...checkMessageRefOrTag]);
  // }, [message, messages]);


   let text = message?.cm_details;
   let characterCount = 0;
   characterCount = text?.split("\n").length - 1;
    console.log(message);
   //  console.log("data loop");
   for (let i = 0; i < characterCount; i++) {
     //  console.log("ch count" + characterCount);
     text = text.replace("\n", "<br>");
   }
   //  console.log("update string" + text);
   //  console.log(text);
   message["cm_details"] = text;

  return (
    // make chat design right left conversation
    <Box id="scroll-bottom">
      {message?.poster === user?.sopnoid ? (
        // for right side message
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",

              my: 1,
            }}
          >
            <span
              style={{
                marginRight: "10px",
                marginTop: "80px",
                transform: "rotate(180deg)",
                cursor: "pointer",
              }}
              onClick={() => {
                handleReply?.(message);
              }}
            >
              <MdReplyAll />
            </span>
            <Box>
              <div className={classes.displayNameRight}>
                <Avatar
                  alt="Remy Sharp"
                  src={message?.cm_pic}
                  sx={{ width: 34, height: 34, marginLeft: "10px", mb: 1 }}
                />
                {message?.poster_name}
              </div>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              >
                {/* {messages.map((msg) => msg.cm_refer === message.cm_rep_tag)} */}
                {messages
                  .filter((msg) => msg.cm_refer === message.cm_rep_tag)
                  ?.map((msg, i) => {
                    return (
                      <Box
                        key={i}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "flex-end",
                          my: 1,
                          backgroundColor: "#A8A8A8",
                          padding: "8px",
                          width: "fit-content",
                          wordBreak: "break-word",
                          borderRadius: "10px",
                        }}
                      >
                        <Box className={classes.messageContent}>
                          {/* {parse(msg?.cm_details)} */}
                          {parse(`${msg?.cm_details}`)}
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#fff",
                              marginLeft: "10px",
                              display: "block",
                            }}
                          >
                            Message from {msg?.poster_name}
                          </span>
                          <span
                            style={{
                              fontSize: "10px",
                              color: "#fff",
                              marginLeft: "10px",
                              display: "block",
                            }}
                          >
                            {msg?.ch_time}
                          </span>
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
              <Box
                sx={{
                  width: "fit-content",
                  wordBreak: "break-word",
                  padding: "8px",
                  font: "400 .9em 'Open Sans', sans-serif",
                  backgroundColor: "#f8e896",
                  border: "1px solid #dfd087",
                  borderRadius: "10px",
                }}
              >
                <p>{parse(message?.cm_details)}</p>
                <span
                  style={{
                    fontSize: "10px",
                    textAlign: "right",
                  }}
                >
                  {message?.ch_time}
                </span>
              </Box>
            </Box>
          </Box>
        </>
      ) : (
        //empty object check
        <Box className={classes.messageRow}>
          <Avatar
            alt=""
            className={classes.orange}
            src={message?.cm_pic}
            sx={{ width: 24, height: 24 }}
          ></Avatar>
          <div>
            <div className={classes.displayNameLeft}>
              {message?.poster_name}
            </div>
            {messages
              .filter((msg) => msg?.cm_refer === message?.cm_rep_tag)
              ?.map((msg, i) => {
                return (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                      my: 1,
                      backgroundColor: "#A8A8A8",
                      padding: "8px",
                      width: "fit-content",
                      wordBreak: "break-word",
                      borderRadius: "10px",
                    }}
                  >
                    <Box className={classes.messageContent}>
                      {parse(`${msg?.cm_details}`)}
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#fff",
                          marginLeft: "10px",
                          display: "block",
                        }}
                      >
                        Message from {msg?.poster_name}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#fff",
                          marginLeft: "10px",
                          display: "block",
                        }}
                      >
                        {msg?.ch_time}
                      </span>
                    </Box>
                  </Box>
                );
              })}
            <Box
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <div className={classes.messageBlue}>
                <div>
                  <p className={classes.messageContent}>
                    {parse(`${message.cm_details}`)}
                  </p>
                  <p
                    style={{
                      fontSize: "10px",
                      textAlign: "right",
                    }}
                  >
                    {message?.ch_time}
                  </p>
                </div>
              </div>
              <span
                style={{
                  marginLeft: "10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleReply?.(message);
                }}
              >
                <MdReplyAll />
              </span>
            </Box>
          </div>
        </Box>
      )}
    </Box>
  );
}

export default React.memo(Message);
