import React from "react";

// components

import NewTicket from "components/Cards/TicketTabletech";

export default function Ticket() {
  return (
    <>
     <div className="flex flex-wrap mt-4">
     <div className="w-full mb-12 px-4">
         
            <NewTicket />
        
        </div>
      </div>
    </>
  );
}
