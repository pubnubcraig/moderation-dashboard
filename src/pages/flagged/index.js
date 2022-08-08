import React from "react";
import FlaggedListing from "../../components/channels/FlaggedListing";
import DashboardLayout from "../../layouts/Dashboard";

const FlaggedMessages = () => {
  return (
    <>
      <DashboardLayout>
        <FlaggedListing />
      </DashboardLayout>
    </>
  );
};
export default FlaggedMessages;
