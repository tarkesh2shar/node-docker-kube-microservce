import React, { useState } from "react";
import Router from "next/router";
import useRequest from "../../hooks/use-request";
export default () => {
  const [email, setEmail] = useState("");
  const [password, setpassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: `/api/users/signup`,
    method: "post",
    body: {
      email,
      password,
    },
    onSuccess: () => {
      Router.push("/");
    },
  });
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(email, password);
    doRequest();
  };
  // console.log("errors", errors);
  return (
    <form action="" className="container" onSubmit={onSubmit}>
      <h1>Sign up</h1>
      <div className="form-group">
        <label htmlFor="">Email Address</label>
        <input
          type="text"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="">Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
        />
      </div>
      {errors}

      <button className="btn btn-primary">Sign up</button>
    </form>
  );
};
