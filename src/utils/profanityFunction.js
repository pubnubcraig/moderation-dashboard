import { groupLanguageWords, constantBoolean } from "./helpers";
import { FilterConditionForWordList } from "./wordlist/index";
import { FilterConditionForAutomatic } from "./automaticTextModeration/filterConditionForAutomatic";
// import { siftNinjaProps } from "../components/moderation/textModeration/automaticModeration/siftNinjaService/ServiceProperties";

export default function profanityFunction(data) {
  const {
    wordListModType,
    wordListReRouteMessages,
    applyToAllChannelIdsWordlist,
    applyToAllChannelIdsAutomatic,
    wordListCharacterToMaskWith,
    automaticDetectionModType,
    automaticDetectionReRouteMessages,
    automaticDetectionCharacterToMaskWith,
    toolForAutomaticDetection,

    siftNinjaProps,
    // siftNinjaRiskFactorThresholdVulgar,
    // siftNinjaRiskFactorThresholdSexting,
    // siftNinjaRiskFactorThresholdRacism,
    // siftNinjaAccountName,
    // siftNinjaChannelName,
    // siftNinjaApiKey,

    wordListProfanity,
    automaticProfanity,
    textModerationToggle,
    tisaneRiskFactorThresholdBigotry,
    tisaneRiskFactorThresholdCyberBullying,
    tisaneRiskFactorThresholdCriminalActivity,
    tisaneRiskFactorThresholdSexualAdvances,
    tisaneRiskFactorThresholdProfanity,
    tisaneApiKey,
    tisaneLanguage,
  } = data;

  let english = data.profanityList["English"];
  let hindi = data.profanityList["Hindi"];
  let spanish = data.profanityList["Spanish"];
  let french = data.profanityList["French"];
  let portugese = data.profanityList["Portugese"];

  function noProfanityFilterSelected() {
    return `
      if (request && request.ok) {
          return request.ok();
      }
    `;
  }

  const checkForWordListProfanity =
    constantBoolean(wordListProfanity) && constantBoolean(textModerationToggle);

  const checkForAutomaticProfanity =
    constantBoolean(automaticProfanity) && constantBoolean(textModerationToggle);

  const filterConditions = () => {
    if (checkForWordListProfanity) {
      return FilterConditionForWordList(data);
    } else if (checkForAutomaticProfanity) {
      return FilterConditionForAutomatic(data);
    } else {
      return noProfanityFilterSelected();
    }
  };

  debugger;
  let code = `
    function runProfanity(request){
        ${filterConditions()}
        return {
          /**
           * These objects are persisted values for the Moderation Dashboard UI.
           * Deleting these settings will require you to reenter them when you 
           * use the UI to make a change.
           */
          
          wordListProfanity: '${wordListProfanity}',
          automaticProfanity: '${automaticProfanity}',
          textModerationToggle: '${textModerationToggle}',
          
          wordList:{
            applyToAllChannelIdsWordlist:'${applyToAllChannelIdsWordlist}',
            wordListReRouteMessages: '${wordListReRouteMessages}',
            wordListModType: '${wordListModType}',
            wordListCharacterToMaskWith:'${wordListCharacterToMaskWith}',
            englishProfanity:'${groupLanguageWords(english)}',
            hindiProfanity: '${groupLanguageWords(hindi)}',
            frenchProfanity: '${groupLanguageWords(french)}',
            spanishProfanity: '${groupLanguageWords(spanish)}',
            portugeseProfanity: '${groupLanguageWords(portugese)}'
          },

          automaticDetection:{
          applyToAllChannelIdsAutomatic: '${applyToAllChannelIdsAutomatic}',
          automaticDetectionReRouteMessages: '${automaticDetectionReRouteMessages}',
          automaticDetectionModType: '${automaticDetectionModType}',
          automaticDetectionCharacterToMaskWith:'${automaticDetectionCharacterToMaskWith}',
          toolForAutomaticDetection:'${toolForAutomaticDetection}',

          siftNinjaProps : {
            accountName:'${siftNinjaProps.accountName}',
            channelName:'${siftNinjaProps.channelName}',
            apiKey:'${siftNinjaProps.apiKey}',
            riskFactorThresholdVulgar:'${siftNinjaProps.riskFactorThresholdVulgar}',
            riskFactorThresholdSexting:'${siftNinjaProps.riskFactorThresholdSexting}',
            riskFactorThresholdRacism:'${siftNinjaProps.riskFactorThresholdRacism}',    
          },

          tisaneRiskFactorThresholdBigotry:'${tisaneRiskFactorThresholdBigotry}',
          tisaneRiskFactorThresholdCyberBullying:'${tisaneRiskFactorThresholdCyberBullying}',
          tisaneRiskFactorThresholdCriminalActivity:'${tisaneRiskFactorThresholdCriminalActivity}',
          tisaneRiskFactorThresholdSexualAdvances:'${tisaneRiskFactorThresholdSexualAdvances}',
          tisaneRiskFactorThresholdProfanity:'${tisaneRiskFactorThresholdProfanity}',
          tisaneApiKey:'${tisaneApiKey}',
          tisaneLanguage:'${tisaneLanguage}'
        },
      };
    }
  `;
  debugger;
  return code;
}
