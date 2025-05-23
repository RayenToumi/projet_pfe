import React, { useEffect, useState } from "react";
import CardStats from "components/Cards/CardStats";

export default function HeaderStatsTech() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Erreur:", err));
  }, []);

  if (!stats) return <div className="text-white text-center">Chargement...</div>;

  return (
    <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12">
      <div className="px-4 md:px-10 mx-auto w-full">
        <div className="flex flex-wrap justify-center">
          <div className="w-full md:w-4/12 px-4">
            <CardStats
              statSubtitle="TECHNICIENS TOTAUX"
              statTitle={stats.techniciens}
              statIconName="fas fa-users"
              statIconColor="bg-orange-500"
            />
          </div>
          <div className="w-full md:w-4/12 px-4">
            <CardStats
              statSubtitle="TECHNICIENS ACTIFS"
              statTitle={stats.techniciensActifs}
              statIconName="fas fa-user-check"
               statIconColor="bg-green-custom"
            />
          </div>
          <div className="w-full md:w-4/12 px-4">
            <CardStats
              statSubtitle="TECHNICIENS INACTIFS"
              statTitle={stats.techniciensInactifs}
              statIconName="fas fa-user-times"
              statIconColor="bg-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
