import { FaCog } from "react-icons/fa";
import React, { useState, useContext } from "react";
import OrderSourceModal from "../../components/OrderSourceModal";
import { SourcesContext } from "../../context/SourcesContext";

function Header() {
  const sourcesContext = useContext(SourcesContext);
  const [isModalVisible, setModalVisible] = useState(false);

  const sourceOrder = sourcesContext.sources;

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

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
