export const handleChange =
  ({ setState, state, name }) =>
  (e, value) => {
    if (e.target.name === "toolForAutomaticDetection") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          toolForAutomaticDetection: e.target.value,
        },
      });
    } else if (e.target.name === "automaticDetectionChannel") {
      setState({
        ...state,
        channelOnChange: true,
        automaticDetection: {
          ...state.automaticDetection,
          automaticDetectionChannel: e.target.value,
        },
      });
    } else if (e.target.name === "automaticDetectionReRouteMessages") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          automaticDetectionReRouteMessages: e.target.checked,
        },
      });
    } else if (e.target.name === "automaticDetectionModType") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          automaticDetectionModType: e.target.value,
        },
      });
    } else if (e.target.name === "automaticDetectionCharacterToMaskWith") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          automaticDetectionCharacterToMaskWith: e.target.value,
        },
      });
    } else if (name === "applyToAllChannelIdsAutomatic") {
      if (e.target.checked) {
        setState({
          ...state,
          automaticDetection: {
            ...state.automaticDetection,
            automaticDetectionChannel: "*",
            applyToAllChannelIdsAutomatic: e.target.checked,
          },
        });
      } else {
        setState({
          ...state,
          automaticDetection: {
            ...state.automaticDetection,
            applyToAllChannelIdsAutomatic: e.target.checked,
          },
        });
      }
    }
  };
