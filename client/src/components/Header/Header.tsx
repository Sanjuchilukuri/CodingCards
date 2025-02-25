import { FaCode } from "react-icons/fa6";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { IoIosSunny } from "react-icons/io";

function Header() {

  const { currentTheme ,changeTheme} = useContext(ThemeContext);

  return (
    <div className="w-100 px-3 d-flex justify-content-between py-1 border-bottom align-items-center bg-white">
      <div className="d-flex fs-40 app-logo text-secondary"><FaCode /></div>
      <div className="d-flex fw-medium gap-4 fs-5"> 
        <p className="cursor-pointer text-secondary" onClick={() => window.location.href = "https://github.com/Sanjuchilukuri/CodingCards/blob/main/Readme.md"}>Docs</p>
        <p className="cursor-pointer text-secondary" onClick={() => window.location.href = "https://github.com/Sanjuchilukuri/CodingCards/blob/main/Contributions.md"}>Contribute</p>
        {currentTheme == "dark"?  
          <span className="fs-5 cursor-pointer text-secondary" onClick={() => changeTheme()}>
              <IoIosSunny />
          </span>
          :
          <span className="fs-5 cursor-pointer text-secondary" onClick={() => changeTheme()}>
            <BsFillMoonStarsFill />
          </span>
        }
      
      </div>
    </div>
  )
}

export default Header;
