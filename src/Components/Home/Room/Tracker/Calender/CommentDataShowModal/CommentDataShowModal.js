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

export default function CommentDataShowModal({
  comntopen,
  handleCloseComment,
  cmntValueData,
}) {
  return (
    <div>
      {/* <Button onClick={handleOpen}>Open modal</Button> */}
      <Modal
        open={comntopen}
        onClose={handleCloseComment}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              height: cmntValueData.length > 0 ? "200px" : "auto",
              overflowY: cmntValueData.length > 2 ? "scroll" : "auto",
            }}
          >
            {cmntValueData.length > 0 ? (
              cmntValueData?.map((data) => (
                <Paper
                  variant="outlined"
                  sx={{
                    p: 1,
                    my: 1,
                    backgroundColor: "#f5f5f5",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                    }}
                    variant="subtitle1"
                    component="h2"
                  >
                    Comments: {data.cm_details}
                  </Typography>
                  <Box
                    sx={{
                      fontSize: "0.8rem",
                      color: "text.secondary",
                      fontWeight: "bold",
                    }}
                  >
                    Post by: {data.poster_name}
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
                No Comments
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
