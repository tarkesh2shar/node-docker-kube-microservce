import axios from "axios";
import { useState } from "react";
export default ({ url, method, body, onSuccess = null }) => {
  const [errors, seterrors] = useState(null);
  const doRequest = async (props = {}) => {
    try {
      seterrors(null);
      const respose = await axios[method](url, { ...body, ...props });
      if (onSuccess) {
        onSuccess(respose.data);
      }
      return respose.data;
    } catch (e) {
      console.log(e.response);
      seterrors(
        <div className="alert alert-danger">
          <h4>Ooops...</h4>
          <ul className="my-0">
            {e.response.data.errors.map((e) => {
              return <p key={e.message}>{e.message}</p>;
            })}
          </ul>
        </div>
      );
    }
  };
  return { doRequest, errors };
};
