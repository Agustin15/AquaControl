import { createPortal } from "react-dom";
import { Modal } from "../../../../modal/Modal";
import { Add } from "../addTank/Add.jsx";
import { Edit } from "../editTank/Edit.jsx";
import { useTank } from "../../../../../contexts/TankContext.jsx";
import { Delete } from "../deleteTank/Delete.jsx";

export const Options = () => {
  const { addTank, editTank, deleteTank } = useTank();
  return (
    <>
      {addTank &&
        createPortal(
          <Modal>
            <Add />
          </Modal>,
          document.getElementById("contentBody"),
        )}

      {editTank &&
        createPortal(
          <Modal>
            <Edit />
          </Modal>,
          document.getElementById("contentBody"),
        )}

      {deleteTank &&
        createPortal(
          <Modal>
            <Delete />
          </Modal>,
          document.getElementById("contentBody"),
        )}
    </>
  );
};
