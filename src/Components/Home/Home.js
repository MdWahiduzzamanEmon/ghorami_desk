import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { MdDashboard } from "react-icons/md";
import { RiMessage3Fill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { GiBatteryPackAlt } from "react-icons/gi";
import {
  BsBarChartSteps,
  BsFillFileEarmarkSpreadsheetFill,
} from "react-icons/bs";
// import { RiSettings4Fill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";
import { BiUserVoice } from "react-icons/bi";
import { BiColumns } from "react-icons/bi";
import { NavLink, Outlet } from "react-router-dom";
import axios from "axios";
import { Avatar, Chip, ListItem, Menu, Tooltip } from "@mui/material";
//start
import Badge from "@mui/material/Badge";
import LiveClock from "./LiveClock/LiveClock";
import useAuth from "../../Hooks/useAuth";
import MenuItem from "@mui/material/MenuItem";
//end
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function Home() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [battery, setBattery] = React.useState(0);
  //show battery level
  // navigator.getBattery().then(function (battery) {
  //   // console.log(battery);
  //   setBattery(parseInt(battery.level * 100));
  // });

  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open2 = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //get user information from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  //notification
  React.useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("action", "fetch");
    formData.append("sta", "0");

    axios
      .post(
        `${user.master_url}/profile/login/api/room/noti_room_req.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
      });
  }, [user.master_url, user.sopnoid]);

  // get data or object from context authprovider
  const { notificationData, messageNotification, pageRefresh, setPageRefresh } =
    useAuth();

  //check notifications
  const handleNotificationCheck = () => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("action", "check");

    axios
      .post(
        `${user.master_url}/profile/message/message_notif_change.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
      });
  };

  // session func call 5sec with interval
  React.useEffect(() => {
    let interval = null;
    //make uniq id
    const uniqId = Math.random().toString(36).substring(7);
    // save localstorage
    localStorage.setItem("uniqId", uniqId);
    // make 5 sec interval
    interval = setInterval(() => {
      sessionFunc();
      let temp = "false";
      localStorage.setItem("temp", temp);
    }, 5000);
    // clear interval
    return () => clearInterval(interval);
  }, []);

  //session func
  const sessionFunc = () => {
    const formData = new FormData();
    const LocalTemp = localStorage.getItem("temp");
    const uniqId = localStorage.getItem("uniqId");
    // console.log(typeof LocalTemp);
    const date = new Date();
    // get time format = year-month-day hour:minute:second
    const time =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();

    const currentDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();

    if (LocalTemp?.length === 0) {
      // console.log("temp=0");
      formData.append("poster", user.sopnoid);
      formData.append("startTime", time);
      formData.append("endTime", "0");
      formData.append("state", "0");
      formData.append("sessionId", uniqId);
      formData.append("cdate", currentDate);
      formData.append("ip", JSON.parse(localStorage.getItem("ip")));
      axios
        .post(
          `${user.master_url}/profile/login/api/utask_session_id_new.php`,
          formData
        )
        .then((res) => {
          // console.log(res.data);
        });
    }
    if (LocalTemp.length > 0) {
      // console.log("temp>0");
      formData.append("poster", user.sopnoid);
      formData.append("startTime", "0");
      formData.append("endTime", time);
      formData.append("cdate", currentDate);
      formData.append("sessionId", uniqId);
      formData.append("state", "1");
      formData.append("ip", JSON.parse(localStorage.getItem("ip")));

      axios
        .post(
          `${user.master_url}/profile/login/api/utask_session_id_new.php`,
          formData
        )
        .then((res) => {
          // console.log(res.data);
        });
    }
    // console.log(date);
  };

  // for logout sessionFunc call
  const sessionLogOutfunc = () => {
    const uniqId = localStorage.getItem("uniqId");
    const formData = new FormData();
    const date = new Date();
    // get time format = year-month-day hour:minute:second
    const time =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();

    const currentDate =
      date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    formData.append("poster", user.sopnoid);
    formData.append("startTime", "0");
    formData.append("endTime", time);
    formData.append("cdate", currentDate);
    formData.append("state", "0");
    formData.append("sessionId", uniqId);
    formData.append("ip", JSON.parse(localStorage.getItem("ip")));

    axios
      .post(
        `${user.master_url}/profile/login/api/utask_session_new.php`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
      });
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        open={open}
        sx={{
          backgroundColor: "white",
          borderBottom: "1px solid #e8e8e8",
          boxShadow: "none",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
              color: "text.primary",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              display: { xs: "none", sm: "block" },
              color: "#1BB096",
              fontWeight: "bold",
              fontSize: "1.5rem",
              // fontFamily: "heading",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            Ghorami Desk
          </Typography>
          {/* <Box sx={{ flexGrow: 1 }} /> */}

          {/* <TextField
            type="search"
            label="Search..."
            variant="outlined"
            size="small"
            color="warning"
            sx={{
              ml: {
                xs: "0",
                md: 5,
              },
              display: { xs: "none", sm: "block" },
              mr: 2,
              // width: "40%",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          /> */}
          {/* <Box sx={{ flexGrow: 1 }} /> */}

          <Box sx={{ flexGrow: 1 }} />

          {/* show battery lavel  */}
          {/* <Box
            sx={[
              {
                color: "#000",
                fontWeight: "bold",
                mx: 2,
                "@media screen and (max-width: 768px)": {
                  display: "none",
                },
              },
            ]}
          >
            <GiBatteryPackAlt
              style={{
                fontSize: "1.2rem",
              }}
            />
            {battery}%
          </Box> */}

          {/* show live clock  */}
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "block",
              },
            }}
          >
            <LiveClock />
          </Box>

          {/* profile click information  */}
          <Box>
            <Tooltip title={user?.c_info} arrow placement="right-start">
              <Button
                id="demo-positioned-button"
                aria-controls={open2 ? "demo-positioned-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open2 ? "true" : undefined}
                onClick={handleClick}
              >
                <Chip
                  avatar={<Avatar alt="Natacha" src={user?.userpic} />}
                  label={user?.uname}
                  variant="outlined"
                />
              </Button>
            </Tooltip>
            <Menu
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={open2}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem
                onClick={() => {
                  const date = new Date();
                  const day = date.getDate();
                  const month = date.getMonth() + 1;
                  const year = date.getFullYear();
                  const hours = date.getHours();
                  const minutes = date.getMinutes();

                  handleClose();
                  window.open(
                    `https://ghorami.com/profile/public/user_service_all.php?!=${user.sopnoid}_${user.gType}_marketplace&&access_token=${day}${year}${month}_${hours}${minutes}`
                  );
                }}
              >
                Ghorami Marketplace
              </MenuItem>
              <MenuItem
                onClick={() => {
                  const date = new Date();
                  const day = date.getDate();
                  const month = date.getMonth() + 1;
                  const year = date.getFullYear();
                  const hours = date.getHours();
                  const minutes = date.getMinutes();

                  handleClose();
                  window.open(
                    `https://ghorami.com/profile/login/user_profile.php?!=${user.sopnoid}_${user.gType}_profile&&access_token=${day}${year}${month}_${hours}${minutes}`
                  );
                }}
              >
                Profile
              </MenuItem>
            </Menu>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}></Box>
        </Toolbar>
      </AppBar>
      {/* end  */}
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton
            onClick={handleDrawerClose}
            style={{
              color: "#000",
            }}
          >
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {[
            "Dashboard",
            "Room",
            "Gantt",
            "Message",
            // "TimeSheet",
            // "Settings",
            // "States",
          ].map((text, index) => (
            <ListItem
              Button
              key={text}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                fontWeight: "bold",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {/* route setup  */}
                {/* active link */}
                {/* // select active style  */}
                <Tooltip title="DashBoard" arrow placement="right-start">
                  <NavLink
                    to="/"
                    style={({ isActive }) =>
                      isActive ? { color: "#ff0000" } : { color: "#000" }
                    }
                  >
                    {index === 0 && (
                      <MdDashboard
                        style={{
                          fontSize: "1.5rem",
                        }}
                        onClick={handleDrawerClose}
                      />
                    )}
                  </NavLink>
                </Tooltip>
                <Tooltip title="Room" arrow placement="right-start">
                  <NavLink
                    to="room"
                    style={({ isActive }) =>
                      isActive ? { color: "#ff0000" } : { color: "#000" }
                    }
                  >
                    {index === 1 && (
                      <BiColumns
                        style={{
                          fontSize: "1.5rem",
                        }}
                        onClick={handleDrawerClose}
                      />
                    )}
                  </NavLink>
                </Tooltip>
                <Tooltip title="Gantt" arrow placement="right-start">
                  <NavLink
                    to="gantt"
                    style={({ isActive }) =>
                      isActive ? { color: "#ff0000" } : { color: "#000" }
                    }
                  >
                    {index === 2 && (
                      <BsBarChartSteps
                        style={{
                          fontSize: "1.5rem",
                        }}
                        onClick={handleDrawerClose}
                      />
                    )}
                  </NavLink>
                </Tooltip>
                <Tooltip title="Message" arrow placement="right-start">
                  <NavLink
                    to="message"
                    style={({ isActive }) =>
                      isActive ? { color: "#ff0000" } : { color: "#000" }
                    }
                  >
                    {index === 3 && (
                      <Badge badgeContent={messageNotification} color="error">
                        <RiMessage3Fill
                          style={{
                            fontSize: "1.5rem",
                          }}
                          onClick={() => {
                            handleNotificationCheck();
                            handleDrawerClose();
                          }}
                        />
                      </Badge>
                    )}
                  </NavLink>
                </Tooltip>
                <Tooltip title="TimeSheet" arrow placement="right-start">
                  <NavLink
                    to="timesheet"
                    style={({ isActive }) =>
                      isActive ? { color: "#ff0000" } : { color: "#000" }
                    }
                  >
                    {index === 4 && (
                      <BsFillFileEarmarkSpreadsheetFill
                        style={{
                          fontSize: "1.5rem",
                        }}
                        onClick={handleDrawerClose}
                      />
                    )}
                  </NavLink>
                </Tooltip>
                {/* <Tooltip title="Settings" arrow placement="right-start">
                <NavLink
                  to="settings"
                  style={({ isActive }) =>
                    isActive ? { color: "#ff0000" } : { color: "#000" }
                  }
                >
                  {index === 5 && (
                    <RiSettings4Fill
                      style={{
                        fontSize: "1.5rem",
                      }}
                      onClick={handleDrawerClose}
                    />
                  )}
                </NavLink>
                </Tooltip> */}
                {/* <Tooltip title="States" arrow placement="right-start">
                <NavLink
                  to="states"
                  style={({ isActive }) =>
                    isActive ? { color: "#ff0000" } : { color: "#000" }
                  }
                >
                  {index === 6 && (
                    <BsFillPieChartFill
                      style={{
                        fontSize: "1.5rem",
                      }}
                      onClick={handleDrawerClose}
                    />
                  )}
                </NavLink>
                </Tooltip> */}
              </ListItemIcon>

              <ListItemText
                primary={text}
                sx={{ opacity: open ? 1 : 0, fontWeight: "bold" }}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {["Notifications", "LogOut"].map((text, index) => (
            <ListItem
              button
              key={text}
              sx={{
                minHeight: 48,
                justifyContent: open ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                <NavLink
                  to="notifications"
                  style={({ isActive }) =>
                    isActive ? { color: "#ff0000" } : { color: "#000" }
                  }
                >
                  {index === 0 && (
                    <Tooltip
                      title="
              Notifications"
                      arrow
                      placement="right-start"
                    >
                      <span
                        style={{
                          fontSize: "1.8rem",
                        }}
                      >
                        <Badge
                          badgeContent={notificationData?.length}
                          color="error"
                        >
                          <BiUserVoice onClick={handleDrawerClose} />
                        </Badge>
                      </span>
                    </Tooltip>
                  )}
                </NavLink>
                {index === 1 && (
                  <Tooltip title="LogOut" arrow placement="right-start">
                    <span
                      style={{
                        fontSize: "1.8rem",
                      }}
                    >
                      <FiLogOut
                        color="#000"
                        onClick={() => {
                          sessionLogOutfunc();
                          localStorage.removeItem("user");
                          localStorage.removeItem("ip");
                          localStorage.removeItem("uniqId");
                          localStorage.removeItem("temp");
                          setPageRefresh(!pageRefresh);
                          // window.location.reload();
                          navigate("/login");
                        }}
                      />
                    </span>
                  </Tooltip>
                )}
              </ListItemIcon>
              <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, paddingLeft:"10px",paddingRight:{lg:"30px",md:"30px",sm:"20px",xs:"10px"}, pb: 0, overflow:"hidden" }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}

export default React.memo(Home);
