import React, { useEffect, useState } from "react";
import CardStats from "components/Cards/CardStats";

export default function HeaderStatsTickets() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
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
          {/* Total Tickets */}
          <div className="w-full lg:w-3/12 xl:w-3/12 px-4">
            <CardStats
              statSubtitle="TICKETS (TOTAL)"
              statTitle={stats.totalTickets}
              statIconName="fas fa-ticket-alt"
              statIconColor="bg-indigo-500"
            />
          </div>

          {/* Tickets ouverts */}
          <div className="w-full lg:w-3/12 xl:w-3/12 px-4">
          <CardStats
  statSubtitle="TICKETS OUVERTS"
  statTitle={stats.openTickets}
  statIconName="fas fa-lock-open"
  statIconColor="bg-red-500"
/>

          </div>

          {/* Tickets en cours */}
          <div className="w-full lg:w-3/12 xl:w-3/12 px-4">
            <CardStats
              statSubtitle="TICKETS EN COURS"
              statTitle={stats.pendingTickets}
              statIconName="fas fa-spinner"
              statIconColor="bg-yellow-500"
            />
          </div>

          {/* Tickets fermés */}
          <div className="w-full lg:w-3/12 xl:w-3/12 px-4">
          <CardStats
  statSubtitle="TICKETS FERMÉS"
  statTitle={stats.closedTickets}
  statIconName="fas fa-check-circle"
  statIconColor="bg-green-custom"
/>

          </div>
        </div>
      </div>
    </div>
  );
}
