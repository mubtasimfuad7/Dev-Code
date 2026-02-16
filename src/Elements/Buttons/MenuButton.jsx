import React from "react";

const MenuButton = ({children, button_text}) => {
  return (
    <div className="menu_button group relative p-0.5 px-4 text-sm text-white cursor-pointer hover:bg-gray-600 hover:underline trainsition-all duration-400 hover:duration-400 rounded-sm ">
          {button_text}
          <div className="absolute w-full top-full z-10 left-0 hidden group-hover:block">
              {children}
          </div>
    </div>
  );
};

export default MenuButton;
