import React from 'react';

const PrimarySidebarActionButton = ({ label, onClick, icon }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mb-3 inline-flex w-full items-center justify-between rounded-xl bg-[#7E1D3B] px-4 py-3 text-sm font-bold text-white shadow-md shadow-rose-900/20 transition hover:bg-[#63162e]"
    >
      <span>{label}</span>
      {icon}
    </button>
  );
};

export default PrimarySidebarActionButton;
