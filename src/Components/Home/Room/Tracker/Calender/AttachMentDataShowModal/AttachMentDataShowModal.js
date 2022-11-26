import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Paper } from "@mui/material";
import fileDownload from "js-file-download";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  //   border: "2px solid #000",
  //   boxShadow: 24,
  p: 4,
  borderRadius: "4px",
};

export default function AttachmentShowModal({
  AttachmentOpen,
  handleAttachClose,
  attachmentValueData,
}) {
  return (
    <div>
      <Modal
        open={AttachmentOpen}
        onClose={handleAttachClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              height: attachmentValueData.length > 0 ? "200px" : "auto",
              overflowY: attachmentValueData.length > 2 ? "scroll" : "auto",
            }}
          >
            {attachmentValueData.length > 0 ? (
              attachmentValueData?.map((data) => (
                <Paper
                  sx={{
                    p: 1,
                    my: 1,
                    backgroundColor: "#f5f5f5",
                  }}
                  variant="outlined"
                >
                  <Typography
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      overflow: "hidden",
                      cursor: "pointer",
                    }}
                    variant="subtitle1"
                    component="h2"
                    onClick={() => {
                      fileDownload(data?.file_name, data?.file_name);
                    }}
                  >
                    File Name: {data.file_name}
                  </Typography>
                  <Box
                    sx={{
                      fontSize: "0.8rem",
                      color: "text.secondary",
                      fontWeight: "bold",
                    }}
                  >
                    Upload by: {data.uploader_name}
                  </Box>
                  <Box
                    sx={{
                      fontSize: "0.6rem",
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
              >
                No Attachment
              </Typography>
            )}
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
