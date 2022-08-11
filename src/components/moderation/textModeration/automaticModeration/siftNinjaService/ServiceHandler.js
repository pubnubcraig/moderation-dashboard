export const handleChange =
  ({ setState, state, name }) =>
  (e, value) => {
    if (e.target.name === "siftNinjaApiKey") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          siftNinjaApiKey: e.target.value,
        },
      });
    } else if (name === "riskFactorThresholdForVulgar") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          siftNinjaRiskFactorThresholdVulgar: value,
        },
      });
    } else if (name === "riskFactorThresholdForSexting") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          siftNinjaRiskFactorThresholdSexting: value,
        },
      });
    } else if (name === "riskFactorThresholdForRacism") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          siftNinjaRiskFactorThresholdRacism: value,
        },
      });
    } else if (e.target.name === "siftNinjaAccountName") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          siftNinjaAccountName: e.target.value,
        },
      });
    } else if (e.target.name === "siftNinjaChannelName") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          siftNinjaChannelName: e.target.value,
        },
      });
    }
  };
