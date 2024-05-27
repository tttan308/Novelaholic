import { FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import OrderSourceModal from "../../components/OrderSourceModal";

const initSources = [
  {
    id: "1",
    name: "Truyện Full",
    url: "truyenfull.vn",
  },
  {
    id: "2",
    name: "Tàng Thư Viện",
    url: "truyen.tangthuvien.vn",
  },
];

function Header() {
  const [isModalVisible, setModalVisible] = useState(false);
  const [sources, setSources] = useState(initSources);

  const openModal = () => setModalVisible(true);
  const closeModal = () => setModalVisible(false);

  const updateSources = (newSources) => {
    setSources(newSources);
  };

  return (
    <div className="flex justify-between h-[60px] bg-main">
      <Link to="/">
        <div className="flex items-center h-full ml-6 cursor-pointer">
          <img className="h-[40px] mr-4" src="/logo.png" alt="logo" />
          <div className="font-cherry text-[27px] text-white">Novelaholic</div>
        </div>
      </Link>

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
        listSource={sources}
        updateSources={updateSources}
      ></OrderSourceModal>
    </div>
  );
}

export default Header;
