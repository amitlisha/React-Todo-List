// TODO: a general comment on the project structure.
// I believe you worked on scaleable projects, if you did, do you think that 
// the way this project tree is built, is scaleable?
// There's no right or wrong, it what fits the application, but by experience of many programmers, there are some best practices that say that this approach is not a good one.
// say for example, create styles folder and components folder: you should have created components folder and divide the components into sub folders which will contain their corresponding styles.
// and create a shared components folder for things like TimePickModal component
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
