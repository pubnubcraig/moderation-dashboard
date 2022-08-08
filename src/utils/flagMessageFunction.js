import { groupLanguageWords, constantBoolean } from "./helpers";

export default function flagMessageFunction(data) {
  return `function runFlagMessage(request){
    // put the code from below here
    // this is the code that will be in the
    // On Request Function
  }`;
}

// implement the code here then move it into the code string wrapper above
function runFlagMessage(request) {
  // annotate the message that caused this user to be reported
  // probably should be conditional on success of User object being updated
  const actionRes = await pubnub.addMessageAction({
    // '|| ""' option is just to get this to compile - address later
    channel: reportedMessage.channel?.toString() || "",
    messageTimetoken: reportedMessage.timetoken.toString(),
    action: {
      type: "flagged",
      value: reason,
    },
  });

  // add the message to the flagged.[channelid] channel
  // should this happen within the Moderation Dashboard
  //   since it needs to check for "route to flagged channel" option/config???
  const pubRes = await pubnub.publish({
    message: reportedMessage.message,
    // todo: if route to flagged option is configured
    channel: `flagged.${reportedMessage.channel?.toString() || ""}`,
    // what should we capture for this
    // meta: {???}
  });
}
