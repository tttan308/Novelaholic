import { FaCog } from "react-icons/fa";
import React, { useState } from "react";
import OrderSourceModal from "../../components/OrderSourceModal";

function Header() {
  const [isModalVisible, setModalVisible] = useState(false);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const sourceOrder = JSON.parse(localStorage.getItem("sources"));

  return (
    <div className="flex justify-between h-[60px] bg-main">
      <div
        className="flex items-center h-full ml-6 cursor-pointer"
        onClick={() => (window.location.href = `/?source=${sourceOrder[0].id}`)}
      >
        <img className="h-[40px] mr-4" src="/logo.png" alt="logo" />
        <div className="font-cherry text-[27px] text-white">Novelaholic</div>
      </div>

      <div className="flex items-center h-full">
        <FaCog
          className="text-white mr-6 cursor-pointer"
          size={24}
          onClick={openModal}
        />
      </div>

      <OrderSourceModal
        isVisible={isModalVisible}
        onClose={closeModal}
      ></OrderSourceModal>
    </div>
  );
}

export default Header;
