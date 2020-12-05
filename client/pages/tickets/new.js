import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (data) => Router.push("/"),
  });
  return (
    <div>
      <h1>Create a Ticket</h1>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          doRequest();
        }}
      >
        <div className="form_group">
          <label htmlFor="">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form_group">
          <label htmlFor="">Price</label>
          <input
            type="text"
            value={price}
            onBlur={(e) => {
              const value = parseFloat(price);
              if (isNaN(value)) {
                return;
              }
              setPrice(value.toFixed(2));
            }}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
};
export default NewTicket;
