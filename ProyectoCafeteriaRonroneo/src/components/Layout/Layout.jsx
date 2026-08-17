import React from "react";
import PropTypes from "prop-types";
import { Box, Container } from "@mui/material";
import Header from "./HeaderRonroneo";
import { Footer } from "./Footer";
import { Toaster } from "react-hot-toast";
import FondoRonroneo from '../../assets/fondoRonroneo.png';

Layout.propTypes = { children: PropTypes.node.isRequired };

export function Layout({ children }) {
  return (
    <Box
      sx={{
        backgroundImage: `url(${FondoRonroneo})`,
        backgroundRepeat: "repeat",
        backgroundSize: "260px",
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box className="no-print">
        <Header />
      </Box>
      <Container component="main" maxWidth="xl" sx={{ py: 2, flex: 1 }}>
        <Box className="no-print">
          <Toaster position="top-center" />
        </Box>
        {children}
      </Container>
      <Box className="no-print">
        <Footer />
      </Box>
    </Box>
  );
}
