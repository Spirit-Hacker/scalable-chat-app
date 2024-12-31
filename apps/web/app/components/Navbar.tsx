"use client";
import { RxHamburgerMenu } from "react-icons/rx";

const Navbar = () => {
  return (
    <div className=" w-[95%] h-[7%] px-7 flex items-center justify-between rounded-3xl bg-[#110D24] text-white">
      {/* Logo */}
      <div className="flex items-center gap-5 h-full">
        <img
          src="https://t4.ftcdn.net/jpg/10/75/86/19/360_F_1075861908_Q2ZBfVQNvMSSzbZJCXwfu5Ew5CcfelrG.jpg"
          alt="Logo"
          className="w-[40px] h-[40px] rounded-full overflow-hidden object-cover"
        />
        <div className="font-bold text-2xl">Hello Bolo</div>
      </div>

      {/* Search bar */}
      {/* <div></div> */}

      {/* Profile */}
      <div className="flex items-center gap-5 h-full">
        <div className="font-semibold text-lg">Pranil Dhutraj</div>
        <div>
          <img
            src="https://t4.ftcdn.net/jpg/10/75/86/19/360_F_1075861908_Q2ZBfVQNvMSSzbZJCXwfu5Ew5CcfelrG.jpg"
            alt="Logo"
            className="w-[40px] h-[40px] rounded-full overflow-hidden object-cover"
          />
        </div>
        <div className="cursor-pointer">
          <RxHamburgerMenu fontSize={"25px"} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
