"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome, FaClipboardList, FaWallet, FaUser } from "react-icons/fa";

const Navigation = ({ show = true }) => {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Schedule", icon: <FaClipboardList />, path: "/schedule" },
    { name: "Wallet", icon: <FaWallet />, path: "/wallet" },
    { name: "Account", icon: <FaUser />, path: "/account" },
  ];

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center z-50">
      {" "}
      {/* Updated z-index */}
      <nav
        className="bg-black bg-opacity-80 rounded-full px-4 py-2 flex justify-around items-center shadow-lg"
        style={{ width: "90%", maxWidth: "400px" }}
      >
        {navItems.map((item) => (
          <Link
            href={item.path}
            key={item.name}
            className="flex flex-col items-center"
          >
            <div
              className={`p-2 rounded-full ${
                pathname === item.path ? "bg-white" : ""
              }`}
            >
              <span
                className={`text-2xl ${
                  pathname === item.path ? "text-blue-500" : "text-gray-400"
                }`}
              >
                {item.icon}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Navigation;
