import * as React from "react";
import Box from "@mui/material/Box";
import { Card, Typography } from "@mui/material";

const MainCard = ({ children, title, style, button, search }) => {
  return (
    <Box sx={{ minWidth: 275 }}>
      <Card
        variant="outlined"
        style={{
          padding: "1.5rem",
          margin: "1rem auto",
          ...style,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {title && (
            <Typography
              variant="h5"
              gutterBottom
              component="div"
              sx={[
                {
                  fontWeight: "bold",
                  "@media (max-width: 600px)": {
                    fontSize: "1.2rem",
                  },
                },
              ]}
            >
              {title}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box
              sx={{
                my: 1,
                mr: 1,
                ml: 1,
              }}
            >
              {search}
            </Box>
            {button}
          </Box>
        </Box>
        <span>{children}</span>
      </Card>
    </Box>
  );
};

export default MainCard;
