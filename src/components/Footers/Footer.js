import React from "react";

export default function Footerr() {
  return (
    <>
      <footer className="relative bg-blueGray-200 pt-8 pb-6">
        
        
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-between">
            {/* Section Contact */}
            <div className="w-full lg:w-4/12 px-4 mb-8 lg:mb-0">
            <h4 className="text-3xl font-semibold">Contactez-nous</h4>
            <hr className="my-6 border-blueGray-300" />
              <p className="text-lg text-blueGray-600 mb-4">
                Souhaitez-vous nous contacter? Nos représentants sont à votre disposition.
              </p>
              <hr className="my-6 border-blueGray-300" />
              
              <div className="space-y-2 text-blueGray-600">
                <div>
                  <strong>Adresse :</strong> 
                  <p>Rue Hedi Nouira 1001 Tunis</p>
                </div>
                <div>
                  <strong>Tél :</strong> 
                  <a href="tel:+21670140000" className="hover:text-blueGray-800">+216 70 140 000</a>
                </div>
                <div>
                  <strong>Fax :</strong> 
                  <span>+216 70 140 333</span>
                </div>
                <div>
                  <strong>Email :</strong> 
                  <a href="mailto:stb@stb.com.tn" className="hover:text-blueGray-800">stb@stb.com.tn</a>
                </div>
                <div>
                  <strong>Site :</strong> 
                  <a href="https://www.stb.com.tn" target="_blank" rel="noopener noreferrer" className="hover:text-blueGray-800">
                    www.stb.com.tn
                  </a>
                </div>
              </div>
            </div>

            {/* Section Social */}
            <div className="w-full lg:w-4/12 px-4">
              <h4 className="text-3xl font-semibold">Suivez-nous</h4>
              <hr className="my-6 border-blueGray-300" />
             
              <div className="mt-6 lg:mb-0 mb-6">
                {/* Boutons sociaux existants */}
                <div className="mt-6 lg:mb-0 mb-6">
                <button
                  className="bg-white text-lightBlue-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-twitter"></i>
                </button>
                <button
                  className="bg-white text-lightBlue-600 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-facebook-square"></i>
                </button>
                <button
                  className="bg-white text-pink-400 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-dribbble"></i>
                </button>
                <button
                  className="bg-white text-blueGray-800 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-github"></i>
                </button>
                <button
                  className="bg-white text-blueGray-800 shadow-lg font-normal h-10 w-10 items-center justify-center align-center rounded-full outline-none focus:outline-none mr-2"
                  type="button"
                >
                  <i className="fab fa-github"></i>
                </button>
              </div>
              </div>
            </div>

            {/* Section Image */}
            <div className="w-full lg:w-4/12 px-4">
            <h4 className="text-2xl font-semibold mb-4">
    
    Nos Agences</h4>
            <hr className="my-6 border-blueGray-300" />
            
            <div className="w-full lg:w-3/12 px-4 mt-8 lg:mt-0">
            
              
              <img 
                src="https://www.stb.com.tn/wp-content/uploads/2021/01/agences.png"
                className="rounded-lg shadow-lg w-full h-auto"
                alt="Réseau d'agences STB"
                style={{
                  maxWidth: '200px',
                  width: '900px',
                  height: 'auto',
                  marginLeft: '100%',
                  transform: 'scale(1.1)'
                }}
              />
            </div>
          </div>
          </div>

          <hr className="my-6 border-blueGray-300" />
         
          
          {/* Copyright */}
         
        </div>
      </footer>
    </>
  );
}