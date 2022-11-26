import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import {
  FormControl,
  InputLabel,
  Select,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import swal from "sweetalert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "#fff",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  p: 4,
};

function NewNoteModal({ open, handleClose }) {
  const [value, setValue] = React.useState(new Date());
  const [value1, setValue1] = React.useState(new Date());
  const [priority, setPriority] = React.useState("");
  const [note, setNote] = React.useState("");
  const handleChange = (newValue) => {
    setValue(newValue);
  };
  const handleChange1 = (newValue) => {
    setValue1(newValue);
  };
  const date = new Date(value);
  // get date month year and time
  const date_time1 =
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
  const date_time2 =
    value1.getFullYear() +
    "-" +
    (value1.getMonth() + 1) +
    "-" +
    value1.getDate() +
    " " +
    value1.getHours() +
    ":" +
    value1.getMinutes() +
    ":" +
    value1.getSeconds();
  //   console.log(date_time1, date_time2);

  const handleSave = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const formData = new FormData();
    formData.append("poster", user.sopnoid);
    formData.append("start", date_time1);
    formData.append("end", date_time2);
    formData.append("priority", priority);
    formData.append("status", "status");
    formData.append("note", note);
    axios
      .post(
        `${user.master_url}/profile/login/calender/unotein.php
`,
        formData
      )
      .then((res) => {
        // console.log(res.data);
        if (res.data[0].result === "success") {
          swal("Success", "Note Added Successfully", "success");
          handleClose();
        }
        // handleClose();
      });
  };

  const handleClose1 = () => {
    handleClose();
    setValue(new Date());
    setValue1(new Date());
    setPriority("");
    setNote("");
  };

  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        // closeAfterTransition
        // BackdropComponent={Backdrop}
        // BackdropProps={{
        //   timeout: 500,
        // }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontSize: "1.1rem",
                textAlign: "center",
                mb: 2,
                borderBottom: "1px solid #ccc",
              }}
            >
              Add New Note
            </Typography>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Box
                  sx={{
                    mb: 1,
                    fontWeight: "bold",
                  }}
                >
                  From
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Date&Time picker"
                    value={value}
                    onChange={handleChange}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <Box
                  sx={{
                    mb: 1,
                    fontWeight: "bold",
                  }}
                >
                  To
                </Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Date&Time picker"
                    value={value1}
                    onChange={handleChange1}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                  />
                </LocalizationProvider>
              </Box>
            </Box>
            <Box>
              <TextField
                fullWidth
                label="Note"
                margin="normal"
                multiline
                rows={3}
                onChange={(e) => setNote(e.target.value)}
              />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Priority</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={priority}
                  label="Priority"
                  onChange={(event) => setPriority(event.target.value)}
                >
                  <MenuItem value={1}>Top</MenuItem>
                  <MenuItem value={2}>High</MenuItem>
                  <MenuItem value={3}>Medium</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box
              sx={{
                my: 1,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                sx={{
                  mx: 1,
                }}
                onClick={() => {
                  handleSave();
                }}
              >
                Save
              </Button>
              <Button variant="contained" color="error" onClick={handleClose1}>
                Reset
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}

export default React.memo(NewNoteModal);
