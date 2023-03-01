import React, { useState, useEffect } from "react";
import { Grid, CircularProgress, Typography } from "@material-ui/core";
import { useStyles } from "../../../style/textModeration.js";
import SnackBar from "../../core/SnackBar";
import ModerationMethods from "./ModerationMethods";
import SwitchButton from "../../core/SwitchButton";
import FilterCard from "./FilterCard";
import profanityFunction from "../../../utils/profanityFunction";
import { getCookie } from "../../../services/localStorage";
import { siftNinjaProps } from "./automaticModeration/siftNinjaService/ServiceProperties";

import {
  fetchWords,
  constantBoolean,
  selectedAppFromLS,
  filterFunction,
  filterEventHandler,
  getProfanityWordsByLanguage,
  pnFunctionFilterStatus,
} from "../../../utils/helpers";

import {
  fetchPubNubFunction,
  createPubNubFunction,
  startPubNubFunction,
  stopPubNubFunction,
  createPubNubEventHandler,
  updatePubNubEventHandler,
} from "../../../services/pubnub";

import { handleImageModerationSave } from "../../../utils/imageModeration";

const TextModeration = () => {
  const classes = useStyles();

  const [profanityList, setProfanityList] = useState({
    English: "",
    Hindi: "",
    French: "",
    Portugese: "",
    Spanish: "",
  });

  const [state, setState] = useState({
    wordList: {
      wordListChannel: "*",
      applyToAllChannelIdsWordlist: true,
      wordsListPatternError: false,
      wordListLanguage: "English",
      wordListModType: "Mask-word",
      wordListReRouteMessages: false,
      wordsListMaskCharError: false,
      wordsListChannelError: false,
      wordListCharacterToMaskWith: "*",
    },

    automaticDetection: {
      applyToAllChannelIdsAutomatic: true,
      toolForAutomaticDetection: "tisane",

      // old format
      // siftNinjaAccountName: "",
      // siftNinjaChannelName: "",
      // siftNinjaApiKey: "",
      // siftNinjaRiskFactorThresholdVulgar: 0,
      // siftNinjaRiskFactorThresholdSexting: 0,
      // siftNinjaRiskFactorThresholdRacism: 0,
      // new format
      siftNinjaProps,
      // looks like
      // siftNinja: {
      //   accountName: 'qq',
      //   channelName: 'ww',
      //   apiKey: 'ee',
      //   riskFactorThresholdVulgar: '0.25',
      //   riskFactorThresholdSexting: '0.5',
      //   riskFactorThresholdRacism: '0.75'
      // },

      tisaneRiskFactorThresholdBigotry: 0,
      tisaneRiskFactorThresholdCyberBullying: 0,
      tisaneRiskFactorThresholdCriminalActivity: 0,
      tisaneRiskFactorThresholdSexualAdvances: 0,
      tisaneRiskFactorThresholdProfanity: 0,
      tisaneApiKey: "",
      tisaneLanguage: "Autodetect",

      automaticDetectionChannel: "*",
      automaticChannelError: false,
      automaticMaskCharError: false,
      automaticDetectionReRouteMessages: false,
      automaticDetectionModType: "mask-message",
      automaticDetectionCharacterToMaskWith: "*",
    },

    textModerationToggle: false,
    wordListProfanity: false,
    automaticProfanity: false,
    channelOnChange: false,
    saveLoading: false,
    initialLoading: true,
    errorStatus: false,
    successStatus: false,
    errorMsg: "",
    successMsg: "",
  });

  const checkForWordListProfanity = constantBoolean(state.wordListProfanity);
  const checkForTextModerationToogle = constantBoolean(state.textModerationToggle);

  const badWordsByLanguage = getProfanityWordsByLanguage(
    profanityList,
    state.wordList.wordListLanguage
  );

  const handleChange = (e) => {
    setState({ ...state, textModerationToggle: e.target.checked });
  };

  const handleClick = (name) => (e) => {
    e.preventDefault();
    if (name === "wordListMethod") {
      setState({
        ...state,
        wordListProfanity: "true",
        automaticProfanity: "false",
      });
    } else if (name === "automaticMethod") {
      setState({
        ...state,
        wordListProfanity: "false",
        automaticProfanity: "true",
      });
    }
  };

  useEffect(() => {
    setState((previousState) => ({
      ...previousState,
      errorStatus: false,
      errorMsg: "",
      successStatus: false,
      successMsg: "",
    }));
  }, [state.wordListProfanity, state.automaticProfanity]);

  useEffect(() => {
    const regexForValidateWordList = /^.*?[,.]$/;
    const wordListValidationResult = regexForValidateWordList.test(badWordsByLanguage.trim());
    if (wordListValidationResult) {
      setState((beforeState) => ({
        ...beforeState,
        errorStatus: true,
        errorMsg: `Invalid word list pattern, word list
          should not end with period or delimiter`,
        wordList: {
          ...beforeState.wordList,
          wordsListPatternError: true,
        },
      }));
    } else {
      setState((previous) => ({
        ...previous,
        errorStatus: false,
        errorMsg: "",
        wordList: {
          ...previous.wordList,
          wordsListPatternError: false,
        },
      }));
    }
  }, [badWordsByLanguage]);

  useEffect(() => {
    setState((before) => ({
      ...before,
      errorStatus: false,
      errorMsg: "",
      wordList: {
        ...before.wordList,
        wordsListMaskCharError: false,
      },
    }));
    if (
      !state.wordList.wordListCharacterToMaskWith.trim() &&
      state.wordListProfanity &&
      state.wordList.wordListModType === "Mask-word"
    ) {
      setState((prev) => ({
        ...prev,
        errorStatus: true,
        errorMsg: "Please set a making character",
        wordList: {
          ...prev.wordList,
          wordsListMaskCharError: true,
        },
      }));
    }
  }, [
    state.wordList.wordListCharacterToMaskWith,
    state.wordListProfanity,
    state.wordList.wordListModType,
  ]);

  useEffect(() => {
    setState((prevStateValue) => ({
      ...prevStateValue,
      errorStatus: false,
      errorMsg: "Please set a making character",
      automaticDetection: {
        ...prevStateValue.automaticDetection,
        automaticMaskCharError: false,
      },
    }));
    if (
      !state.automaticDetection.automaticDetectionCharacterToMaskWith.trim() &&
      state.automaticProfanity &&
      state.automaticDetection.automaticDetectionModType === "mask-message"
    ) {
      setState((prevValue) => ({
        ...prevValue,
        errorStatus: true,
        errorMsg: "Please set a making character",
        automaticDetection: {
          ...prevValue.automaticDetection,
          automaticMaskCharError: true,
        },
      }));
    }
  }, [
    state.automaticDetection.automaticDetectionCharacterToMaskWith,
    state.automaticProfanity,
    state.automaticDetection.automaticDetectionModType,
  ]);

  useEffect(() => {
    if (state.channelOnChange) {
      if (
        checkForWordListProfanity
          ? !state.wordList.wordListChannel.length
          : !state.automaticDetection.automaticDetectionChannel.length
      ) {
        setState((previousValue) => ({
          ...previousValue,
          errorStatus: true,
          saveLoading: false,
          wordList: {
            ...previousValue.wordList,
            wordsListChannelError: checkForWordListProfanity ? true : false,
          },
          automaticDetection: {
            ...previousValue.automaticDetection,
            automaticChannelError: checkForWordListProfanity ? false : true,
          },
          errorMsg: "Channel name is required",
          successMsg: "",
          successStatus: false,
        }));
      } else {
        setState((preValue) => ({
          ...preValue,
          errorStatus: false,
          saveLoading: false,
          errorMsg: "",
          successMsg: "",
          wordList: {
            ...preValue.wordList,
            wordsListChannelError: false,
          },
          automaticDetection: {
            ...preValue.automaticDetection,
            automaticChannelError: false,
          },
          successStatus: false,
        }));
      }
    }
  }, [
    state.wordList.wordListChannel,
    checkForWordListProfanity,
    state.channelOnChange,
    state.automaticDetection.automaticDetectionChannel,
  ]);

  useEffect(() => {
    const selectedApp = selectedAppFromLS();
    const headerToken = getCookie("token");
    (async () => {
      if (selectedApp) {
        try {
          // attempt to retreive PN Function from the PN key set
          const fetchFunctionsResponse = await fetchPubNubFunction(
            selectedApp.id,
            headerToken,
            true
          );

          if (filterFunction(fetchFunctionsResponse, selectedApp).length) {
            // the PN Function module was found
            const eventHandlers = filterFunction(fetchFunctionsResponse, selectedApp)[0]
              .event_handlers;

            const eventHandler = filterEventHandler(
              eventHandlers,
              filterFunction(fetchFunctionsResponse, selectedApp)
            );

            if (eventHandler.length > 0) {
              // the PN Function module has the event handler
              const data = pnFunctionFilterStatus(eventHandler[0].code);

              const { wordListProfanity, automaticProfanity, textModerationToggle } = data;

              const {
                wordListReRouteMessages,
                wordListModType,
                applyToAllChannelIdsWordlist,
                wordListCharacterToMaskWith,
                englishProfanity,
                hindiProfanity,
                frenchProfanity,
                spanishProfanity,
                portugeseProfanity,
              } = data.wordList;

              const {
                automaticDetectionReRouteMessages,
                automaticDetectionModType,
                applyToAllChannelIdsAutomatic,
                automaticDetectionCharacterToMaskWith,
                toolForAutomaticDetection,

                // siftNinjaRiskFactorThresholdVulgar,
                // siftNinjaRiskFactorThresholdSexting,
                // siftNinjaRiskFactorThresholdRacism,
                // siftNinjaAccountName,
                // siftNinjaChannelName,
                // siftNinjaApiKey,
                siftNinjaProps,

                tisaneRiskFactorThresholdBigotry,
                tisaneRiskFactorThresholdCyberBullying,
                tisaneRiskFactorThresholdCriminalActivity,
                tisaneRiskFactorThresholdSexualAdvances,
                tisaneRiskFactorThresholdProfanity,
                tisaneApiKey,
                tisaneLanguage,
              } = data.automaticDetection;

              setState((prev) => ({
                ...prev,
                wordList: {
                  ...prev.wordList,
                  wordListChannel: eventHandler[0].channels,
                  wordListModType,
                  applyToAllChannelIdsWordlist,
                  wordListCharacterToMaskWith,
                  wordListReRouteMessages,
                },
                automaticDetection: {
                  automaticDetectionChannel: eventHandler[0].channels,
                  automaticDetectionReRouteMessages,
                  automaticDetectionModType,
                  applyToAllChannelIdsAutomatic,
                  automaticDetectionCharacterToMaskWith,
                  toolForAutomaticDetection,

                  // siftNinjaRiskFactorThresholdVulgar,
                  // siftNinjaRiskFactorThresholdSexting,
                  // siftNinjaRiskFactorThresholdRacism,
                  // siftNinjaAccountName,
                  // siftNinjaChannelName,
                  // siftNinjaApiKey,
                  siftNinjaProps,

                  tisaneRiskFactorThresholdBigotry,
                  tisaneRiskFactorThresholdCyberBullying,
                  tisaneRiskFactorThresholdCriminalActivity,
                  tisaneRiskFactorThresholdSexualAdvances,
                  tisaneRiskFactorThresholdProfanity,
                  tisaneApiKey,
                  tisaneLanguage,
                },
                initialLoading: false,
                textModerationToggle: textModerationToggle,
                wordListProfanity: wordListProfanity,
                automaticProfanity: automaticProfanity,
              }));
              setProfanityList((prev) => ({
                ...prev,
                English: englishProfanity.split("|").join(","),
                Hindi: hindiProfanity.split("|").join(","),
                Portugese: portugeseProfanity.split("|").join(","),
                French: frenchProfanity.split("|").join(","),
                Spanish: spanishProfanity.split("|").join(","),
              }));
            } else {
              setState((prevState) => ({
                ...prevState,
                wordList: { ...prevState.wordList },
                initialLoading: false,
              }));
            }
          } else {
            setState((previous) => ({
              ...previous,
              wordList: { ...previous.wordList },
              initialLoading: false,
            }));
          }
        } catch (error) {
          setState({
            ...state,
            errorStatus: true,
            saveLoading: false,
            errorMsg: error.message,
            successMsg: "",
            successStatus: false,
            initialLoading: false,
          });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function SaveEventHandler(app, eventHandler, block_id, key_id, token) {
    const {
      wordListChannel,
      applyToAllChannelIdsWordlist,
      wordListCharacterToMaskWith,
      wordListModType,
      wordListReRouteMessages,
    } = state.wordList;

    const {
      automaticDetectionModType,
      automaticDetectionChannel,
      applyToAllChannelIdsAutomatic,
      automaticDetectionReRouteMessages,
      automaticDetectionCharacterToMaskWith,
      toolForAutomaticDetection,

      // siftNinjaRiskFactorThresholdVulgar,
      // siftNinjaRiskFactorThresholdSexting,
      // siftNinjaRiskFactorThresholdRacism,
      // siftNinjaAccountName,
      // siftNinjaChannelName,
      // siftNinjaApiKey,
      siftNinjaProps,

      tisaneRiskFactorThresholdBigotry,
      tisaneRiskFactorThresholdCyberBullying,
      tisaneRiskFactorThresholdCriminalActivity,
      tisaneRiskFactorThresholdSexualAdvances,
      tisaneRiskFactorThresholdProfanity,
      tisaneApiKey,
      tisaneLanguage,
    } = state.automaticDetection;

    const { wordListProfanity, automaticProfanity, textModerationToggle } = state;

    const config = {
      type: "js",
      key_id: key_id,
      block_id: block_id,
      id: eventHandler ? eventHandler[0].id : null,
      channels: checkForWordListProfanity ? wordListChannel : automaticDetectionChannel,

      code: `${profanityFunction({
        wordListProfanity,
        automaticProfanity,
        applyToAllChannelIdsAutomatic,
        applyToAllChannelIdsWordlist,
        textModerationToggle,
        profanityList,
        wordListModType,
        wordListReRouteMessages,
        wordListCharacterToMaskWith,
        automaticDetectionModType,
        automaticDetectionReRouteMessages,
        automaticDetectionCharacterToMaskWith,
        toolForAutomaticDetection,

        // siftNinjaRiskFactorThresholdVulgar,
        // siftNinjaRiskFactorThresholdSexting,
        // siftNinjaRiskFactorThresholdRacism,
        // siftNinjaAccountName,
        // siftNinjaChannelName,
        // siftNinjaApiKey,
        siftNinjaProps,

        tisaneRiskFactorThresholdBigotry,
        tisaneRiskFactorThresholdCyberBullying,
        tisaneRiskFactorThresholdCriminalActivity,
        tisaneRiskFactorThresholdSexualAdvances,
        tisaneRiskFactorThresholdProfanity,
        tisaneApiKey,
        tisaneLanguage,
      })}`,

      event: "js-before-publish",
      log_level: "debug",
      name: `BLOCK-${block_id}`,
      output: "output-0.5823105682419438",
    };

    try {
      if (eventHandler) {
        // update pn function event handler
        await updatePubNubEventHandler(config, token);

        if (!checkForTextModerationToogle) {
          await stopPubNubFunction({ key_id: key_id, block_id: block_id }, token);

          await handleImageModerationSave(app, token, {
            state,
            setState,
            uiPagecall: "textModeration",
          });

          return setState({
            ...state,
            errorStatus: false,
            saveLoading: false,
            errorMsg: "",
            successMsg: "Successfully updated",
            successStatus: true,
          });
        }

        await startPubNubFunction({ key_id: key_id, block_id: block_id }, token);
      } else {
        // create pn function event handler
        await createPubNubEventHandler(config, token);

        if (checkForTextModerationToogle) {
          await startPubNubFunction({ key_id: key_id, block_id: block_id }, token);
        }
      }

      await handleImageModerationSave(app, token, {
        state,
        setState,
        uiPagecall: "textModeration",
      });

      setState({
        ...state,
        errorStatus: false,
        saveLoading: false,
        errorMsg: "",
        successMsg: "Successfully updated",
        successStatus: true,
      });
    } catch (error) {
      setState({
        ...state,
        errorStatus: true,
        saveLoading: false,
        errorMsg: error.message,
        successMsg: "",
        successStatus: false,
      });
    }
  }

  const defaultWords = async (language) => {
    let response = await fetchWords(`${process.env.PUBLIC_URL}/words/${language}.txt`);
    setProfanityList({ ...profanityList, [language]: response });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (state.errorStatus) {
      return;
    }

    setState({ ...state, saveLoading: true });
    const token = getCookie("token");
    const app = selectedAppFromLS();

    if (app) {
      try {
        const functionResponse = await fetchPubNubFunction(app.id, token);
        const key_id = app.id;

        if (filterFunction(functionResponse, app).length) {
          const blockId = filterFunction(functionResponse, app)[0].id;
          const eventHandlerList = filterFunction(functionResponse, app)[0].event_handlers;
          const eventHandler = filterEventHandler(
            eventHandlerList,
            filterFunction(functionResponse, app)
          );

          await SaveEventHandler(app, eventHandler, blockId, key_id, token);
          // if (eventHandler.length === 0) {
          //   await CreateEventHandler(app, blockId, key_id, token);
          // }
          // else {
          //   await UpdateEventHandler(app, eventHandler, blockId, key_id, token);
          // }
        } else {
          const config = {
            key_id: app.id,
            name: `KEY-${app.id}`,
            description: "This is a profanity function",
          };
          await createPubNubFunction(config, token);
          const fetchFunctions = await fetchPubNubFunction(app.id, token);
          const blockId = filterFunction(fetchFunctions, app)[0].id;

          await SaveEventHandler(app, null, blockId, key_id, token);
          // await CreateEventHandler(app, blockId, key_id, token);
          setState((previous) => ({
            ...previous,
            initialLoading: false,
          }));
        }
      } catch (error) {
        setState({
          ...state,
          errorStatus: true,
          saveLoading: false,
          errorMsg: error.message,
          successMsg: "",
          successStatus: false,
        });
      }
    }
  };

  return (
    <>
      {state.successStatus && <SnackBar status="success" msg={state.successMsg} />}
      {state.errorStatus && <SnackBar status="error" msg={state.errorMsg} />}
      <Typography testid="title" variant="h6" className={classes.title}>
        Text Moderation
        <SwitchButton
          checked={constantBoolean(state.textModerationToggle)}
          onChange={handleChange}
        />
      </Typography>
      <br />
      <Typography testid="sub_title" className={classes.subTitle}>
        Profanity detection method
      </Typography>

      <FilterCard state={state} handleClick={handleClick} />
      <br />
      {state.initialLoading && (
        <Grid container justify="center">
          <CircularProgress size={65} thickness={4} color="primary" className={classes.loader} />
        </Grid>
      )}
      <br />
      <ModerationMethods
        handleSave={handleSave}
        state={state}
        profanityList={profanityList}
        defaultWords={defaultWords}
        setState={setState}
        setProfanityList={setProfanityList}
      />
    </>
  );
};

export default TextModeration;
