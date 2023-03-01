import { getServiceFunctionCode as getSiftNinjaServiceFunctionCode } from "../../components/moderation/textModeration/automaticModeration/siftNinjaService/ServiceFunctionCode";
import { getServiceFunctionCode as getTisaneServiceFunctionCode } from "../../components/moderation/textModeration/automaticModeration/tisaneService/ServiceFunctionCode";

export const getSelectedDetectionTool = (data) => {
  if (data.toolForAutomaticDetection === "tisane") {
    data.selectedLanguage = getSelectedLanguage(data.tisaneLanguage);
    return getTisaneServiceFunctionCode(data);
  } else if (data.toolForAutomaticDetection === "siftninja") {
    return getSiftNinjaServiceFunctionCode(data);
  }
};

const getSelectedLanguage = (language) => {
  const languages = {
    Autodetect: "*",
    English: "en",
    Spanish: "es",
    Portugese: "pt",
    French: "fr",
  };

  return languages[language];
};
