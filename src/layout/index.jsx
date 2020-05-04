import React from "react";
import { Flex, Box } from "rebass";
import { ThemeProvider } from "emotion-theming";

import theme from "./theme";
import "./resetStyles.css";

const Layout = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <Flex
        sx={{
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            flex: "1 1 auto",
          }}
          maxWidth="1440px"
          mx="auto"
          width="100%"
          p="50px"
        >
          {children}
        </Box>
      </Flex>
    </ThemeProvider>
  );
};

export default Layout;
