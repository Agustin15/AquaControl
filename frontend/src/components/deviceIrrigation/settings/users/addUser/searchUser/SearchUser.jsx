import styles from "./SearchUser.module.css";
import iconUser from "../../../../../../assets/img/comunUser.png";
import { useAuth } from "../../../../../../contexts/AuthContext";
import { useEffect, useRef, useState } from "react";
import { fetchGetUsersMatchText } from "./functions.js";

export const SearchUser = ({ valuesForm, setValuesForm, loadingForm }) => {
  const [usersMatch, setUsersMatch] = useState([]);
  const [username, setUsername] = useState("");
  const [errorMatch, setErrorMatch] = useState("");
  const idTimeoutSearchRef = useRef();

  const { updateAccessToken } = useAuth();

  useEffect(() => {
    if (errorMatch.length == 0) return;
    setUsersMatch([]);
  }, [errorMatch]);

  const handleSearchUser = async (event) => {
    const text = event.target.value;
    setUsername(text);
    if (valuesForm.user) setValuesForm({ ...valuesForm, user: null });

    if (text.trim().length == 0) {
      setErrorMatch("");
      setUsersMatch([]);
      return;
    }

    if (idTimeoutSearchRef.current) {
      clearTimeout(idTimeoutSearchRef.current);
    }

    const idTimeoutSearch = setTimeout(async () => {
      const results = await fetchGetUsersMatchText(
        true,
        text,
        updateAccessToken,
        setErrorMatch,
      );

      if (results) setUsersMatch(results);
    }, 800);

    idTimeoutSearchRef.current = idTimeoutSearch;
  };

  return (
    <div className={styles.searchUser}>
      <label>Usuario para vincular al dispositivo</label>

      <input
        disabled={loadingForm}
        value={username}
        type="text"
        placeholder="Ingrese nombre de usuario"
        onChange={(event) => handleSearchUser(event)}
      ></input>

      {errorMatch && <p>{errorMatch}</p>}

      {usersMatch.length > 0 && (
        <ul className={styles.usersMatch}>
          {usersMatch.map((user, index) => (
            <li
              key={index}
              onClick={() => {
                setUsersMatch([]);
                setUsername(user.username);
                setValuesForm({ ...valuesForm, user: user });
              }}
            >
              <img src={iconUser}></img>
              {user.username}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
