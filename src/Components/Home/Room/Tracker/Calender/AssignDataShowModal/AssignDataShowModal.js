import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Paper } from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  p: 4,
  borderRadius: "4px",
};

export default function AssignDataShowModal({
  assignOpen,
  handleCloseassign,
  assignValueData,
}) {
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={assignOpen}
        onClose={handleCloseassign}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              height: assignValueData.length > 0 ? "200px" : "auto",
              overflowY: assignValueData.length > 2 ? "scroll" : "auto",
            }}
          >
            {assignValueData.length > 0 ? (
              assignValueData?.map((data) => (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    my: 1,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  {/* <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                    }}
                    variant="subtitle1"
                    component="h2"
                  >
                    Checklist Details: {data.ch_details}
                  </Typography> */}
                  <Box
                    sx={{
                      fontSize: "0.8rem",
                      color: "text.secondary",
                      fontWeight: "bold",
                    }}
                  >
                    Post by: {data.as_name}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "0.7rem",
                      color: "text.secondary",
                      fontWeight: "bold",
                    }}
                  >
                    {data.ch_time}
                  </Box>
                </Paper>
              ))
            ) : (
              <Typography
                sx={{
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  textAlign: "center",
                  p: 3,
                }}
                variant="subtitle1"
                component="h2"
              >
                No Task Assign
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
