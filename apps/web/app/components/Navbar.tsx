"use client";
import { RxHamburgerMenu } from "react-icons/rx";
import { User } from "../types/user";
import { useEffect } from "react";
import { logOut } from "../services/userServices/auth.service";

interface IMe {
  user: User | undefined;
}

const Navbar: React.FC<IMe> = ({ user }) => {
  useEffect(() => {
    console.log("Navbar user", user);
  }, [user]);

  
  if (user === undefined) {
    return;
  }
  const handleLogout = async () => {
    console.log("click logout");
    try {
      await logOut(user._id);
    } catch (error) {
      console.log("Error while logout: ", error);
    }
  };
  return (
    <div className=" w-[95%] h-[7%] px-7 flex items-center justify-between rounded-3xl bg-[#110D24] text-white">
      {/* Logo */}
      <div className="flex items-center gap-5 h-full">
        <img
          src={user.profilePicture}
          alt="Logo"
          className="w-[40px] h-[40px] rounded-full overflow-hidden object-cover"
        />
        <div className="font-bold text-2xl">Hello Bolo</div>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-5 h-full">
        <div className="font-semibold text-lg">{user.fullName}</div>
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
        <button
          className="bg-[#1F173E] p-2 rounded-lg"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
