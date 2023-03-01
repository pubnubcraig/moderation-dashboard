import { constantBoolean, groupLanguageWords } from "../../../../../utils/helpers.js";
import { FilterConditionForWordList } from "../../../../../utils/wordlist";
import { FilterConditionForAutomatic } from "../../../../../utils/automaticTextModeration/filterConditionForAutomatic";

export const getServiceFunctionCode = (data) => {
  return `
        const accountName = '${data.siftNinjaAccountName}';
        const channelName = '${data.siftNinjaChannelName}';
        const apiKey = '${data.siftNinjaApiKey}'
        const basicAuth = require('codec/auth');
        const authorization = basicAuth.basic(accountName + '/' + channelName,apiKey);
        const http_options = {
            "method": "POST",
            "headers": {
                "Content-Type": "application/json",
                "Authorization": authorization
            },
            "body": JSON.stringify({
                "text": message.text,
                "user_id": message.user_id,
                "user_display_name": message.user_display_name
            })
        };
        const reasons = [];
        const url = "https://" + accountName + ".siftninja.com/api/v1/channel/" + channelName + "/sifted_data";
        return xhr.fetch(url, http_options).then(response => {
        var body = JSON.parse(response.body);
        var thirdPartyResponse = (response.status === 200 ? body : { error: body });
        const vulgarity = thirdPartyResponse.tags.vulgar === null?0:thirdPartyResponse.tags.vulgar;
        const racist = thirdPartyResponse.tags.racist === null?0:thirdPartyResponse.tags.racist;
        const sexting = thirdPartyResponse.tags.sexting === null?0:thirdPartyResponse.tags.sexting;
        console.log('Vulgarity score :', vulgarity, 'Racism score :', racist, 'Sexting score :', sexting);
        const checkThresholdForThirdParty = vulgarity>'${data.siftNinjaRiskFactorThresholdVulgar}'
        || racist>'${data.siftNinjaRiskFactorThresholdRacism}'
        || sexting>'${data.siftNinjaRiskFactorThresholdSexting}';
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
    wordListProfanity,
    automaticProfanity,
    textModerationToggle,

    siftNinjaProps,
    // siftNinjaAccountName,
    // siftNinjaChannelName,
    // siftNinjaApiKey,
    // siftNinjaRiskFactorThresholdVulgar,
    // siftNinjaRiskFactorThresholdSexting,
    // siftNinjaRiskFactorThresholdRacism,
  } = data;

  let english = data.profanityList["English"];
  let hindi = data.profanityList["Hindi"];
  let spanish = data.profanityList["Spanish"];
  let french = data.profanityList["French"];
  let portugese = data.profanityList["Portugese"];

  function noProfanityFilterSelected() {
    return `if(request && request.ok){
            return request.ok();
        }`;
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
                    }
                },
            };
        }
    `;

  debugger;
  return code;
};
