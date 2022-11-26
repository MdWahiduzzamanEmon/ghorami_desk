import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Typography, Paper, Card } from "@mui/material";
import { VictoryPie } from "victory";
import room from "../../Vendors/Dashboard-img/room.png";
import task from "../../Vendors/Dashboard-img/tasks.png";
import invite from "../../Vendors/Dashboard-img/invitation.png";
import message from "../../Vendors/Dashboard-img/message.png";
import workingHour from "../../Vendors/Dashboard-img/New-Icon_Efficient.png";
import Ganttt from "../Gantt/Gantt";
import TeamMembers from "./TeamMembers/TeamMembers";
import DashBoardAlert from "./DashBoardAlert/DashBoardAlert";
import useAuth from "../../../Hooks/useAuth";
import axios from "axios";
import Classes from "./DashBoard.module.css";

const Dashboard = () => {
  useEffect(() => {
    document.title = "Ghorami Desk -Dashboard";
  }, []);

  const [workingH, setWorkingH] = React.useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  // get data or object from context
  const { messageNotification2, noteData, pageRefresh, setPageRefresh } =
    useAuth();
  // console.log(messageNotification);
  const navigate = useNavigate();

  useEffect(() => {
    setPageRefresh(!pageRefresh);
  }, []);

  // console.log(parseFloat(`${user.used_quota?.split(" ")[0]}`));
  //get working hour data
  useEffect(() => {
    const cancelToken = axios.CancelToken.source();
    const formData = new FormData();
    formData.append("SopnoID", user?.sopnoid);
    axios
      .post(
        `${user.master_url}/profile/login/calender/utask_totalworkingtime.php`,
        formData,
        {
          cancelToken: cancelToken.token,
        }
      )
      .then((res) => {
        // console.log(res.data);
        setWorkingH(res?.data);
      }).catch((err) => {
        if (axios.isCancel(err)) {
          console.log("cancelled");
        }
      });

    return () => {
      cancelToken.cancel();
    }
  }, [user?.master_url, user?.sopnoid]);

  React.memo(Dashboard, (prevProps, nextProps) => {
    return prevProps.user === nextProps.user;
  });

  return (
    <Grid container spacing={3}>
      {/* //summery section  */}
      <Grid item xs={12} lg={8} md={12}>
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            sx={{
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            Summary
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {/* total invites */}
          <Grid item xs={12} sm={6} lg={3} md={3}>
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
              className={`${Classes.hover_style}`}
              onClick={() => navigate("/notifications")}
            >
              <Box
                sx={[
                  {
                    width: "112px",
                    // height: "150px",
                    textAlign: "center",
                    margin: "auto",
                    "@media (max-width: 768px)": {
                      width: "100px",
                    },
                  },
                ]}
              >
                <img src={invite} alt="invite" className="img-fluid" />
              </Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
              >
                Total Invites: {user?.new_invite}
              </Typography>
            </Paper>
          </Grid>
          {/* total rooms */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              variant="outlined"
              sx={{
                p: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
              className={`${Classes.hover_style}`}
              onClick={() => navigate("/room")}
            >
              <Box
                sx={[
                  {
                    width: "112px",
                    // height: "150px",
                    textAlign: "center",
                    margin: "auto",
                  },
                ]}
              >
                <img src={room} alt="room" className="img-fluid" />
              </Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
              >
                Total Rooms: {user.total_room}
              </Typography>
            </Paper>
          </Grid>
          {/* total task  */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              className={`${Classes.hover_style}`}
              variant="outlined"
              sx={{
                p: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/gantt")}
            >
              <Box
                sx={[
                  {
                    width: "112px",
                    // height: "150px",
                    textAlign: "center",
                    margin: "auto",
                  },
                ]}
              >
                <img src={task} alt="task" className="img-fluid" />
              </Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
              >
                Total Tasks: {user?.total_task}
              </Typography>
            </Paper>
          </Grid>
          {/* total message  */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              variant="outlined"
              className={`${Classes.hover_style}`}
              sx={{
                p: 1,
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => navigate("/message")}
            >
              <Box
                sx={[
                  {
                    width: "112px",
                    // height: "150px",
                    textAlign: "center",
                    margin: "auto",
                  },
                ]}
              >
                <img src={message} alt="task" className="img-fluid" />
              </Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
              >
                Total Message: {messageNotification2}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      {/* notes section  */}
      <Grid item xs={12} lg={4} md={12}>
        <Box>
          <Typography
            variant="h5"
            gutterBottom
            component="div"
            sx={{
              fontWeight: "bold",
              color: "text.secondary",
            }}
          >
            Notes
          </Typography>
        </Box>
        <DashBoardAlert noteData={noteData?.slice(0, 2)?.reverse()} />
      </Grid>
      {/* gantt chart section  */}
      <Grid
        item
        xs={12}
        lg={6}
        md={12}
        sx={[
          {
            display: "block",
            "@media (max-width: 768px)": {
              display: "none",
            },
          },
        ]}
      >
        <Typography
          variant="h5"
          gutterBottom
          component="div"
          sx={{
            fontWeight: "bold",
            color: "text.secondary",
          }}
        >
          Gantt
        </Typography>
        <Card
          sx={[
            {
              width: "calc(100vw - 55vw)",

              "@media screen and (max-width: 1025px)": {
                width: "calc(100vw - 140px)",
              },
              height:
                window.innerHeight >= 768
                  ? "calc(100vh - 360px)"
                  : "calc(100vh - 100px)",
            },
          ]}
        >
          <Ganttt />
        </Card>
      </Grid>
      <Grid item xs={12} lg={6} md={12}>
        <Grid container spacing={3}>
          {/* team members section */}
          <Grid item xs={12} sm={6} md={6}>
            <Typography
              variant="h5"
              gutterBottom
              component="div"
              sx={{
                fontWeight: "bold",
                color: "text.secondary",
              }}
            >
              Team Members
            </Typography>
            <TeamMembers />
          </Grid>
          {/* working hour and storage sectionn  */}
          <Grid item xs={12} sm={6} md={6}>
            {/* Last wk hour */}
            <Paper
              className={`${Classes.hover_style}`}
              variant="outlined"
              sx={{
                p: 1,
                textAlign: "center",
                m: 1,
                cursor: "pointer",
              }}
              onClick={() => navigate("/gantt")}
            >
              <Box
                sx={[
                  {
                    width: "100px",
                    // height: "150px",
                    textAlign: "center",
                    margin: "auto",
                  },
                ]}
              >
                <img src={workingHour} alt="invite" className="img-fluid" />
              </Box>
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                sx={{
                  fontWeight: "bold",
                  color: "text.secondary",
                }}
              >
                Last Working Hour: {workingH[0]?.total_workhour}
              </Typography>
            </Paper>
            {/* storage  */}
            <Paper
              variant="outlined"
              sx={{ p: 1, textAlign: "center", fontWeight: "bold" }}
            >
              <VictoryPie
                colorScale={["#96A6BC", "#001D42"]}
                width={550}
                data={[
                  {
                    x: `Total(${user.used_quota})`,
                    y: parseFloat(`${user?.used_quota?.split(" ")[0]}`),
                    label: `Used(${user.used_quota})`,
                  },
                  {
                    x: `Total(${user.upload_quota})`,
                    y: parseFloat(`${user.upload_quota?.split(" ")[0]}`),
                    label: `Total(${user.upload_quota})`,
                  },
                ]}
              />
              Storage
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default React.memo(Dashboard);
