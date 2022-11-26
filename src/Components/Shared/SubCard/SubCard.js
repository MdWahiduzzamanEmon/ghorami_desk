import * as React from "react";
import Box from "@mui/material/Box";
import { Card, Typography } from "@mui/material";

const SubCard = ({ children, title, style, image }) => {
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
        {title && (
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            style={{
              fontWeight: "bold",
              paddingBottom: "1rem",
              borderBottom: "1px solid #ccc",
              color: "gray",
            }}
          >
            {title}
          </Typography>
        )}
        {image && (
          <img
            src={image}
            alt=""
            style={{
              width: "80%",
              height: "80%",
              margin: "0 auto",
              objectFit: "cover",
            }}
          />
        )}
        <span>{children}</span>
      </Card>
    </Box>
  );
};

export default SubCard;
