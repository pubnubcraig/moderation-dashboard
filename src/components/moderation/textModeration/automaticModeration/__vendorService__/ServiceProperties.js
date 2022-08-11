import React from "react";
import { Grid, Box, Card, Typography, TextField } from "@material-ui/core";
import { useStyles } from "../../../../../style/automaticProfanityMethod";
import Slider from "../../../../core/SliderComponent";
import { LightTooltip } from "../../../../../style/tooltip";
import { handleChange } from "./ServiceHandler";

const ServiceProperties = ({ state, setState }) => {
  const {
    // at the very least, there should be an API Key property
    // replace the suffix 'ApiKey' with whatever term the service uses
    // then replace the 'Property#' with the proper property names
    __vendorName__ApiKey,
    __vendorName__Property0,
    __vendorName__Property1,
    __vendorName__Property2,
    // repeat for every property for this service
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
                <label testid="__vendorName__ApiKey" className={classes.label}>
                  __VendorName__ API Key
                </label>
              </Grid>
              <Grid item>
                <Box className={classes.infoIcon}>
                  <LightTooltip title="Property tool tip description goes here">
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
                id="__vendorName__ApiKey"
                variant="outlined"
                size="small"
                fullWidth
                name="__vendorName__ApiKey"
                placeholder="__VendorName__ API key"
                value={__vendorName__ApiKey}
                onChange={handleChange({ setState, state })}
              />
              {/* if able to this is a link to test connectivity to the service with the API key */}
              <Typography testid="connectivity" align="right" className={classes.testText}>
                Test Conectivity
              </Typography>
            </Box>
          </Box>
          <br />
          <Grid container justify="space-between" spacing={6}>
            <Grid item sm={6} xs={12} md={6} lg={6}>
              <Box>
                <label testid="__vendorName__Property0" className={classes.label}>
                  Property0 Display Label
                </label>
                <Box pt={1}>
                  <Slider
                    id="__vendorName__Property0"
                    name="__vendorName__Property0"
                    value={__vendorName__Property0}
                    onChange={handleChange({
                      setState,
                      state,
                      name: "__vendorName__Property0",
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
