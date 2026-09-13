import { createPortal } from "react-dom";
import { Modal } from "../../../../modal/Modal.jsx";
import { Add } from "../addPlantation/Add.jsx";
import { Edit } from "../editPlantation/Edit.jsx";
import { Info } from "../info/Info.jsx";
import { Delete } from "../deletePlantation/Delete.jsx";
import { usePlantation } from "../../../../../contexts/plantationContext/PlantationContext.jsx";

export const Options = () => {
  const { showFormAdd, infoPlantation, editPlantation, deletePlantation } = usePlantation();
  return (
    <>
      {showFormAdd &&
        createPortal(
          <Modal>
            <Add />
          </Modal>,
          document.getElementById("contentBody"),
        )}

      {infoPlantation &&
        createPortal(
          <Modal>
            <Info />
          </Modal>,
          document.getElementById("contentBody"),
        )}

      {editPlantation &&
        createPortal(
          <Modal>
            <Edit />
          </Modal>,
          document.getElementById("contentBody"),
        )}

      {deletePlantation &&
        createPortal(
          <Modal>
            <Delete />
          </Modal>,
          document.getElementById("contentBody"),
        )}
    </>
  );
};
