import { X, Search } from "lucide-react";
import { useDispatch } from "react-redux";
import { toggleSearchBar } from "../../store/slices/popupSlice";

const SearchOverlay = () => {

  const dispatch = useDispatch();

  const handleSearch = () => {
        console.log("Search Clicked");
    };

  return (
  <>
  <div className="fixed inset-0 z-50">
    <div className="absolute inset-0 backdrop-blur-md bg-[hsla(var(--glass-bg))]">

      <div className="relative z-10 animate-slide-in-top pt-24">
        <div className="glass-panel mx-auto max-w-2xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Search</h2>
            <button type="button" onClick={()=> dispatch(toggleSearchBar())} className="p-2 rounded-full hover:bg-white/10 transition cursor-pointer">
              <X className="w-6 h-6 text-text-primary" />
            </button>
          </div>

          {/* Search icon button */}
          <div className="relative">
            <input type="text" placeholder="Search products..."
            className="w-full h-12 pl-12 pr-4 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-300 outline-none"/>
            
            <button type="button" onClick={handleSearch}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 cursor-pointer z-20">
                <Search className="w-5 h-5 text-white" />
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>

  </>
  );
};

export default SearchOverlay;
