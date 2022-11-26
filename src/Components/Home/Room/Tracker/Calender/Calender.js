import { Box, Paper, Typography, Fab, Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { GrAttachment } from "react-icons/gr";
import { MdCreate } from "react-icons/md";
import { BsCardChecklist } from "react-icons/bs";
import { AiOutlineComment } from "react-icons/ai";
import { FaRegCheckSquare } from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import NewNoteModal from "./NewNoteModal/NewNoteModal";
import { useLocation } from "react-router-dom";
import axios from "axios";
import NoteShowModal from "./NoteShowModal/NoteShowModal";
import AttachmentShowModal from "./AttachMentDataShowModal/AttachMentDataShowModal";
import CommentDataShowModal from "./CommentDataShowModal/CommentDataShowModal";
import CheckListDataModalShow from "./CheckListDataModalShow/CheckListDataModalShow";
import AssignDataShowModal from "./AssignDataShowModal/AssignDataShowModal";

const Calender = () => {
  useEffect(() => {
    document.title = "Ghorami Desk - Calender";
  }, []);

  //make calender here from scratch
  //   calender code here
  let date = new Date();
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  // let day = date.getDay();
  let today = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  const [monthValue, setMonthValue] = useState(month);

  const [monthName, setMonthName] = useState("");
  const [newMonth, setNewMonth] = useState(month);
  const [newYear, setNewYear] = useState(year);

  let daysInMonth = new Date(newYear, newMonth, 0).getDate();
  const prevMonth = new Date(newYear, newMonth - 1, 0).getDate();

  const firstDayIndex = new Date(newYear, newMonth - 1, 1).getDay();

  const nextDay = new Date(newYear, newMonth, today + 1).getDate();
  const prevDay = firstDayIndex - 1;
  const days = [];
  // console.log(days);

  for (let i = 1; i <= daysInMonth; i++) {
    const string = i.toString();
    if (string.length === 1) {
      days.push(`0${string}`);
    } else {
      days.push(string);
    }
  }
  // console.log(days);
  const prevMonthDays = [];
  for (let i = prevMonth - prevDay; i <= prevMonth; i++) {
    prevMonthDays.push(i);
  }
  // console.log(prevMonthDays);
  const nextMonthDays = [];
  for (let i = 1; i <= nextDay; i++) {
    nextMonthDays.push(i);
  }

  let weekNameArray = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  useEffect(() => {
    if (monthValue < 1) {
      setMonthValue(12);
      setNewYear(newYear - 1);
    }
    if (monthValue > 12) {
      setMonthValue(1);
      setNewYear(newYear + 1);
    }

    switch (monthValue) {
      case 1:
        setMonthName("January");
        setNewMonth(1);
        break;
      case 2:
        setMonthName("February");
        setNewMonth(2);
        break;
      case 3:
        setMonthName("March");
        setNewMonth(3);
        break;
      case 4:
        setMonthName("April");
        setNewMonth(4);
        break;
      case 5:
        setMonthName("May");
        setNewMonth(5);
        break;
      case 6:
        setMonthName("June");
        setNewMonth(6);
        break;
      case 7:
        setMonthName("July");
        setNewMonth(7);
        break;
      case 8:
        setMonthName("August");
        setNewMonth(8);
        break;
      case 9:
        setMonthName("September");
        setNewMonth(9);
        break;
      case 10:
        setMonthName("October");
        setNewMonth(10);
        break;
      case 11:
        setMonthName("November");
        setNewMonth(11);
        break;
      case 12:
        setMonthName("December");
        setNewMonth(12);
        break;
      default:
        break;
    }
  }, [monthValue, newYear]);

  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [attachmentData, setAttachmentData] = useState([]);
  const [noteData, setNoteData] = useState([]);
  const [comment, setComment] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [task, setTask] = useState([]);

  //for attachment
  useEffect(() => {
    let formData = new FormData();
    formData.append("room", location.state.room);
    formData.append("SopnoID", user.sopnoid);
    formData.append("task", location.state.taskID);
    formData.append("month", monthValue);
    formData.append("year", newYear);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_attachment_all.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setAttachmentData(res.data);
      });
  }, [
    monthValue,
    newYear,
    location.state.taskID,
    location.state.room,
    user.sopnoid,
    user.master_url,
  ]);

  const [attachmentValueData, setAttachmentValueData] = useState([]);
  const [AttachmentOpen, setAttachmentOpen] = React.useState(false);
  const handleAttachOpen = () => setAttachmentOpen(true);
  const handleAttachClose = () => setAttachmentOpen(false);
  // attachment data
  const attachmentDay = attachmentData.map((data) => {
    if (data?.ch_time === 0) {
      return 0;
    } else {
      return data.ch_time.split(" ")[0].split("-")[2];
    }
  });
  const handleAttachmentOpen = (day) => {
    const filteredAttachmentData = attachmentData.filter(
      (data) => data.ch_time.split(" ")[0].split("-")[2] === day
    );
    setAttachmentValueData(filteredAttachmentData);
    handleAttachOpen();
  };

  // console.log(attachmentValueData);

  //for note
  useEffect(() => {
    let formData = new FormData();
    formData.append("room", location.state.room);
    formData.append("SopnoID", user.sopnoid);
    formData.append("task", location.state.taskID);
    formData.append("month", monthValue);
    formData.append("year", newYear);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_note_all.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setNoteData(res.data);
      });
  }, [
    monthValue,
    newYear,
    location.state.taskID,
    location.state.room,
    user.sopnoid,
    user.master_url,
  ]);

  // passing note data in modal state
  const [noteValueData, setNoteValueData] = useState([]);
  const [Noteopen, setNoteOpen] = React.useState(false);
  const handleOpenNote = () => setNoteOpen(true);
  // note data
  const noteDay = noteData.map((data) => {
    if (data?.start === 0) {
      return 0;
    } else {
      // return data.start.split(" ")[0].split("-")[2];
      if (data.start.split(" ")[0].split("-")[2].length === 1) {
        return `0${data.start.split(" ")[0].split("-")[2]}`;
      } else {
        return data.start.split(" ")[0].split("-")[2];
      }
    }
  });
  // console.log(noteDay);
  const handleNoteDataOpen = (day) => {
    const filteredNote = noteData.filter((data) => {
      // return data.start.split(" ")[0].split("-")[2] === day;
      if (data.start.split(" ")[0].split("-")[2].length === 1) {
        return `0${data.start.split(" ")[0].split("-")[2]}` === day;
      } else {
        return data.start.split(" ")[0].split("-")[2] === day;
      }
    });
    setNoteValueData(filteredNote);
    handleOpenNote();
  };
  // console.log(noteValueData);

  //for comment

  const [cmntValueData, setCmntValueData] = useState([]);
  const [comntopen, setCmntOpen] = React.useState(false);
  const handleCmntOpen = () => setCmntOpen(true);
  const handleCloseComment = () => setCmntOpen(false);

  useEffect(() => {
    let formData = new FormData();
    formData.append("room", location.state.room);
    formData.append("SopnoID", user.sopnoid);
    formData.append("task", location.state.taskID);
    formData.append("month", monthValue);
    formData.append("year", newYear);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_com_all.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setComment(res.data);
      });
  }, [
    monthValue,
    newYear,
    location.state.taskID,
    location.state.room,
    user.sopnoid,
    user.master_url,
  ]);
  // console.log(monthValue, newYear, location);
  // note data
  const commentDay = comment.map((data) => {
    if (data?.ch_time === 0) {
      return 0;
    } else {
      return data.ch_time.split(" ")[0].split("-")[2];
    }
  });
  const handleCommentOpen = (day) => {
    const filteredComment = comment.filter((data) => {
      return data.ch_time.split(" ")[0].split("-")[2] === day;
    });
    setCmntValueData(filteredComment);
    handleCmntOpen();
  };

  //for checklist
  const [checkValueData, setcheckValueData] = useState([]);
  const [checkOpen, setcheckOpen] = React.useState(false);
  const handlecheckOpen = () => setcheckOpen(true);
  const handleClosecheck = () => setcheckOpen(false);

  useEffect(() => {
    let formData = new FormData();
    formData.append("room", location.state.room);
    formData.append("SopnoID", user.sopnoid);
    formData.append("task", location.state.taskID);
    formData.append("month", monthValue);
    formData.append("year", newYear);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_check_all_w.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setChecklist(res.data);
      });
  }, [
    monthValue,
    newYear,
    location.state.taskID,
    location.state.room,
    user.sopnoid,
    user.master_url,
  ]);

  const checkListDay = checklist.map((data) => {
    if (data?.ch_time === 0) {
      return 0;
    } else {
      return data.ch_time.split(" ")[0].split("-")[2];
    }
  });

  const handleCheckOpen = (day) => {
    const filteredChecklist = checklist.filter((data) => {
      return data.ch_time.split(" ")[0].split("-")[2] === day;
    });
    setcheckValueData(filteredChecklist);
    handlecheckOpen();
  };

  //for task

  const [taskValueData, settaskValueData] = useState([]);
  const [assignOpen, setAssignOpen] = React.useState(false);
  const handleAssignOpen = () => setAssignOpen(true);
  const handleCloseassign = () => setAssignOpen(false);

  useEffect(() => {
    let formData = new FormData();
    formData.append("room", location.state.room);
    formData.append("SopnoID", user.sopnoid);
    formData.append("task", location.state.taskID);
    formData.append("month", monthValue);
    formData.append("year", newYear);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_assign_all.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setTask(res.data);
      });
  }, [
    monthValue,
    newYear,
    location.state.taskID,
    location.state.room,
    user.sopnoid,
    user.master_url,
  ]);

  const taskDay = task?.map((data) => {
    // return data?.ch_time?.split(" ")[0].split("-")[2];
    if (data?.ch_time === 0) {
      return 0;
    } else {
      return data.ch_time.split(" ")[0].split("-")[2];
    }
  });

  const handleTaskOpen = (day) => {
    const filteredTask = task.filter((data) => {
      return data.ch_time.split(" ")[0].split("-")[2] === day;
    });
    settaskValueData(filteredTask);
    handleAssignOpen();
  };

  React.memo(() => {
    handlecheckOpen();
    handleAssignOpen();
    handleCommentOpen();
    handleTaskOpen();
  });

  return (
    <Paper
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "1rem",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            pb: "1rem",
          }}
        >
          <Typography variant="h4" gutterBottom component="div">
            <span>{monthName}</span>
            <span> {newYear}</span>
          </Typography>
          <div>
            <Fab
              color="warning"
              onClick={() => {
                setMonthValue(monthValue - 1);
              }}
              sx={{
                mr: 1,
              }}
            >
              <GrFormPrevious
                style={{
                  color: "#ffffff",
                  fontSize: "1.5rem",
                }}
              />
            </Fab>

            <Fab
              color="warning"
              onClick={() => {
                setMonthValue(monthValue + 1);
              }}
            >
              <GrFormNext
                style={{
                  fontSize: "1.5rem",
                  color: "#fff",
                }}
              />
            </Fab>
          </div>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gridGap: "1rem",

            width: "100%",
            alignItems: "center",

            pb: "1rem",
          }}
        >
          {weekNameArray?.map((item, index) => {
            return (
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                key={index}
                sx={{
                  color: "#000",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  textShadow: "0px 0px 5px  #ccc",
                  alignSelf: "center",
                  justifySelf: "center",
                }}
              >
                {item}
              </Typography>
            );
          })}
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            gridGap: "1rem",
            justifyContent: "center",
            alignItems: "center",
            pb: "1rem",
          }}
        >
          {prevMonthDays?.map((item, index) => {
            return (
              <Paper
                key={index}
                sx={[
                  {
                    color: "#ccc",
                    alignSelf: "center",
                    justifySelf: "center",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "end",
                    p: "1rem",
                  },
                ]}
              >
                <Box
                  sx={[
                    {
                      "&:hover": {
                        backgroundColor: "#ff0000",
                        borderRadius: "50%",
                        p: 0.5,
                        color: "#fff",
                        transition: "all .3s linear",
                      },
                      height: "40px",
                      width: "40px",
                      textAlign: "center",
                      // color: "#1A2954",
                      fontSize: "1.5rem",
                      mb: 1,

                      fontWeight: "bold",
                    },
                  ]}
                >
                  {item}
                </Box>
              </Paper>
            );
          })}
          {/* attachmentDay array and days array value matching */}

          {days?.map((item, index) => {
            // console.log(item);

            return (
              <Paper
                variant="outlined"
                key={index}
                sx={{
                  alignSelf: "center",
                  justifySelf: "center",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  p: "1rem",
                }}
              >
                <Box
                  sx={[
                    {
                      color: "#1A2954",
                      ...(item.includes(today) &&
                        monthValue === month && {
                          backgroundColor: "#ff0000",
                          fontWeight: "bold",
                          color: "#fff",
                          borderRadius: "50%",
                        }),
                      "&:hover": {
                        backgroundColor: "#ff0000",
                        borderRadius: "50%",
                        p: 0.5,
                        color: "#fff",
                        transition: "all .3s linear",
                      },
                      height: "40px",
                      width: "40px",
                      textAlign: "center",
                      alignSelf: "end",
                      fontSize: "1.5rem",
                      mb: 1,

                      fontWeight: "bold",
                    },
                  ]}
                >
                  {item}
                </Box>
                <Box>
                  <Grid
                    container
                    spacing={1}
                    sx={{
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    <Grid
                      item
                      xs={4}
                      sx={[
                        {
                          "&:hover": {
                            color: "#ff0000",
                          },
                        },
                      ]}
                    >
                      <MdCreate
                        onClick={() => {
                          handleOpen();
                        }}
                      />
                      <NewNoteModal open={open} handleClose={handleClose} />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={[
                        {
                          color: noteDay?.includes(item)
                            ? "#D72E4A"
                            : "#1A2954",
                          "&:hover": {
                            color: "#ff0000",
                          },
                        },
                      ]}
                    >
                      <BsCardChecklist
                        onClick={() => {
                          handleNoteDataOpen(item);
                        }}
                      />{" "}
                      {
                        noteDay?.filter((items) => {
                          return items === item;
                        }).length
                      }
                      <NoteShowModal
                        Noteopen={Noteopen}
                        setNoteOpen={setNoteOpen}
                        noteValueData={noteValueData}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={[
                        {
                          color: attachmentDay?.includes(item)
                            ? "#BE24A6"
                            : "#1A2954",
                          "&:hover": {
                            color: "#ff0000",
                          },
                        },
                      ]}
                    >
                      <GrAttachment
                        onClick={() => {
                          handleAttachmentOpen(item);
                        }}
                      />{" "}
                      {/* show data length of attachment array here for each day here in the grid item here  */}
                      {
                        attachmentDay?.filter((items) => {
                          return items === item;
                        }).length
                      }
                      <AttachmentShowModal
                        AttachmentOpen={AttachmentOpen}
                        attachmentValueData={attachmentValueData}
                        handleAttachClose={handleAttachClose}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={[
                        {
                          color: commentDay.includes(item)
                            ? "#43A047"
                            : "#1A2954",
                          "&:hover": {
                            color: "#ff0000",
                          },
                        },
                      ]}
                    >
                      <AiOutlineComment
                        onClick={() => {
                          handleCommentOpen(item);
                        }}
                      />{" "}
                      {
                        commentDay?.filter((items) => {
                          return items === item;
                        }).length
                      }
                      <CommentDataShowModal
                        comntopen={comntopen}
                        handleCloseComment={handleCloseComment}
                        cmntValueData={cmntValueData}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={[
                        {
                          color: checkListDay.includes(item)
                            ? "#FF7B41"
                            : "#1A2954",
                          "&:hover": {
                            color: "#ff0000",
                          },
                        },
                      ]}
                    >
                      <FaRegCheckSquare
                        onClick={() => {
                          handleCheckOpen(item);
                        }}
                      />{" "}
                      {
                        checkListDay?.filter((items) => {
                          return items === item;
                        }).length
                      }
                      <CheckListDataModalShow
                        checkOpen={checkOpen}
                        handleClosecheck={handleClosecheck}
                        checkValueData={checkValueData}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={4}
                      sx={[
                        {
                          color: taskDay.includes(item) ? "#FFA633" : "#1A2954",
                          "&:hover": {
                            color: "#ff0000",
                          },
                        },
                      ]}
                    >
                      <RiTeamLine
                        onClick={() => {
                          handleTaskOpen(item);
                        }}
                      />{" "}
                      {
                        taskDay?.filter((items) => {
                          return items === item;
                        }).length
                      }
                      <AssignDataShowModal
                        assignOpen={assignOpen}
                        handleCloseassign={handleCloseassign}
                        assignValueData={taskValueData}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            );
          })}
          {nextMonthDays.slice(0, 4).map((item, index) => {
            return (
              <Paper
                key={index}
                sx={{
                  color: "#ccc",
                  alignSelf: "center",
                  justifySelf: "center",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-start",
                  alignItems: "end",
                  p: "1rem",
                }}
              >
                <Box
                  sx={[
                    {
                      "&:hover": {
                        backgroundColor: "#ff0000",
                        borderRadius: "50%",
                        p: 0.5,
                        color: "#fff",
                        transition: "all .3s linear",
                      },
                      height: "40px",
                      width: "40px",
                      textAlign: "center",
                      // color: "#1A2954",
                      fontSize: "1.5rem",
                      mb: 1,

                      fontWeight: "bold",
                    },
                  ]}
                >
                  {item}
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Box>
    </Paper>
  );
};

export default React.memo(Calender);
