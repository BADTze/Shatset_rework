export const getToken = async () => {
    try {
      const response = await fetch(
        "http://10.10.2.70:3008/api/gopro/v2/db/generate-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          redirect: "follow",
        }
      );
  
      if (!response.ok) {
        return null;
      }
      const responseJson = await response.json();
      return responseJson?.data?.token;
    } catch (error) {
      return null;
    }
  };
  
  export const getHistorianData = async <T>(params: { query: string }) => {
    const historianApiUrl = "http://10.10.2.70:3008/api/gopro/v2/db/historian";
    const token = await getToken();
  
    const response = await fetch(historianApiUrl, {
      body: JSON.stringify({
        query: params.query,
        token: token || "",
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
  
    const responseJson: T[] = await response.json();
  
    if (!response.ok) {
      console.error(responseJson)
      throw new Error("Failed to fetch historian data");
    }
    return responseJson;
  };
  
  export const getDynamicForm = async <T>(params: { query: string }) => {
    const historianApiUrl = "http://10.10.2.70:3008/api/gopro/v2/db/aio_iot_engineering";
    const token = await getToken();
  
    const response = await fetch(historianApiUrl, {
      body: JSON.stringify({
        query: params.query,
        token: token || "",
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
  
    const responseJson: T[] = await response.json();
  
    if (!response.ok) {
      console.error(responseJson)
      throw new Error("Failed to fetch historian data");
    }
    return responseJson;
  };