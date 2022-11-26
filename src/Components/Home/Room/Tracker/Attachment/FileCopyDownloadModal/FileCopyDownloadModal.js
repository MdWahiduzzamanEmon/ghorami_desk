import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { CopyToClipboard } from "react-copy-to-clipboard";
import swal from "sweetalert";
import fileDownload from "js-file-download";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #fff",
  //   boxShadow: 24,
  borderRadius: 4,
  p: 4,
};
const FileCopyDownloadModal = ({ item }) => {
  const [open2, setOpen2] = React.useState(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  console.log(item);
  // === use for download ===
  const onButtonClick = (file) => {
     console.log(file)
     // using Java Script method to get PDF file
     fetch("file").then((response) => {
       response.blob().then((blob) => {
         // Creating new object of PDF file
         const fileURL = window.URL.createObjectURL(blob);
         // Setting various property values
         let alink = document.createElement("a");
         alink.href = fileURL;
         alink.download = "SamplePDF.pdf";
         alink.click();
       });
     });
   };

  return (
    <div>
      <Box onClick={handleOpen2}>{item?.file_name}</Box>
      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{
              fontWeight: "bold",
              mb: 2,
            }}
          >
            {item?.attachment_note === "" ? (
              <Box
                sx={{
                  fontWeight: "bold",
                  color: "red",
                  fontSize: "0.9rem",
                }}
              >
                No Note Found!
              </Box>
            ) : (
              <>
                Note -{" "}
                <span
                  style={{
                    fontWeight: "bold",
                    color: "black",
                    fontSize: "0.9rem",
                    wordWrap: "break-word",
                    wordBreak: "break-word",
                  }}
                >
                  {" "}
                  {item?.attachment_note}
                </span>
              </>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "bold",
                wordWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {item?.file_name}
            </Typography>

            <CopyToClipboard
              text={item?.file_url}
              onCopy={() => {
                swal("Copied!", "Link has been copied to clipboard", "success");
                handleClose2();
              }}
            >
              <Button
                sx={{
                  fontSize: "0.6rem",
                }}
                variant="outlined"
                color="primary"
                size="small"
              >
                Copy
              </Button>
            </CopyToClipboard>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              my: 2,
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: "bold",
                wordWrap: "break-word",
                wordBreak: "break-word",
              }}
            >
              {item?.file_name}
            </Typography>
            <Button
              variant="outlined"
              color="primary"
              size="small"
              sx={{
                fontSize: "0.6rem",
              }}
              onClick={() => {
                onButtonClick(item?.file_url);
                // fileDownload(item?.file_url, item?.file_name);
                handleClose2();
              }}
            >
              Download
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default FileCopyDownloadModal;
