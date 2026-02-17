import React, { useContext, useState } from "react";
import VerticalContainer from "../../Components/VerticalContainer";
import ButtonType1 from "../../Elements/Buttons/ButtonType1";
import MenuButton from "../../Elements/Buttons/MenuButton";
import FileDrowdown from "../../Components/FileDrowdown";
import aiContext from "../../contexts/AiContexts/aiContext";

const MenuBar = ({ setShowPreview }) => {
  const { showModel, setShowModel } = useContext(aiContext);

  return (
    <VerticalContainer className="p-0.5 gap-0.5 bg-gray-800 flex items-center h-[30px]">
      <p className="font-bold text-white px-2">Dev Code</p>
      <MenuButton button_text={"File"}>
        <FileDrowdown></FileDrowdown>
      </MenuButton>
      <MenuButton button_text={"Select"}>
        <div className="py-1 min-w-50 bg-gray-600">
          <p className="p-2 hover:bg-gray-500">Tihs is menu button text cn</p>
          <p className="p-2 hover:bg-gray-500">Tihs is menu button text cn</p>
          <p className="p-2 hover:bg-gray-500">Tihs is menu button text cn</p>
          <p className="p-2 hover:bg-gray-500">Tihs is menu button text cn</p>
        </div>
      </MenuButton>
      <MenuButton button_text={"Edit"}></MenuButton>
      <MenuButton
        button_text={"Open Directory"}
        event_handler={() => {
          console.log("This is button text");
        }}
      ></MenuButton>
      <MenuButton button_text={"Select"}></MenuButton>
      <MenuButton button_text={"Edit"}></MenuButton>
      <MenuButton
        button_text={"Open Directory"}
        event_handler={() => {
          console.log("This is button text");
        }}
      ></MenuButton>
      <MenuButton button_text={"Select"}></MenuButton>
      <MenuButton button_text={"Open Preview"}></MenuButton>
      <ButtonType1 button_text={"Show Preview"} event_handler={()=>{setShowPreview(prev=>!prev)}}></ButtonType1>
      <ButtonType1 button_text={"Show Model"} event_handler={()=>{setShowModel(prev=>!prev)}}></ButtonType1>
    </VerticalContainer>
  );
};

export default MenuBar;
