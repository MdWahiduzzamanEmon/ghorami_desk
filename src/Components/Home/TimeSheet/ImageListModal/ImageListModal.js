import React, { useState } from "react";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import InfoIcon from "@mui/icons-material/Info";
import "./style.css";
import { Button } from "@mui/material";
import { Spinner } from "react-bootstrap";
// const style =

export default function ImageListModal({
  open,
  handleClose,
  clickStartTimeImage,
  loading,
  setLoading,
  setClickStartTimeImage,
}) {
  const [imageToShow, setImageToShow] = useState("");
  const [lightboxDisplay, setLightBoxDisplay] = useState(false);
  const imageArray = clickStartTimeImage?.map((item) => item?.userpic);
  const showImage = (image) => {
    setImageToShow(image);
    setLightBoxDisplay(true);
  };

  //hide lightbox
  const hideLightBox = () => {
    setLightBoxDisplay(false);
  };
  const showNext = (e) => {
    e.stopPropagation();
    let currentIndex = imageArray.indexOf(imageToShow);
    if (currentIndex >= imageArray.length - 1) {
      setLightBoxDisplay(false);
    } else {
      let nextImage = imageArray[currentIndex + 1];
      setImageToShow(nextImage);
    }
  };
  const showPrev = (e) => {
    e.stopPropagation();
    let currentIndex = imageArray.indexOf(imageToShow);
    if (currentIndex <= 0) {
      setLightBoxDisplay(false);
    } else {
      let nextImage = imageArray[currentIndex - 1];
      setImageToShow(nextImage);
    }
  };

  return (
    <div>
      <Modal
        open={open}
        onClose={() => {
          handleClose();
          setClickStartTimeImage([]);
          setLoading(true);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={[
            {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "70%",
              bgcolor: "background.paper",
              //   border: "2px solid #000",
              borderRadius: "4px",
              //   boxShadow: 24,
              p: 4,
              "@media (max-width: 768px)": {
                width: "100%",
              },
            },
          ]}
        >
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Spinner
                animation="border"
                variant="primary"
                size="lg"
                className="mx-2"
              />
              <Box>
                <h5>Loading!!Please wait...</h5>
              </Box>
            </Box>
          ) : clickStartTimeImage.length > 0 ? (
            <>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 1,
                  mb: 2,
                  fontSize: "1.2rem",
                  fontWeight: "bold",
                  backgroundColor: "#f5f5f5",
                  borderRadius: "4px",
                }}
              >
                Total Screenshot-{clickStartTimeImage.length}
              </Box>
              <ImageList sx={{ height: 450 }} cols={3} rowHeight={164}>
                {clickStartTimeImage?.map((item, i) => (
                  <ImageListItem key={i}>
                    <img
                      src={`${item?.userpic}?w=164&h=164&fit=crop&auto=format`}
                      srcSet={`${item?.userpic}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                      alt={item?.trefer}
                      loading="lazy"
                      onClick={() => showImage?.(item?.userpic)}
                      style={{
                        cursor: "pointer",
                      }}
                    />

                    <ImageListItemBar
                      title={item.time}
                      subtitle={item.date}
                      actionIcon={
                        <IconButton
                          sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                          aria-label={`info about ${item.time}`}
                        >
                          <InfoIcon />
                        </IconButton>
                      }
                    />
                  </ImageListItem>
                ))}
              </ImageList>
            </>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
                py: 5,
              }}
            >
              "NO SCREENSHOT FOUND"
            </Box>
          )}
          {lightboxDisplay ? (
            <Box id="lightbox">
              <div id="lightbox2" onClick={hideLightBox}>
                {" "}
                X{" "}
              </div>
              <Button
                variant="contained"
                size="small"
                sx={{
                  fontSize: "1.5rem",
                  mr: 1,
                }}
                onClick={showPrev}
              >
                ⭠
              </Button>
              <Box>
                <img className="lightbox-img" src={imageToShow} alt="" />
              </Box>

              <Button
                variant="contained"
                size="small"
                sx={{
                  fontSize: "1.5rem",
                  ml: 1,
                }}
                onClick={showNext}
              >
                ⭢
              </Button>
            </Box>
          ) : (
            ""
          )}
        </Box>
      </Modal>
    </div>
  );
}
