import React from "react";
import { Box, Typography } from "@mui/material";
import "./Header.css";

export default function Header() {
  return (
    <>
      <Box className="header">
        <Typography sx={{ fontSize: "25px" }}>Pitch Deck Co-Pilot</Typography>
      </Box>
    </>
  );
}
