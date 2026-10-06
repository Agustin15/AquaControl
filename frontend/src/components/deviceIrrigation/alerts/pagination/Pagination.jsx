import styles from "./Pagination.module.css";

export const Pagination = ({ pages, index, setIndex }) => {
  return (
    <div className={styles.pagination}>
      <span>Página</span>
      <input
        type="number"
        min={1}
        max={pages}
        value={index + 1}
        onChange={(e) => setIndex(parseInt(e.target.value) - 1)}
      />
      <span>de {pages}</span>
    </div>
  );
};
