import React from "react";
import { createRoot } from "react-dom/client";
import NavbarComponent from "./components/navbar.jsx";
import "./styles/common.scss";

const root = createRoot(document.getElementById("app"));
root.render(
    <div>
        <NavbarComponent />
        <h1>We're using React {React.version}!</h1>
    </div>
);
