const localhostBackend = import.meta.env.VITE_BACKEND_LOCALHOST;
import { getAuthTokenSaved } from "../../../../../../securityStorage.js";

export const fetchGetUsersMatchText = async (
  retry,
  text,
  updateAccessToken,
  setErrorMatch,
) => {
  try {
    setErrorMatch("");
    const accessToken = await getAuthTokenSaved("accessToken");

    const response = await fetch(
      localhostBackend +
        "/api/user/usersMatchByText/" +
        encodeURIComponent(text),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 401 && retry == true) {
        await updateAccessToken();
        return fetchGetUsersMatchText(true);
      }

      throw new Error(result.message);
    }

    return result;
  } catch (error) {
    setErrorMatch(error.message);
  }
};
