import styles from "./LoadingScreen.module.css";
import iconLogo from "../../assets/img/logo.png";

export const LoadingScreen = () => {

return (
    <div className={styles.loadingScreen}>
      <img src={iconLogo}  />
      <h3>AquaControl</h3>
    </div>
  );
    
};