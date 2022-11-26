import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { TextField } from "@mui/material";
// import { v4 } from "uuid";
import swal from "sweetalert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export default function NewTaskModal({
  open,
  handleClose,
  setLoaded,
  loaded,
  serviceID,
  roomId,
}) {
  const [title, setTitle] = React.useState("");
  const [note, setNote] = React.useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  const formData = new FormData();
  const handleNewTaskAdd = (e) => {
    e.preventDefault();

    formData.append("title", title);
    formData.append("note", note);
    formData.append("poster", user?.sopnoid);
    formData.append("ser_refer", serviceID);
    formData.append("room_id", roomId);
    formData.append("maintas", "1");
    formData.append("c_refer", "1");
    fetch(`${user?.master_url}/profile/login/api/utask_new.php`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        if (data[0].message === "Success") {
          handleClose();
          setLoaded(!loaded);
          window.location.reload();
        } else {
          swal("Error", "Something went wrong", "error");
        }
      })
      .catch((err) => console.log(err));
    // handleClose();
  };

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <form onSubmit={handleNewTaskAdd}>
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
                sx={{
                  fontWeight: "bold",
                  color: "#000",
                  mb: "1rem",
                }}
              >
                New Task
              </Typography>
              <TextField
                sx={{
                  mb: "1rem",
                }}
                id="outlined-basic1"
                label="Title"
                variant="outlined"
                fullWidth
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                sx={{
                  mb: "1rem",
                }}
                id="outlined-basic"
                label="Note"
                variant="outlined"
                fullWidth
                onChange={(e) => setNote(e.target.value)}
              />
              <Box
                sx={{
                  display: "flex",
                }}
              >
                <Button
                  sx={{
                    m: "1rem",
                  }}
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  type="submit"
                >
                  Submit
                </Button>
                <Button
                  sx={{
                    m: "1rem",
                  }}
                  variant="contained"
                  color="error"
                  size="large"
                  fullWidth
                  type="reset"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
              </Box>
            </form>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
}
