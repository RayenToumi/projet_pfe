import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket, faSignOutAlt, faUsers, faCog, faChartPie, faCalendarAlt, faToolbox } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");



  return (
    <>
      <nav className="md:left-0 md:block md:fixed md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-gray-800 flex flex-wrap items-center justify-between relative md:w-64 z-10 py-4 px-6">
        <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
          {/* Toggler */}
          <button
            className="cursor-pointer text-black opacity-50 md:hidden px-3 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
            type="button"
            onClick={() => setCollapseShow("bg-white m-2 py-3 px-6")}
          >
            <i className="fas fa-bars"></i>
          </button>

          {/* Brand */}
          <Link
            className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0"
            to="/homepage"
          >
            <center>
            <img
  src="https://upload.wikimedia.org/wikipedia/commons/0/06/Logo_STB.png"
  alt="STB Logo"
  style={{ height: '75px', width: '180px' }}  // augmenté
/>
            </center>
          </Link>
          <hr className="my-4 border-t border-gray-600" />
          {/* Collapse */}
          <div
             className={
              "md:flex md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-40 overflow-y-auto overflow-x-hidden h-full justify-between items-center flex-1 rounded " +
              collapseShow
            }
          >
            {/* Navigation */}
            <ul className="md:flex-col md:min-w-full flex flex-col list-none space-y-2 mt-1">
         <li>
                        <Link
                          className="flex items-center p-4 text-gray-300 hover:bg-gray-700 rounded-xl transition-all duration-200"
                          to="/technicien/dashboard"
                        >
                          <FontAwesomeIcon 
                            icon={faChartPie} 
                            className="w-5 h-5 mr-3 text-blue-400" 
                          />
                          Tableau de bord
                        </Link>
                      </li>

         

              <li>
                <Link
                  className="flex items-center p-4 text-gray-300 hover:bg-gray-700 rounded-xl transition-all duration-200"
                  to="/technicien/ticket"
                >
                  <FontAwesomeIcon 
                    icon={faTicket} 
                    className="w-5 h-5 mr-3 text-purple-400" 
                  />
                  Tickets
                </Link>
              </li>

              <li>
                <Link
                  className="flex items-center p-4 text-gray-300 hover:bg-gray-700 rounded-xl transition-all duration-200"
                  to="/technicien/calender"
                >
                  <FontAwesomeIcon 
                    icon={faCalendarAlt} 
                    className="w-5 h-5 mr-3 text-yellow-400" 
                  />
                  Calendrier
                </Link>
              </li>

              <li>
                <Link
                  className="flex items-center p-4 text-gray-300 hover:bg-gray-700 rounded-xl transition-all duration-200"
                  to="/technicien/settings"
                >
                  <FontAwesomeIcon 
                    icon={faCog} 
                    className="w-5 h-5 mr-3 text-gray-400" 
                  />
                  Paramètres
                </Link>
              </li>
            </ul>

            
          </div>
        </div>
      </nav>
    </>
  );
}