import React from "react";

// components

import NewTicket from "components/Ticket/NewTicket.js";

export default function Ticket() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <NewTicket />
          </div>
        </div>
      </div>
    </>
  );
}
