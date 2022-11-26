import React, { useEffect, useState } from "react";
import { RiAddBoxLine } from "react-icons/ri";
import { Avatar, Box, Divider, TextField } from "@mui/material";
import { Button } from "@mui/material";
import { useLocation } from "react-router-dom";
import AttachmentModal from "./AttachmentModal/AttachmentModal";
import { FiRefreshCcw } from "react-icons/fi";
import useAuth from "../../../../../Hooks/useAuth";
import FileCopyDownloadModal from "./FileCopyDownloadModal/FileCopyDownloadModal";

const Attachment = ({ trackerId }) => {
  const location = useLocation();
  const [attachmentData, setAttachmentData] = useState([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [reload, setReload] = React.useState(false);
  const { pageRefresh, setPageRefresh } = useAuth();
  const [searchValue, setSearchValue] = React.useState("");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    var axios = require("axios");
    var FormData = require("form-data");
    var data = new FormData();
    data.append("SopnoID", user.sopnoid);
    data.append("action", "fetch");
    data.append("task", trackerId);
    data.append("room", location.state.room);

    var config = {
      method: "post",
      url: `${user.master_url}/profile/login/api/utask_attachment_all.php`,
      data: data,
    };

    axios(config)
      .then(function (response) {
        // console.log((response.data));
        setAttachmentData(response.data);
        const filterData = response.data.filter((item) => {
          return item?.file_name
            .toLowerCase()
            ?.includes(searchValue.toLowerCase());
        });
        setAttachmentData(filterData);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [
    user.master_url,
    trackerId,
    user.sopnoid,
    location.state.room,
    reload,
    pageRefresh,
    searchValue,
  ]);
  const handleReload = () => {
    setReload(!reload);
  };
  return (
    <div>
      <Box
        sx={{
          display: "flex",
          alignItems: {
            xs: "flex-start",
            sm: "center",
            md: "center",
          },
          justifyContent: {
            xs: "flex-start",
            sm: "space-between",
            md: "space-between",
          },
          flexWrap: "wrap",
          flexDirection: {
            xs: "column",
            sm: "row",
            md: "row",
          },
          mt: {
            xs: 12,
            sm: 12,
            md: 0.5,
          },
        }}
      >
        <Box
          sx={{
            fontSize: "1rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            mt: {
              md: 1.5,
            },
            paddingLeft: "1rem",
          }}
        >
          Attachment{" "}
          <span
            style={{
              color: "#ff0000",
            }}
          >
            ({attachmentData?.length})
          </span>
          <FiRefreshCcw
            onClick={handleReload}
            style={{
              fontSize: "1.4rem",
              color: "#ff0000",
              cursor: "pointer",
              marginLeft: ".5rem",
            }}
          />
        </Box>

        <Box>
          <Button
            variant="outlined"
            sx={{
              mt: 0.5,
              mr: 1,
            }}
            size="small"
            color="warning"
            onClick={handleOpen}
          >
            <RiAddBoxLine
              style={{
                fontSize: "1.4rem",
                color: "#ff0000",
              }}
            />
          </Button>
          <AttachmentModal
            open={open}
            handleClose={handleClose}
            trackerId={trackerId}
            pageRefresh={pageRefresh}
            setPageRefresh={setPageRefresh}
          />
        </Box>
      </Box>
      <Box
        sx={[
          {
            mb: 1,
            "@media screen and (max-width: 768px)": {
              mb: 0,
              mt: 0.5,
            },
          },
        ]}
      >
        <TextField
          type="search"
          label="Search Attachment"
          variant="outlined"
          fullWidth
          size="small"
          color="warning"
          onChange={(e) => {
            setSearchValue?.(e.target?.value);
          }}
        />
      </Box>
      <Box
        sx={{
          overflowY: attachmentData?.length > 5 ? "scroll" : "hidden",
          height:
            window.innerHeight >= 500
              ? "calc(100vh - 268px)"
              : "calc(100vh - 100px)",
        }}
      >
        {attachmentData.length > 0 ? (
          attachmentData?.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                //   alignItems: "center",
                justifyContent: "space-between",
                //   flexWrap: "wrap",
                alignItems: "center",
                borderBottom: "1px solid #e0e0e0",
                padding: "1rem",
                marginBottom: "1rem",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <span
                  style={{
                    fontSize: ".8rem",
                    // color: "#c0c0c0",
                  }}
                >
                  {item?.ch_time}
                </span>

                <Box>
                  <Box
                    sx={{
                      // wordWrap:"break-word",
                      fontWeight: "bold",
                      wordWrap: "break-word",
                      wordBreak: "break-word",
                      cursor: "pointer",
                      color: "#0C75EA",
                    }}
                  >
                    <FileCopyDownloadModal item={item} />
                  </Box>
                </Box>
                <span
                  style={{
                    color: "#97ACB7",
                    fontSize: ".9rem",
                  }}
                >
                  By-{item?.uploader_name}
                </span>
              </Box>
              <Box>
                <Avatar
                  alt="Remy Sharp"
                  src={item?.uploader_pic}
                  sx={{ width: 24, height: 24 }}
                />
              </Box>
            </Box>
          ))
        ) : (
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#ff0000",
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            No Attachment Found
          </span>
        )}
      </Box>
      <Divider />
    </div>
  );
};

export default React.memo(Attachment);
