import { createPortal } from "react-dom";
import { Modal } from "../../../../modal/Modal";
import { Add } from "../addPlant/Add.jsx";
import { Edit } from "../editPlant/Edit.jsx";
import { Info } from "../info/Info.jsx";
import { Delete } from "../deletePlant/Delete.jsx";
import { usePlant } from "../../../../../contexts/PlantContext";

export const Options = () => {
  const { addPlant, infoPlant, editPlant, deletePlant } = usePlant();
  return (
    <>
      {addPlant &&
        createPortal(
          <Modal>
            <Add />
          </Modal>,
          document.getElementById("contentBody"),
        )}

      {infoPlant &&
        createPortal(
          <Modal>
            <Info />
          </Modal>,
          document.getElementById("contentBody"),
        )}

      {editPlant &&
        createPortal(
          <Modal>
            <Edit />
          </Modal>,
          document.getElementById("contentBody"),
        )}

      {deletePlant &&
        createPortal(
          <Modal>
            <Delete />
          </Modal>,
          document.getElementById("contentBody"),
        )}
    </>
  );
};
