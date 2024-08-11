import React from "react";
import NewPassword from "./NewPassword";
import GiveEmail from "./GiveEmail";
const ResetPassword: React.FC = () => {
  const token: string = window.location.search.split("=")[1];

  return <div>{token ? <NewPassword token={token} /> : <GiveEmail />}</div>;
};

export default ResetPassword;
