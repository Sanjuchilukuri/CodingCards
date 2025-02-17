import { FaCode } from "react-icons/fa6";
import { BsFillMoonStarsFill } from "react-icons/bs";

function Header() {
  return (
    <div className="w-100 px-3 d-flex justify-content-between py-1 border-bottom align-items-center">
      <div className="d-flex fs-40 app-logo"><FaCode /></div>
      <div className="d-flex fw-medium gap-4 fs-5">
        <p className="cursor-pointer">Docs</p>
        <p className="cursor-pointer">Contribute</p>
        <span className="fs-5 cursor-pointer"><BsFillMoonStarsFill /></span>
      </div>
    </div>
  )
}

export default Header
