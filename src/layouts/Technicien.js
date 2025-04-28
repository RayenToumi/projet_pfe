import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components


import Sidebartechnicien from "components/Sidebar/Sidebartechnicien.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

import Settings from "views/technicien/Settings";
import Ticket from "views/technicien/Ticket";
import Calender from "views/technicien/Calender";


export default function Technicien() {
  return (
    <>
      <Sidebartechnicien />
      <div className="relative md:ml-64 bg-blueGray-100">
       
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/technicien/settings" exact component={Settings} />
            <Route path="/technicien/ticket" exact component={Ticket} />
            <Route path="/technicien/calender" exact component={Calender} />
            <Redirect from="/technicien" to="/technicien/ticket" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
