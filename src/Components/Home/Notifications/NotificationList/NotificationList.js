import * as React from "react";
import { List, Button, Box } from "@mui/material";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import axios from "axios";
import useAuth from "../../../../Hooks/useAuth";
import swal from "sweetalert";
export default function NotificationList({ notificationData }) {
  const formData = new FormData();
  const user = JSON.parse(localStorage.getItem("user"));
  const { setPageRefresh, pageRefresh } = useAuth();
  const acceptInvitation = (notification) => {
    formData.append("taskid", notification.task_id);
    formData.append("roomid", notification.room);
    formData.append("postk", notification.sopnoid);
    formData.append("serv_in", notification.service);
    formData.append("poster_in", notification.room_poster);
    formData.append("accept", "accept");
    axios
      .post(
        `${user.master_url}/profile/login/api/room/noti_join.php
`,
        formData
      )
      .then((res) => {
        if (res.data[0]?.message === "success") {
          swal({
            title: "Success",
            text: "You have accepted the invitation",
            icon: "success",
            buttons: true,
          }).then((accept) => {
            if (accept) {
              setPageRefresh(!pageRefresh);
            }
          });
        }
      });
  };
  const rejectInvitation = (notification) => {
    // console.log(notification);
    formData.append("taskid", notification.task_id);
    formData.append("roomid", notification.room);
    formData.append("postk", notification.sopnoid);
    formData.append("serv_in", notification.service);
    formData.append("poster_in", notification.room_poster);
    formData.append("accept", "accept");
    axios
      .post(`${user.master_url}/profile/login/api/room/noti_deny.php`, formData)
      .then((res) => {
        if (res.data[0]?.message === "success") {
          swal({
            title: "Success",
            text: "You have rejected the invitation",
            icon: "success",
            buttons: true,
          }).then((accept) => {
            if (accept) {
              setPageRefresh(!pageRefresh);
            }
          });
        }
      });
  };
  return (
    <>
      <ListItemText
        sx={{ ml: 2 }}
        primary="Recent"
        primaryTypographyProps={{
          fontSize: 20,
          fontWeight: "bold",
          letterSpacing: 0,
          backgroundColor: "#F5F5F5",
          padding: "0.5rem",
          borderRadius: "0.5rem",
        }}
      />
      {notificationData?.map((notification, index) => {
        return (
          <List sx={{ width: "100%", bgcolor: "background.paper" }} key={index}>
            <ListItem alignItems="center">
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src={notification?.userpic} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Box
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                  >
                    {notification?.psname} has sent you a room request for{" "}
                    {notification?.stitle}
                  </Box>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline", color: "#7F7F7F" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      - {notification?.create_time}
                    </Typography>
                  </React.Fragment>
                }
              />
              <Button
                variant="contained"
                color="success"
                size="small"
                sx={{
                  mx: 1,
                }}
                onClick={() => {
                  acceptInvitation(notification);
                }}
              >
                Accept
              </Button>
              <Button
                variant="contained"
                color="error"
                size="small"
                sx={{
                  mx: 1,
                }}
                onClick={() => {
                  rejectInvitation(notification);
                  
                }}
              >
                Decline
              </Button>
            </ListItem>

            <Divider variant="inset" component="li" />
          </List>
        );
      })}
    </>
  );
}
