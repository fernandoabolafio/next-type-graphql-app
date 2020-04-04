import React from "react";
import styled from "styled-components";

function NewUser() {
  function handleSubmit(e) {
    console.log(e);
  }
  return (
    <FormC onSubmit={handleSubmit}>
      <input placeholder={"name"} />
      <input placeholder={"email"} />
      <input placeholder={"password"} />
      <button type="submit">Submit</button>
    </FormC>
  );
}

const FormC = styled.form`
  display: flex;
  flex-direction: column;
`;

export default NewUser;
