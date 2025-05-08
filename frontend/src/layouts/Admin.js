import React from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

// components
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import HeaderStatsTech from "components/Headers/HeaderStatsTech.js";
import HeaderStatsTickets from "components/Headers/HeaderStatsTickets.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views
import Dashboard from "views/admin/Dashboard.js";
import Maps from "views/admin/Maps.js";
import Settings from "views/admin/Settings.js";
import Tables from "views/admin/Tables.js";         // Utilisateurs
import Ticket from "views/admin/Ticket.js";
import Calender from "views/admin/Calender.js";
import CardTech from "views/admin/CardTech.js";     // Techniciens
import Commentaire from "views/admin/Commentaire.js";

export default function Admin() {
  const location = useLocation();

  // Afficher le bon Header selon la page
  let headerToShow = null;
  if (location.pathname === "/admin/tables" || location.pathname === "/admin/commentaire" || location.pathname === "/admin/settings"){
    headerToShow = <HeaderStats />; // Utilisateurs
  } else if (
    location.pathname === "/admin/ticket" ||
    location.pathname === "/admin/calender"
  ) {
    headerToShow = <HeaderStatsTickets />; // Tickets
  } else if (location.pathname === "/admin/cardtech") {
    headerToShow = <HeaderStatsTech />; // Techniciens
  }

  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        {headerToShow}
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/admin/dashboard" exact component={Dashboard} />
            <Route path="/admin/maps" exact component={Maps} />
            <Route path="/admin/settings" exact component={Settings} />
            <Route path="/admin/tables" exact component={Tables} />
            <Route path="/admin/ticket" exact component={Ticket} />
            <Route path="/admin/calender" exact component={Calender} />
            <Route path="/admin/cardtech" exact component={CardTech} />
            <Route path="/admin/commentaire" exact component={Commentaire} />
            <Redirect from="/admin" to="/admin/dashboard" />
          </Switch>

          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
