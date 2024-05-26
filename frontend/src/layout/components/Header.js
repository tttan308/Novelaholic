import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

function Header() {
  return (
    <div className="flex justify-between h-[60px] bg-main">
      <Link to="/">
        <div className="flex items-center h-full ml-6 cursor-pointer">
          <img className="h-[40px] mr-4" src="/logo.png" alt="logo" />
          <div className="font-cherry text-[27px] text-white">Novelaholic</div>
        </div>
      </Link>

      <div className="flex items-center h-full">
        <FaCog className="text-white mr-6 cursor-pointer" size={24} />
      </div>
    </div>
  );
}

export default Header;
