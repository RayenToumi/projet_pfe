import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components


import Sidebartechnicien from "components/Sidebar/Sidebarutilisateur.js";
import HeaderUser from "components/Headers/Headeruser";
import FooterAdmin from "components/Footers/Footerr.js";
import MyTickets from "views/utilisateur/MyTickets.js";
import Settings from "views/utilisateur/Settings";



export default function Utilisateur() {
  return (
    <>
      <Sidebartechnicien />
      <div className="relative md:ml-64 bg-blueGray-100">
       
         <HeaderUser />
        {/* Header */}
     
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/utilisateur/settings" exact component={Settings} />
            <Route path="/utilisateur/MyTickets" exact component={MyTickets} />
            
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
