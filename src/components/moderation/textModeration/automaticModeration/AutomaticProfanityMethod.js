import React from "react";
import {
  Grid,
  Button,
  Box,
  Card,
  Chip,
  Typography,
  TextField,
  Select,
  Checkbox,
  CircularProgress,
  FormControl,
  MenuItem,
} from "@material-ui/core";

import { useStyles } from "../../../../style/automaticProfanityMethod";
import { constantBoolean } from "../../../../utils/helpers";
import { LightTooltip } from "../../../../style/tooltip";
import { handleChange } from "./AutomaticHandler";

// Third Party Service Property Components
import SiftNinjaServiceProperties from "./siftNinjaService/ServiceProperties";
import TisaneServiceProperties from "./tisaneService/ServiceProperties";

const AutomaticProfanityMethod = ({ state, setState, handleSave }) => {
  const {
    toolForAutomaticDetection,
    automaticMaskCharError,
    automaticChannelError,
    automaticDetectionChannel,
    automaticDetectionReRouteMessages,
    automaticDetectionReRouteFlaggedMessages,
    automaticDetectionModType,
    applyToAllChannelIdsAutomatic,
    automaticDetectionCharacterToMaskWith,
  } = state.automaticDetection;

  const classes = useStyles();
  const checkboxForReroute = constantBoolean(automaticDetectionReRouteMessages);
  const checkboxForRerouteFlagged = constantBoolean(automaticDetectionReRouteFlaggedMessages);
  const checkForApplyToAllChannelIds = constantBoolean(applyToAllChannelIdsAutomatic);

  return (
    <>
      <Card className={classes.cardRoot}>
        <Box>
          <Grid container>
            <Grid item>
              <label testId="Channel_Id" className={classes.label}>
                Channel ID
              </label>
            </Grid>
            <Grid item>
              <Box className={classes.infoIcon}>
                <LightTooltip title="Note: Please add a Channel ID or a Channel pattern. eg. channel.* OR pubNub. Channel ID pattern applies to BOTH text & image moderation if both are enabled.">
                  <img src={process.env.PUBLIC_URL + "/images/info-circle.svg"} alt="info-circle" />
                </LightTooltip>
              </Box>
            </Grid>
          </Grid>

          <Box pt={1} mb={2}>
            <TextField
              id="channelId"
              variant="outlined"
              placeholder="Enter channel or channel pattern here Under18.*, Under18"
              size="small"
              fullWidth
              disabled={checkForApplyToAllChannelIds}
              error={automaticChannelError}
              name="automaticDetectionChannel"
              value={automaticDetectionChannel}
              onChange={handleChange({ setState, state })}
            />
          </Box>
        </Box>
        <Grid item>
          <Grid container justify="flex-start">
            <Grid item>
              <Checkbox
                id="applyAll"
                checked={checkForApplyToAllChannelIds}
                onChange={handleChange({
                  setState,
                  state,
                  name: "applyToAllChannelIdsAutomatic",
                })}
              />
            </Grid>
            <Grid item>
              <Box pt={1} pl={1}>
                <Typography testId="applyAll_channel" variant="body1">
                  Apply to All Channel IDs
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <br />
        <Grid container justify="flex-start">
          <Grid item sm={12}>
            <label testId="SelectToolLabel" className={classes.label}>
              Select third party tool for Automatic Detection
            </label>
            <Box pt={1} mb={2}>
              <FormControl size="small" fullWidth>
                <Select
                  id="selectTool"
                  variant="outlined"
                  name="toolForAutomaticDetection"
                  value={toolForAutomaticDetection}
                  onChange={handleChange({ setState, state })}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                >
                  <MenuItem value="tisane">Tisane.ai</MenuItem>
                  <MenuItem value="siftninja">SiftNinja</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
        </Grid>
        <br />

        {/* Third-Party ServiceProperties components go here */}

        {/* SiftNinja Service Properties Page */}
        {toolForAutomaticDetection === "siftninja" && (
          <>
            <SiftNinjaServiceProperties state={state} setState={setState} />
          </>
        )}
        <br />

        {/* Tisane.ai Service Properties Page */}
        {toolForAutomaticDetection === "tisane" && (
          <>
            <TisaneServiceProperties state={state} setState={setState} />
          </>
        )}

        {/* end of subpage */}

        <Grid container justify="flex-start" spacing={6}>
          <Grid item sm={6} md={6}>
            <label testid="blockOrMask" className={classes.label}>
              When profanity is detected
            </label>
            <Box pt={1} mb={2}>
              <FormControl size="small" fullWidth>
                <Select
                  id="blockOrMask"
                  variant="outlined"
                  value={automaticDetectionModType}
                  name="automaticDetectionModType"
                  onChange={handleChange({ setState, state })}
                  MenuProps={{
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left",
                    },
                    getContentAnchorEl: null,
                  }}
                  inputProps={{ "aria-label": "Without label" }}
                >
                  <MenuItem value="mask-message">Mask Message</MenuItem>
                  <MenuItem value="block-message">Block Message</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Grid>
          <Grid item sm={6} md={6}>
            {automaticDetectionModType === "mask-message" && (
              <>
                <Grid container>
                  <Grid item>
                    <label testid="setChar" className={classes.label}>
                      Set a masking character
                    </label>
                  </Grid>
                  <Grid item>
                    <Box className={classes.infoIcon}>
                      <LightTooltip title="Note: Default value will be *">
                        <img
                          src={process.env.PUBLIC_URL + "/images/info-circle.svg"}
                          alt="info-circle"
                        />
                      </LightTooltip>
                    </Box>
                  </Grid>
                </Grid>
                <Box pt={1}>
                  <TextField
                    id="setChar"
                    size="small"
                    placeholder="Set"
                    error={automaticMaskCharError}
                    inputProps={{ maxLength: 1 }}
                    className={classes.languageWords}
                    value={automaticDetectionCharacterToMaskWith}
                    name="automaticDetectionCharacterToMaskWith"
                    onChange={handleChange({ setState, state })}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
              </>
            )}
          </Grid>
        </Grid>
        <br />
        <Grid container>
          <Grid item>
            <Grid container justify="flex-start">
              <Grid item>
                <Checkbox
                  id="reRouteBanned"
                  name="automaticDetectionReRouteMessages"
                  onChange={handleChange({ setState, state })}
                  checked={checkboxForReroute}
                />
              </Grid>
              <Grid item>
                <Box pt={1} pl={1}>
                  <Typography testid="reRouteMsg" variant="body1">
                    Route banned messages to
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Box>
              <Chip className={classes.reroute} label={"banned." + automaticDetectionChannel} />
            </Box>
          </Grid>
        </Grid>
        <Grid container>
          <Grid item>
            <Grid container justify="flex-start">
              <Grid item>
                <Checkbox
                  id="reRouteFlagged"
                  name="automaticDetectionReRouteFlaggedMessages"
                  onChange={handleChange({ setState, state })}
                  checked={checkboxForRerouteFlagged}
                />
              </Grid>
              <Grid item>
                <Box pt={1} pl={1}>
                  <Typography testid="reRouteMsg" variant="body1">
                    Route flagged messages to
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Box>
              <Chip className={classes.reroute} label={"flagged." + automaticDetectionChannel} />
            </Box>
          </Grid>
        </Grid>
        <br />
        <Grid container justify="space-between" spacing={3}>
          <Grid item></Grid>
          <Grid item>
            <Button
              id="save"
              disabled={state.saveLoading}
              className={classes.saveButtonStyle}
              onClick={handleSave}
              variant="contained"
            >
              {state.saveLoading ? (
                <CircularProgress
                  size={25}
                  thickness={4}
                  color="primary"
                  className={classes.loaderStyle}
                />
              ) : (
                <></>
              )}
              Save
            </Button>
          </Grid>
        </Grid>
      </Card>
    </>
  );
};

export default AutomaticProfanityMethod;
