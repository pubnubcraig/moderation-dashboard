import React from "react";
import DashboardLayout from "../../layouts/Dashboard";
import TextModeration from "../../components/moderation/textModeration/index";

const TextModerationPage = () => {
  return (
    <>
      <DashboardLayout>
        <TextModeration />
      </DashboardLayout>
    </>
  );
};

export default TextModerationPage;
