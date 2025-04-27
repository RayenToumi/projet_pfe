import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebartechnicien from "components/Sidebar/Sidebarutilisateur.js";

import FooterAdmin from "components/Footers/Footerr.js";

import Settings from "views/utilisateur/Settings";



export default function Utilisateur() {
  return (
    <>
      <Sidebartechnicien />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
        {/* Header */}
     
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/utilisateur/settings" exact component={Settings} />
            
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
