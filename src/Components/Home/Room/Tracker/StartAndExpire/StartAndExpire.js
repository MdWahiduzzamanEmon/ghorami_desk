import { Paper, Box } from "@mui/material";
import axios from "axios";
import * as React from "react";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { useLocation } from "react-router-dom";
import { MobileDatePicker } from "@mui/lab";
import { MdOutlineDoneAll } from "react-icons/md";
import { Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";

// export default StartAndExpire;
import { MdOutlineEditCalendar } from "react-icons/md";
import { AiFillCloseSquare } from "react-icons/ai";
import swal from "sweetalert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: "4px",
  boxShadow: 24,
  p: 4,
};

 function StartAndExpire({ trackerId, setLoad, load }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [value, setValue] = React.useState(null);
  const [value2, setValue2] = React.useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  React.useEffect(() => {
    const formData = new FormData();
    formData.append("SopnoID", user.sopnoid);
    formData.append("room", location.state.room);
    formData.append("task", trackerId);
    formData.append("action", "fetch");
  }, [user.master_url, trackerId, location.state.room, user.sopnoid]);

  const handleStartTime = () => {
    const dateFormat = new Date(value);
    const day = dateFormat.getDate();
    const month = dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();
    const finalFormat = `${day}-${month}-${year}`;

    const formData = new FormData();
    formData.append("poster", user.sopnoid);
    formData.append("room_id", location.state.room);
    formData.append("maintas", trackerId);
    formData.append("ser_refer", location.state.serviceID);
    formData.append("heada", "start_time");
    formData.append("dateline", finalFormat);

    axios
      .post(`${user.master_url}/profile/task_duetimeAdd.php`, formData)
      .then((res) => {
        console.log(res);
        if (res.data === "success") {
          swal("Success", "Start time updated", "success");
          setLoad(!load);
        } else {
          swal("Error", "Start time not updated", "error");
        }
      });
  };

  const handleDueTime = () => {
    const dateFormat = new Date(value2);
    const day = dateFormat.getDate();
    const month = dateFormat.getMonth() + 1;
    const year = dateFormat.getFullYear();
    const finalFormat2 = `${day}-${month}-${year}`;

    const formData = new FormData();
    formData.append("poster", user.sopnoid);
    formData.append("room_id", location.state.room);
    formData.append("maintas", trackerId);
    formData.append("ser_refer", location.state.serviceID);
    formData.append("heada", "due_time");
    formData.append("dateline", finalFormat2);

    axios
      .post(`${user.master_url}/profile/task_duetimeAdd.php`, formData)
      .then((res) => {
        if (res.data === "success") {
          swal("Success", "Due time updated", "success");
          setLoad(!load);
        } else {
          swal("Error", "Due time not updated", "error");
        }
      });
  };
  return (
    <div>
      <span onClick={handleOpen}>
        <MdOutlineEditCalendar
          style={{
            fontSize: "1.5rem",
          }}
        />
      </span>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        // onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "end",
              }}
            >
              <AiFillCloseSquare
                onClick={() => {
                  handleClose();
                }}
                style={{
                  fontSize: "1.6rem",
                  color: "red",
                  cursor: "pointer",
                }}
              />
            </Box>
            <Paper
              sx={{
                ml: 1,
                mr: 1,
                p: 1,
                mt: 2,
              }}
              variant="outlined"
            >
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    label="Start Date"
                    value={value}
                    openTo="day"
                    disablePast
                    views={["year", "month", "day"]}
                    onChange={(newValue) => {
                      setValue(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          width: "80%",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                <Box
                  sx={{
                    backgroundColor: "#ff0000",
                    color: "white",
                    p: 1,
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={handleStartTime}
                >
                  {/* <Button variant="contained" color="primary" size="small"> */}
                  <MdOutlineDoneAll />
                  {/* </Button> */}
                </Box>
              </Box>
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <MobileDatePicker
                    label="End Date"
                    openTo="day"
                    views={["year", "month", "day"]}
                    value={value2}
                    onChange={(newValue) => {
                      setValue2(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        sx={{
                          width: "80%",
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
                <Box
                  sx={{
                    backgroundColor: "#ff0000",
                    color: "white",
                    p: 1,
                    width: "30px",
                    height: "30px",
                    display: "flex",
                    alignItems: "center",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                  onClick={handleDueTime}
                >
                  {/* <Button variant="contained" color="primary" size="small"> */}
                  <MdOutlineDoneAll />
                  {/* </Button> */}
                </Box>
              </Box>
            </Paper>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default React.memo(StartAndExpire);