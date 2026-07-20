import { useState } from "react";
import { X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SearchOverlay = () => {
  return 
  <>
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]">

      <div className="relative z-10 animate-slide-in-top">
        <div className="glass-panel m-6 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Search</h2>
            <button onClick={()=> dispatch(toggleSearchBar())} className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer">
              <X className="w-6 h-6 text-text-primary" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>;
};

export default SearchOverlay;
