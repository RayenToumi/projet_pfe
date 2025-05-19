import React, { useEffect, useState } from "react";
import CardStats from "components/Cards/CardStats";

export default function HeaderStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    // appelle ton backend ici
    fetch("/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Erreur:", err));
  }, []);

  if (!stats) return <div className="text-white text-center">Chargement...</div>;

  return (
    <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
      <div className="px-4 md:px-10 mx-auto w-full">
        <div className="flex flex-wrap">
          <div className="w-full lg:w-4/12 xl:w-4/12 px-4">
            <CardStats
              statSubtitle="CLIENTS"
              statTitle={stats.clients}
              statArrow="up"
              statPercent="100"
              statPercentColor="text-emerald-500"
              statDescripiron="Nombre total"
              statIconName="fas fa-users"
              statIconColor="bg-lightBlue-500"
            />
          </div>
          <div className="w-full lg:w-4/12 xl:w-4/12 px-4">
            <CardStats
              statSubtitle="TECHNICIENS"
              statTitle={stats.techniciens}
              statArrow="up"
              statPercent="100"
              statPercentColor="text-emerald-500"
              statDescripiron="Nombre total"
              statIconName="fas fa-tools"
              statIconColor="bg-orange-500"
            />
          </div>
          <div className="w-full lg:w-4/12 xl:w-4/12 px-4">
            <CardStats
              statSubtitle="ADMINS"
              statTitle={stats.admins}
              statArrow="up"
              statPercent="100"
              statPercentColor="text-emerald-500"
              statDescripiron="Nombre total"
              statIconName="fas fa-user-shield"
              statIconColor="bg-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
