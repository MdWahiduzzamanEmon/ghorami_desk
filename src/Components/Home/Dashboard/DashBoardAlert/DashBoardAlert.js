import React from "react";
import { Typography } from "@mui/material";
import { Box } from "@mui/material";
import { Paper } from "@mui/material";

const DashBoardAlert = ({ noteData }) => {
  // const { noteData } = useAuth();
  // console.log(noteData);

  return (
    <div>
      {noteData?.length === 0 ? (
        <Typography
          variant="h6"
          sx={{
            textAlign: "center",
            color: "#97ACB7",
            fontWeight: "bold",
            fontSize: "1.5rem",
            marginTop: "1rem",
            border: "1px solid #97ACB7",
            padding: "1rem",
            borderRadius: "5px",
          }}
        >
          No Notes Available
        </Typography>
      ) : (
        noteData?.map((item, index) => {
          return (
            <Paper
              key={index}
              variant="outlined"
              sx={{
                p: 1,
                display: "flex",
                my: 1,
                borderLeft: "5px solid #00bcd4",
              }}
            >
              <Box>
                <Box
                  sx={[
                    {
                      fontSize: "1.5rem",
                      fontWeight: "bold",
                    },
                  ]}
                >
                  {item?.note}
                </Box>
                <Box
                  sx={{
                    color: "text.secondary",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {item?.start}
                </Box>
              </Box>
            </Paper>
          );
        })
      )}
    </div>
  );
};

export default DashBoardAlert;
