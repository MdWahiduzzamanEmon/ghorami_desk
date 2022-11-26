import React, { useEffect } from "react";

import { FrappeGantt } from "../Dashboard/index";
import axios from "axios";
import { Button, Box, Card } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
// import { setISODay } from "date-fns";

const Ganttt = ({ style }) => {
  useEffect(() => {
    document.title = "Ghorami Desk - Gantt Chart";
  }, []);

  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = React.useState([]);
  const [viewMode, setViewMode] = React.useState("Week");
  const [loader, setLoader] = React.useState(true);

  useEffect(() => {
    setLoader(true);
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_gantt_time.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        setTasks(res.data);
        setLoader(false);
      });
  }, [user.master_url, user.sopnoid]);

  const NewValueTask = tasks?.map((x) => {
    return {
      id: x.t_taskid,
      name: x.t_title,
      //make date reverse
      start: x.ta_startdate,
      end: x.ta_enddate,
      progress: x.t_progress,
      dependencies: "",
    };
  });


  // console.log(NewValueTask);

  return (
    <Card
      sx={{
        border: "none",
        // width:
        //   window.innerWidth > 600
        //     ? "calc(100vw - 140px)"
        //     : "calc(100vw - 20px)",
        // height: window.innerWidth > 600 ? "calc(100vh-140px)" : "calc(100vh - 20px)",
        height: "100%",
        ...style,
      }}
      variant="outlined"
    >
      <Box
        sx={{
          position: window.innerHeight > 600 ? "sticky" : "fixed",
          top: 0,
          zIndex: 1,
        }}
      >
        <Button
          variant="contained"
          sx={[
            {
              m: 1,
              backgroundColor: viewMode === "Day" ? "#E0862E" : "#068F84",
              "&:hover": {
                backgroundColor: "#E0862E",
              },
            },
          ]}
          onClick={(e) => {
            setViewMode("Day");
          }}
        >
          Day
        </Button>
        <Button
          variant="contained"
          sx={[
            {
              m: 1,
              backgroundColor: viewMode === "Week" ? "#E0862E" : "#068F84",
              "&:hover": {
                backgroundColor: "#E0862E",
              },
            },
          ]}
          onClick={(e) => {
            setViewMode("Week");
          }}
        >
          Week
        </Button>
        <Button
          variant="contained"
          sx={[
            {
              m: 1,
              backgroundColor: viewMode === "Month" ? "#E0862E" : "#068F84",
              "&:hover": {
                backgroundColor: "#E0862E",
              },
            },
          ]}
          onClick={(e) => {
            setViewMode("Month");
          }}
        >
          Month
        </Button>
      </Box>
      {loader ? (
        <Box
          sx={{
            my: 5,
          }}
        >
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      ) : (
        NewValueTask.length > 0 && (
          <>
            <FrappeGantt
              tasks={NewValueTask}
              viewMode={viewMode}
              // onClick={(task) => {
              //   // console.log(task);
              // }}
              // onDateChange={(task, start, end) => console.log(task, start, end)}
              // onProgressChange={(task, progress) => console.log(task, progress)}
              // onTasksChange={(tasks) => console.log(tasks)}
              // onViewModeChange={(viewMode) => console.log(viewMode)}
            />
          </>
        )
      )}
    </Card>
  );
};

export default React.memo(Ganttt);
