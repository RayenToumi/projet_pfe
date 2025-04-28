import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { ChevronDown, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const history = useHistory();
  const user = JSON.parse(localStorage.getItem('user'));
  const handleLogout = async () => {
    try {
      // Vérification des données en détail
      const userData = localStorage.getItem('user');
      const token = localStorage.getItem('jwt_token');
  
      // Logs de débogage
      console.log('Contenu de localStorage:');
      console.log('- user:', userData);
      console.log('- token:', token);
  
      if (!userData && !token) {
        throw new Error('Aucune donnée de session trouvée');
      }
  
      // Vérification séparée des éléments manquants
      const missingItems = [];
      if (!userData) missingItems.push('données utilisateur');
      if (!token) missingItems.push('jeton JWT');
      
      if (missingItems.length > 0) {
        throw new Error(`Éléments manquants : ${missingItems.join(', ')}`);
      }
  
      // Vérification de la validité des données utilisateur
      let user;
      try {
        user = JSON.parse(userData);
        if (!user._id) throw new Error('ID utilisateur manquant');
      } catch (parseError) {
        console.error('Erreur de parsing des données utilisateur:', parseError);
        throw new Error('Données utilisateur corrompues');
      }
  
      // Appel API avec gestion d'erreur améliorée
      const response = await fetch(`/logout/${user._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
  
      // Vérification de la réponse
      if (!response.ok) throw new Error(`Erreur serveur: ${response.status}`);

      // Nettoyage et redirection
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
      history.push('/homepagevisiteur'); // Redirection vers la page de login
  
      // Nettoyage après succès
      localStorage.removeItem('user');
      localStorage.removeItem('jwt_token');
 
  
    } catch (error) {
      console.error('Journal complet d\'erreur:', error);
      
      // Messages d'erreur contextuels
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
      setIsOpen(false);
    }
  };

  return (
    <>
      <nav className="top-0 fixed z-50 w-full flex flex-wrap items-center justify-between px-2 py-3 navbar-expand-lg bg-white shadow-lg border-b border-blue-100">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          {/* Logo */}
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              to="/homepage"
              className="text-blueGray-700 text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/0/06/Logo_STB.png" 
                alt="STB Logo" 
                style={{ height: '50px', width: '150px' }} 
              />
            </Link>
            <button
              className="cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>

          {/* Menu Items */}
          <div className={"lg:flex flex-grow items-center bg-white lg:bg-opacity-0 lg:shadow-none" + (navbarOpen ? " block" : " hidden")}>
            <div className="flex items-center gap-20 ml-auto">
              
              {/* Mes Tickets */}
              <Link
                to="/MyTickets"
                className="text-blue-900 hover:text-blue-600 px-4 py-2 text-sm font-semibold transition-colors duration-200"
              >
                Mes tickets
              </Link>

              {/* Profil Jean Dupont */}
              <div className="relative">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center text-blue-900 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                  >
                    <span className="mr-1 font-medium">{user?.prenom} {user?.nom}</span>
                    <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                </div>

                {isOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl py-3 border border-blue-50 transform origin-top-right">
                    <div className="px-4 py-2 border-b border-blue-100">
                    <p className="text-sm font-semibold text-blue-900">{user?.email}</p>
                    </div>

                    <Link
  to={user?.role === 'admin' 
    ? '/admin' 
    : user?.role === 'technicien' 
      ? '/technicien' 
      : '/utilisateur'}
  className="flex items-center px-4 py-3 text-sm text-blue-900 hover:bg-blue-50 transition-colors duration-200"
  onClick={() => setIsOpen(false)}
>
  <User className="h-5 w-5 mr-3 text-blue-600" />
  Mon profil
</Link>

                    <div
                      className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-5 w-5 mr-3" />
                      Déconnexion
                    </div>
                  </div>
                )}

              </div>

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
