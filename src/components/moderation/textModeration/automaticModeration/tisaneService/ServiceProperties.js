import React from "react";
import { Grid, Box, Card, TextField, Select, FormControl, MenuItem } from "@material-ui/core";

import { useStyles } from "../../../../../style/automaticProfanityMethod";
import Slider from "../../../../core/SliderComponent";
import { LightTooltip } from "../../../../../style/tooltip";
import { handleChange } from "./ServiceHandler";

const ServiceProperties = ({ state, setState }) => {
  const {
    tisaneRiskFactorThresholdBigotry,
    tisaneRiskFactorThresholdCyberBullying,
    tisaneRiskFactorThresholdCriminalActivity,
    tisaneRiskFactorThresholdSexualAdvances,
    tisaneRiskFactorThresholdProfanity,
    tisaneApiKey,
    tisaneLanguage,
  } = state.automaticDetection;

  const classes = useStyles();

  const TooltipText = (
    <>
      <span>Sign up with </span>
      <a
        style={{ fontWeight: 600, color: "black", textDecorationLine: "none" }}
        href="https://tisane.ai/signup/"
      >
        Tisane.ai
      </a>
      <span> locate your key under your </span>
      <a
        style={{ fontWeight: 600, color: "black", textDecorationLine: "none" }}
        href="https://tisane.ai/developer/"
      >
        Developer Profile.
      </a>
      <span> Use primary or secondary key. </span>
    </>
  );

  const languageList = ["Autodetect", "English", "Spanish", "Portugese", "French"];

  return (
    <>
      <Card className={classes.cardRoot}>
        <>
          <Box pt={1}>
            <Grid container>
              <Grid item>
                <label testid="tisaneApiKey" className={classes.label}>
                  Tisane.ai API Key
                </label>
              </Grid>
              <Grid item>
                <Box className={classes.infoIcon}>
                  <LightTooltip title={TooltipText} interactive>
                    <img
                      src={process.env.PUBLIC_URL + "/images/info-circle.svg"}
                      alt="info-circle"
                    />
                  </LightTooltip>
                </Box>
              </Grid>
            </Grid>
            <Box pt={1} mb={2}>
              <TextField
                id="tisaneApiKey"
                variant="outlined"
                size="small"
                fullWidth
                name="tisaneApiKey"
                value={tisaneApiKey}
                placeholder="Tisane.ai API key"
                onChange={handleChange({ setState, state })}
              />
            </Box>
          </Box>
          <br />
          <Grid container justify="flex-start">
            <Grid item sm={5}>
              <label testid="lang" className={classes.labelStyle}>
                Language
              </label>
              <Box pt={1} mb={2}>
                <FormControl
                  className={classes.formControl}
                  size="small"
                  placeholder="Langauge"
                  fullWidth
                >
                  <Select
                    id="lang"
                    variant="outlined"
                    MenuProps={{
                      anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "left",
                      },
                      getContentAnchorEl: null,
                    }}
                    value={tisaneLanguage}
                    name="tisaneLanguage"
                    inputProps={{ "aria-label": "Without label" }}
                    onChange={handleChange({ setState, state })}
                  >
                    {languageList.map((language, index) => {
                      return (
                        <MenuItem value={language} key={index}>
                          {language}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Box>
            </Grid>
          </Grid>
          <br />
          <Grid container justify="space-between" spacing={6}>
            <Grid item sm={6} xs={12} md={6} lg={6}>
              <Box pl={1}>
                <label testid="BigotryLevel" className={classes.label}>
                  Filter Level For Bigotry (Hate Speech)
                </label>
                <Box pt={1}>
                  <Slider
                    id="BigotryLevel"
                    value={tisaneRiskFactorThresholdBigotry}
                    name="riskFactorThresholdForBigotry"
                    onChange={handleChange({
                      setState,
                      state,
                      name: "riskFactorThresholdForBigotry",
                    })}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={6} md={6} lg={6}>
              <Box pl={1}>
                <label testid="CyberBullying" className={classes.label}>
                  Filter Level For Personal Attacks (Cyberbullying)
                </label>
                <Box pt={1}>
                  <Slider
                    id="CyberBullying"
                    value={tisaneRiskFactorThresholdCyberBullying}
                    name="riskFactorThresholdForCyberBullying"
                    onChange={handleChange({
                      setState,
                      state,
                      name: "riskFactorThresholdForCyberBullying",
                    })}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12} md={6} lg={6}>
              <Box pl={1}>
                <label testid="criminalLevel" className={classes.label}>
                  Filter Level For Criminal Activity
                </label>
                <Box pt={1}>
                  <Slider
                    id="criminalLevel"
                    value={tisaneRiskFactorThresholdCriminalActivity}
                    name="riskFactorThresholdForCriminalActivity"
                    onChange={handleChange({
                      setState,
                      state,
                      name: "riskFactorThresholdForCriminalActivity",
                    })}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={6} md={6} lg={6}>
              <Box pl={1}>
                <label testid="sexualLevel" className={classes.label}>
                  Filter Level For Sexual Advances
                </label>
                <Box pt={1}>
                  <Slider
                    id="sexualLevel"
                    value={tisaneRiskFactorThresholdSexualAdvances}
                    name="riskFactorThresholdForSexualAdvances"
                    onChange={handleChange({
                      setState,
                      state,
                      name: "riskFactorThresholdForSexualAdvances",
                    })}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={12} md={6} lg={6}>
              <Box pl={1}>
                <label testid="ProfanityLevel" className={classes.label}>
                  Filter Level For Profanity
                </label>
                <Box pt={1}>
                  <Slider
                    id="ProfanityLevel"
                    value={tisaneRiskFactorThresholdProfanity}
                    name="riskFactorThresholdForProfanity"
                    onChange={handleChange({
                      setState,
                      state,
                      name: "riskFactorThresholdForProfanity",
                    })}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
      </Card>
    </>
  );
};

export default ServiceProperties;
