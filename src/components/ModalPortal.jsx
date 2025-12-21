import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
  const modalRoot = document.getElementById("modal-root");

  if (!modalRoot) {
    console.error(" modal-root를 찾을 수 없음");
    return null;
  }

  return createPortal(children, modalRoot);
};

export default ModalPortal;
