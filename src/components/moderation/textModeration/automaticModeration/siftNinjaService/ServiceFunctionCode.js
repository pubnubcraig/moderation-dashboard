export const getServiceFunctionCode = (data) => {
  return `const accountName = '${data.siftNinjaAccountName}';
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
        || sexting>'${data.siftNinjaRiskFactorThresholdSexting}';`;
};
