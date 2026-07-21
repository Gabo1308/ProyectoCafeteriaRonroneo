// eslint-disable-next-line no-unused-vars
import React from "react";
import PropTypes from "prop-types";
import { Container } from "@mui/material";
import Header from "./HeaderRonroneo";
import { Footer } from "./Footer";
import { Toaster } from "react-hot-toast";

Layout.propTypes = { children: PropTypes.node.isRequired };

export function Layout({ children }) {
  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />
      <Container maxWidth="xl" sx={{ py: 2, flexGrow: 1 }}>
        <Toaster position="top-center" />
        {children}
      </Container>
      <Footer />
    </Container>
  );
}
