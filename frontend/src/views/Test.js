import React from "react";

// Si tu as mis le code Dashboard dans un fichier séparé, importe-le comme ceci :
import Dashboard from "views/admin/Dashboard"; // adapte le chemin selon ta structure

export default function Tables() {
  return (
    <>
      <div className="flex flex-wrap mt-4">
        <div className="w-full mb-12 px-4">
          <Dashboard />
        </div>
        {/* 
        <div className="w-full mb-12 px-4">
          <CardTable />
        </div>
        */}
      </div>
    </>
  );
}
