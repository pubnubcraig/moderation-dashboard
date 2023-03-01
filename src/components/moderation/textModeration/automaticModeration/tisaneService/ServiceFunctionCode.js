import { constantBoolean, groupLanguageWords } from "../../../../../utils/helpers.js";
import { FilterConditionForWordList } from "../../../../../utils/wordlist";
import { FilterConditionForAutomatic } from "../../../../../utils/automaticTextModeration/filterConditionForAutomatic";

export const getServiceFunctionCode = (data) => {
  return `
    const apiKey = '${data.tisaneApiKey}';
    const abuseTypes = ['bigotry', 'personal_attack', 'criminal_activity', 'sexual_advances', 'profanity'];
    
    const serverityTypeObject = {
        extreme:0.25,
        high:0.50,
        medium:0.75,
        low:1,
        none:0
    };

    const abuseTypeObject = {
        bigotry:${data.tisaneRiskFactorThresholdBigotry},
        criminal_activity:${data.tisaneRiskFactorThresholdCriminalActivity},
        sexual_advances:${data.tisaneRiskFactorThresholdSexualAdvances},
        personal_attack:${data.tisaneRiskFactorThresholdCyberBullying},
        profanity:${data.tisaneRiskFactorThresholdProfanity}
    };

    const url = "https://api.tisane.ai/parse";
    const http_options = {
        "method": "POST",
        "headers": {
            "Ocp-Apim-Subscription-Key": apiKey
        },
        "body": JSON.stringify({
            "language": "${data.selectedLanguage}", // or whatever language you use
            "content": message.text,
            "settings": {"snippets": true, "format":"dialogue"}
        }),
        "timeout" : 5000
    };

    return xhr.fetch(url, http_options).then(response => {
        const body = JSON.parse(response.body);
        const thirdPartyResponse = (response.status === 200 ? body : { error: body });
        let checkThresholdForThirdParty = false;
        const reasons = [];
        const serverityTypes = [];

        // Check each abuse type returned against the threshold
        if (thirdPartyResponse.abuse && Array.isArray(thirdPartyResponse.abuse) && thirdPartyResponse.abuse.length) {
        console.log('text moderation abuse analysis: ', thirdPartyResponse.abuse);

        thirdPartyResponse.abuse.forEach((element)=>{
            serverityTypes.push(element.severity);

            if (abuseTypeObject[element.type] !== 0) {
                if (abuseTypes.includes(element.type) && abuseTypeObject[element.type] >= serverityTypeObject[element.severity]) {
                    const abuse = element.type.replace(/_/g, ' ');
                    reasons.push(abuse+'; '+ element.severity);
                    
                    if (!checkThresholdForThirdParty) {
                        console.log("Message was flagged by automatic text moderation.");
                        checkThresholdForThirdParty = true;
                    }
                }
            }
        });
      }
    `;
};

export const profanityFunction = (data) => {
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
    siftNinjaRiskFactorThresholdVulgar,
    siftNinjaRiskFactorThresholdSexting,
    siftNinjaRiskFactorThresholdRacism,
    siftNinjaAccountName,
    siftNinjaChannelName,
    siftNinjaApiKey,
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
                if(request && request.ok){
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

  return `function runProfanity(request){
            ${filterConditions()}
            return {
                /**
                 * These objects are persisted values for the Moderation Dashboard UI.
                 * Deleting these settings will require you to reenter them when you 
                 * use the UI to make a change.
                 */
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
                    siftNinjaRiskFactorThresholdVulgar:'${siftNinjaRiskFactorThresholdVulgar}',
                    siftNinjaRiskFactorThresholdSexting:'${siftNinjaRiskFactorThresholdSexting}',
                    siftNinjaRiskFactorThresholdRacism:'${siftNinjaRiskFactorThresholdRacism}',
                    siftNinjaAccountName:'${siftNinjaAccountName}',
                    siftNinjaChannelName:'${siftNinjaChannelName}',
                    siftNinjaApiKey:'${siftNinjaApiKey}',
                    tisaneRiskFactorThresholdBigotry:'${tisaneRiskFactorThresholdBigotry}',
                    tisaneRiskFactorThresholdCyberBullying:'${tisaneRiskFactorThresholdCyberBullying}',
                    tisaneRiskFactorThresholdCriminalActivity:'${tisaneRiskFactorThresholdCriminalActivity}',
                    tisaneRiskFactorThresholdSexualAdvances:'${tisaneRiskFactorThresholdSexualAdvances}',
                    tisaneRiskFactorThresholdProfanity:'${tisaneRiskFactorThresholdProfanity}',
                    tisaneApiKey:'${tisaneApiKey}',
                    tisaneLanguage:'${tisaneLanguage}'
                },
            };
        }`;
};
