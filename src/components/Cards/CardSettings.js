import React from "react";

export default function CardSettings() {
  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full max-w-[1000px] mb-6 shadow-lg rounded-lg bg-[var(--ubci-card-bg)] border border-[var(--ubci-gray-200)] overflow-hidden">
        <div className="rounded-t bg-white mb-0 px-6 py-6">
          <div className="text-center flex justify-between">
            <h6 className="text-blueGray-700 text-xl font-bold">My Account</h6>
          </div>
        </div>

        <div className="flex-auto px-4 lg:px-10 py-10 pt-0 bg-blueGray-50 rounded-b-lg overflow-auto">
          <form>
            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase flex items-center">
              <svg
                className="h-5 w-5 text-lightBlue-600 mr-2"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Informations Personnelles
            </h6>

            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-4">
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="username"
                  >
                    Nom
                  </label>
                  <input
                    type="text"
                    className="gp-form-input"
                    id="username"
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-4">
                  <label
                   className="block font-semibold mb-1"
                    htmlFor="firstName"
                  >
                    Prénom
                  </label>
                  <input
                    type="text"
                    className="gp-form-input"                    id="firstName"
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-4">
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="gp-form-input"                       id="email"
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-4">
                  <label
                      className="block font-semibold mb-1"
                    htmlFor="lastName"
                  >
                    Num Tel
                  </label>
                  <input
                    type="text"
                    className="gp-form-input"                       id="lastName"
                  />
                </div>
              </div>
            </div>

            <hr className="mt-6 border-b-1 border-blueGray-300" />

            <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase flex items-center">
              <svg
                className="h-5 w-5 text-lightBlue-600 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
              Changer le mot de passe
            </h6>

            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-4">
                  <label
                    className="block font-semibold mb-1"
                    htmlFor="currentPassword"
                  >
                    Ancien mot de passe
                  </label>
                  <input
                    type="password"
                    className="gp-form-input"                      id="currentPassword"
                  />
                </div>
              </div>

              <div className="w-full lg:w-6/12 px-4">
                <div className="relative w-full mb-4">
                  <label
                     className="block font-semibold mb-1"
                    htmlFor="newPassword"
                  >
                    Nouveau mot de passe
                  </label>
                  <input
                    type="password"
                    className="gp-form-input"                      id="newPassword"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4" style={{ gap: "12px" }}>
              <button
                type="button"
                className="gp-btn gp-btn-cancel"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="gp-btn gp-btn-save"
              >
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Style JSX vide */}
      <style jsx>{`
        .gp-btn {
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }
           .gp-btn-cancel {
          background-color:rgb(224, 224, 224);
          color: #374151;
        }
        .gp-btn-cancel:hover {
          background-color: #e5e7eb;
        }
            .gp-btn-save {
          background-color: #0ea5e9;
          color: white;
        }
        .gp-btn-save:hover {
          background-color: #0284c7;
        }
            .gp-form-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 0.375rem;
        }
        .gp-disabled-input {
          background-color: #f3f4f6;
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
}
