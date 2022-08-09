import React from "react";
import { Grid, Box, Card, Typography, TextField } from "@material-ui/core";
import { useStyles } from "../../../../../style/automaticProfanityMethod";
import Slider from "../../../../core/SliderComponent";
import { LightTooltip } from "../../../../../style/tooltip";
import { handleChange } from "./ServiceHandler";

const ServiceProperties = ({ state, setState }) => {
  const {
    siftNinjaRiskFactorThresholdVulgar,
    siftNinjaRiskFactorThresholdSexting,
    siftNinjaRiskFactorThresholdRacism,
    siftNinjaAccountName,
    siftNinjaChannelName,
    siftNinjaApiKey,
  } = state.automaticDetection;

  const classes = useStyles();

  return (
    <>
      <Card className={classes.cardRoot}>
        {/* beginning of subpage */}
        <>
          <Box pt={1}>
            <Grid container>
              <Grid item>
                <label testid="accountName" className={classes.label}>
                  SiftNinja Account Name
                </label>
              </Grid>
              <Grid item>
                <Box className={classes.infoIcon}>
                  <LightTooltip title="This option is only available for users who have an existing SiftNinja account">
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
                id="siftAccountName"
                variant="outlined"
                size="small"
                placeholder="SiftNinja Account Name"
                fullWidth
                name="siftNinjaAccountName"
                value={siftNinjaAccountName}
                onChange={handleChange({ setState, state })}
              />
            </Box>
          </Box>
          <br />
          <Box pt={1}>
            <Grid container>
              <Grid item>
                <label testId="siftChannelName" className={classes.label}>
                  SiftNinja Channel Name
                </label>
              </Grid>
              <Grid item>
                <Box className={classes.infoIcon}>
                  <LightTooltip title="This option is only available for users who have an existing SiftNinja account">
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
                id="siftChannelName"
                variant="outlined"
                size="small"
                fullWidth
                name="siftNinjaChannelName"
                placeholder="SiftNinja Channel Name"
                value={siftNinjaChannelName}
                onChange={handleChange({ setState, state })}
              />
            </Box>
          </Box>
          <br />
          <Box pt={1}>
            <Grid container>
              <Grid item>
                <label testid="siftApiKey" className={classes.label}>
                  SiftNinja API Key
                </label>
              </Grid>
              <Grid item>
                <Box className={classes.infoIcon}>
                  <LightTooltip title="This option is only available for users who have an existing SiftNinja account">
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
                id="siftApiKey"
                variant="outlined"
                size="small"
                fullWidth
                name="siftNinjaApiKey"
                placeholder="SiftNinja API key"
                value={siftNinjaApiKey}
                onChange={handleChange({ setState, state })}
              />
              <Typography testid="connectivity" align="right" className={classes.testText}>
                Test Conectivity
              </Typography>
            </Box>
          </Box>
          <br />
          <Grid container justify="space-between" spacing={6}>
            <Grid item sm={6} xs={12} md={6} lg={6}>
              <Box>
                <label testid="vulgarRiskFactor" className={classes.label}>
                  SiftNinja Risk Factor Threshold For Vulgarity
                </label>
                <Box pt={1}>
                  <Slider
                    id="vulgarRiskFactor"
                    name="siftNinjaRiskFactorThresholdVulgar"
                    value={siftNinjaRiskFactorThresholdVulgar}
                    onChange={handleChange({
                      setState,
                      state,
                      name: "riskFactorThresholdForVulgar",
                    })}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={6} md={6} lg={6}>
              <Box>
                <label testId="SextingRisk" className={classes.label}>
                  SiftNinja Risk Factor Threshold For Sexting
                </label>
                <Box pt={1}>
                  <Slider
                    id="SextingRisk"
                    name="siftNinjaRiskFactorThresholdSexting"
                    value={siftNinjaRiskFactorThresholdSexting}
                    onChange={handleChange({
                      setState,
                      state,
                      name: "riskFactorThresholdForSexting",
                    })}
                  />
                </Box>
              </Box>
            </Grid>
            <Grid item sm={6} xs={6} md={6} lg={6}>
              <Box>
                <label testid="racismRisk" className={classes.label}>
                  SiftNinja Risk Factor Threshold For Racism
                </label>
                <Box pt={1}>
                  <Slider
                    id="racismRisk"
                    name="siftNinjaRiskFactorThresholdRacism"
                    value={siftNinjaRiskFactorThresholdRacism}
                    onChange={handleChange({
                      setState,
                      state,
                      name: "riskFactorThresholdForRacism",
                    })}
                  />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </>
        {/* )} */}
        {/* end of subpage */}
      </Card>
    </>
  );
};

export default ServiceProperties;
