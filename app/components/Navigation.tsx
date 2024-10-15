"use client";
import React from 'react';
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaHome, FaClipboardList, FaWallet, FaUser } from "react-icons/fa";

const Navigation = ({ show = true }) => {
  const pathname = usePathname();

  const accountItem = { name: "Account", icon: <FaUser />, path: "/account" };
  const navItems = [
    { name: "Home", icon: <FaHome />, path: "/" },
    { name: "Schedule", icon: <FaClipboardList />, path: "/schedule" },
    { name: "Wallet", icon: <FaWallet />, path: "/wallet" },
  ];

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-50">
      <div className="flex items-center space-x-3">
        <nav className="bg-black rounded-full shadow-lg flex items-center justify-center" style={{ width: '55px', height: '55px' }}>
          <NavItem item={accountItem} pathname={pathname} size={28} />
        </nav>
        <nav 
          className="bg-black rounded-full shadow-lg flex items-center justify-between px-6" 
          style={{ width: '280px', height: '55px' }}
        >
          {navItems.map((item) => (
            <NavItem key={item.name} item={item} pathname={pathname} size={24} />
          ))}
        </nav>
      </div>
    </div>
  );
};

const NavItem = ({ item, pathname, size }) => (
  <Link href={item.path} className="flex items-center justify-center">
    <span
      className={`${
        pathname === item.path ? "text-white" : "text-gray-400"
      }`}
      style={{ fontSize: `${size}px` }}
    >
      {React.cloneElement(item.icon, { size: size })}
    </span>
  </Link>
);

export default Navigation;