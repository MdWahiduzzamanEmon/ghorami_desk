import * as React from "react";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
// import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineDot from "@mui/lab/TimelineDot";
import Typography from "@mui/material/Typography";
import { MdDateRange, MdAccessTime } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Box } from "@mui/material";

// for table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
// import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import ImageListModal from "./ImageListModal/ImageListModal";

function Time({
  assignerData,
  selectedAssigner,
  setComponentChng,
  componentChng,
}) {
  // console.log(componentChng);
  const [detailsData, setDetailsData] = React.useState([]);
  const [matchingDate, setMatchingDate] = React.useState("");
  const [clickStartTimeImage, setClickStartTimeImage] = React.useState([]);
  // for modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setClickStartTimeImage([]);
  };

  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));

  // console.log(location.state);
  // distinct assignerData array
  let unique = [];
  let distinct = [];
  for (let i = 0; i < assignerData.reverse().length; i++) {
    if (!unique[assignerData[i].date_w]) {
      distinct.push(assignerData[i]);
      unique[assignerData[i].date_w] = true;
    }
  }
  // console.log(distinct);
  // const toggleContent = ;
  const handleDateClick = (date, ti_refer) => {
    // console.log(date);
    const day = date.split("-")[0];
    const month = date.split("-")[1];
    const year = date.split("-")[2];
    // console.log(day,month,year);
    const dateMatching = distinct.filter((item) => item?.date_w === date)[0]
      ?.date_w;
    setMatchingDate(dateMatching);

    autoData(ti_refer, day, month, year);
  };

  const autoData = (ti_refer, day, month, year) => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state.room);
    formData.append("task", location.state.taskID);
    formData.append("day", day);
    formData.append("month", month);
    formData.append("year", year);
    formData.append("ti_refer", ti_refer);
    formData.append("assign_id", selectedAssigner);
    formData.append("condition", "1");

    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_timesheet_details.php
`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setDetailsData(res.data);
      });
  };


  const [loading, setLoading] = React.useState(true);
  const handleOneClickStart = (date, startTime) => {
    const day1 = date.split("-")[0];
    const month1 = date.split("-")[1];
    const year1 = date.split("-")[2];
    const hour1 = startTime.split(":")[0];
    const formData = new FormData();
    formData.append("SopnoID", selectedAssigner);
    formData.append("room", location.state.room);
    formData.append("task", location.state.taskID);
    formData.append("day", day1);
    formData.append("month", month1);
    formData.append("year", year1);
    formData.append("time", hour1);
    formData.append("action", "fetch");
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_screen_all.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setClickStartTimeImage(res.data);
        setLoading(false);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: {
          xs: "column",
          md: "row",
        },
        // alignItems: "center",
        mt: "2rem",
        height: distinct?.length > 6 ? " 80vh" : "auto",
        overflowY: distinct?.length > 6 ? "scroll" : "auto",
      }}
    >
      <Box>
        {" "}
        {distinct.length <= 0 && (
          <Box>
            <Typography
              variant="subtitle"
              gutterBottom
              sx={{
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              No Data
            </Typography>
          </Box>
        )}
        {distinct.length > 0 &&
          distinct?.map((item, index) => (
            <Timeline
              position="left"
              key={index}
              sx={
                {
                  // width: "10px",
                }
              }
            >
              <TimelineItem>
                <TimelineSeparator>
                  <TimelineConnector />
                  <TimelineDot>
                    <img
                      src={item?.cm_pic}
                      alt="avatar"
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                  </TimelineDot>
                  <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent
                  sx={{
                    py: "12px",
                    px: 2,
                    color: item?.date_w === matchingDate ? "#ff0000" : "#000",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    handleDateClick(item?.date_w, item?.ti_refer);
                    setComponentChng(true);
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    component="span"
                    sx={{
                      fontWeight: "bold",
                    }}
                  >
                    <MdDateRange
                      style={{
                        fontSize: "20px",
                      }}
                    />{" "}
                    {item?.date_w}
                  </Typography>
                  <Typography>
                    <MdAccessTime />{" "}
                    <Typography
                      variant="subtitle2"
                      component="span"
                      sx={{
                        fontWeight: "bold",
                      }}
                    >
                      {item?.total_work}
                    </Typography>{" "}
                  </Typography>
                </TimelineContent>
              </TimelineItem>
            </Timeline>
          ))}
      </Box>
      <Box
        // id="toggleContent"
        sx={{
          p: 2,
          width: {
            xs: "90%",
            md: "50%",
          },
          display: componentChng ? "block" : "none",
          // m: {
          //   xs: "0 auto",
          // },
          height: detailsData.length > 6 ? " 80vh" : "auto",
          overflowY: detailsData.length > 6 ? "scroll" : "auto",
        }}
        variant="outlined"
      >
        <TableContainer
          sx={[
            {
              "@media screen and (max-width: 768px)": {
                width: "230px",
                // margin: "0 auto",
              },
              width: "100%",
            },
          ]}
        >
          <Table size="small" aria-label="a dense table">
            <TableBody>
              {detailsData?.map((row, i) => (
                <TableRow key={i}>
                  <TableCell
                    onClick={() => {
                      handleOneClickStart(row.date, row.start);
                      handleOpen();
                    }}
                    sx={{
                      backgroundColor: "#ff0000",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    {row.start}
                  </TableCell>
                  <ImageListModal
                    open={open}
                    handleClose={handleClose}
                    clickStartTimeImage={clickStartTimeImage}
                    setClickStartTimeImage={setClickStartTimeImage}
                    loading={loading}
                    setLoading={setLoading}
                  />

                  <TableCell
                    sx={{
                      backgroundColor: "#FF9800",
                      color: "#fff",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      handleOneClickStart(row.date, row.start);
                      handleOpen();
                    }}
                  >
                    {row.work}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

export default React.memo(Time);