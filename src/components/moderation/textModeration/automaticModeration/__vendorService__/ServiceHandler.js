export const handleChange =
  ({ setState, state, name }) =>
  (e, value) => {
    // at the very least, there should be an API Key property
    // replace the suffix 'ApiKey' with whatever term the service uses
    if (name === "__venderName__ApiKey") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          __vendorName__ApiKey: value,
        },
      });
    } else if (name === "__vendorName__Property0") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          __vendorName__Property0: value,
        },
      });
    } else if (name === "__vendorName__Property3") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          __vendorName__Property3: value,
        },
      });
    } else if (e.target.name === "__vendorName__Property2") {
      setState({
        ...state,
        automaticDetection: {
          ...state.automaticDetection,
          __vendorName__Property2: e.target.value,
        },
      });
    }
    // repeat and 'else if block' for every property for this service
  };
