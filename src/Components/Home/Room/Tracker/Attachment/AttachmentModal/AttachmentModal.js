import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import {
  Input,
  TextField,
  Button,
  LinearProgress,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useLocation } from "react-router-dom";

const AttachmentModal = ({
  open,
  handleClose,
  trackerId,
  pageRefresh,
  setPageRefresh,
}) => {
  const [attachFile, setAttachFile] = React.useState(null);
  const [note, setNote] = React.useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const [progress, setProgress] = useState();
  const location = useLocation();
  //   console.log(location.state.serviceID);

  const handleFileSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", attachFile);
    formData.append("poster", user.sopnoid);
    formData.append("ser_refer", location.state.serviceID);
    formData.append("room_id", location.state.room);
    formData.append("maintas", trackerId);
    formData.append("heada", "attachment");
    formData.append("attachment_note", note);
    axios
      .post(`${user.master_url}/profile/task_attachNew.php`, formData, {
        onUploadProgress: (progressEvent) => {
          setProgress(
            parseInt(
              Math.round((progressEvent?.loaded * 100) / progressEvent?.total)
            )
          );
        },
      })
      .then((res) => {
        // console.log(res);
        if (res.data === "Success") {
          setPageRefresh(!pageRefresh);
          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log(progress);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
  };
  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={() => {
          handleClose();
          setAttachFile(null);
          setNote("");
          setProgress("");
          setAttachFile(null);
        }}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <h6
              id="transition-modal-title"
              style={{
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: "20px",
              }}
            >
              Add New Attachment
            </h6>
            <form onSubmit={handleFileSubmit}>
              <label htmlFor="contained-button-file">
                <Input
                  id="contained-button-file"
                  type="file"
                  style={{ display: "none" }}
                  fullWidth
                  onChange={(e) => setAttachFile?.(e.target?.files[0])}
                />
                <Box
                  sx={{
                    border: "1px solid #ced4da",
                    borderRadius: "4px",
                    padding: "0.5rem",
                    marginTop: "0.5rem",
                    width: "100%",
                  }}
                >
                  {attachFile ? (
                    <span
                      style={{
                        color: "#97ACB7",
                        wordBreak: "break-all",
                      }}
                    >
                      {attachFile?.name}
                    </span>
                  ) : (
                    <Button variant="contained" component="span">
                      Select File
                    </Button>
                  )}
                </Box>
                {progress ? (
                  <LinearProgressWithLabel value={progress} color="error" />
                ) : null}
              </label>
              <TextField
                id="standard-basic"
                label="Note"
                fullWidth
                margin="normal"
                onChange={(e) => setNote?.(e.target?.value)}
                color="warning"
              />

              <Button
                variant="contained"
                color="success"
                size="small"
                style={{
                  marginTop: "1rem",
                  width: "100%",
                }}
                type="submit"
              >
                Save
              </Button>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
export default AttachmentModal;
