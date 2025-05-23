import React from "react";
import { Link, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTicket,faTicketSimple , faTools,faSignOutAlt, faUsers, faCog, faChartPie, faCalendarAlt, faToolbox, faComments } from '@fortawesome/free-solid-svg-icons'; // Ajout de faComments

export default function Sidebar() {
  const [collapseShow, setCollapseShow] = React.useState("hidden");
  const history = useHistory();

  const handleLogout = async () => {
    try {
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('jwt_token');

      console.log('Contenu de localStorage:');
      console.log('- user:', userData);
      console.log('- token:', token);

      if (!userData && !token) {
        throw new Error('Aucune donnée de session trouvée');
      }

      const missingItems = [];
      if (!userData) missingItems.push('données utilisateur');
      if (!token) missingItems.push('jeton JWT');
      
      if (missingItems.length > 0) {
        throw new Error(`Éléments manquants : ${missingItems.join(', ')}`);
      }

      let user;
      try {
        user = JSON.parse(userData);
        if (!user._id) throw new Error('ID utilisateur manquant');
      } catch (parseError) {
        console.error('Erreur de parsing des données utilisateur:', parseError);
        throw new Error('Données utilisateur corrompues');
      }

      const response = await fetch(`/api/logout/${user._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
      history.push('/login');

    } catch (error) {
      console.error('Journal complet d\'erreur:', error);
      
      let errorMessage = 'Erreur inconnue';
      if (error.message.includes('manquants')) {
        errorMessage = `Problème de session : ${error.message}`;
      } else if (error.message.includes('corrompues')) {
        errorMessage = 'Session invalide, veuillez vous reconnecter';
      } else {
        errorMessage = `Échec technique : ${error.message}`;
      }
      
      alert(`Échec de la déconnexion :\n${errorMessage}`);
    } finally {
      setCollapseShow("hidden");
    }
  };



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
         
            <center>
            <img
  src="https://upload.wikimedia.org/wikipedia/commons/0/06/Logo_STB.png"
  alt="STB Logo"
  style={{ height: '75px', width: '180px' }}  // augmenté
/>
            </center>
         
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
 <li>
                <Link
                  className="flex items-center p-4 text-gray-300 hover:bg-gray-700 rounded-xl transition-all duration-200"
                  to="/technicien/mestickets"
                >
                  <FontAwesomeIcon 
                    icon={faTools} 
                    className="w-5 h-5 mr-3 text-purple-400" 
                  />
                  Mes tâches
                </Link>
              </li>
                <Link
                  className="flex items-center p-4 text-gray-300 hover:bg-gray-700 rounded-xl transition-all duration-200"
                  to="/technicien/commentaire"
                >
                  <FontAwesomeIcon 
                    icon={faComments} // Utilisation correcte de faComments
                    className="w-5 h-5 mr-3 text-red-400" 
                  />
                  les avis des clients
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
            <div className="mt-8 border-t border-gray-700 pt-4">
                        <button
              onClick={handleLogout}
              className="flex items-center w-full p-4 text-red-500 hover:bg-gray-700 rounded-xl transition-all duration-200"
            >
              <FontAwesomeIcon 
                icon={faSignOutAlt} 
                className="w-5 h-5 mr-3 text-red-500" 
              />
              Déconnexion
            </button>
            
                      </div>

            
          </div>
        </div>
      </nav>
    </>
  );
}