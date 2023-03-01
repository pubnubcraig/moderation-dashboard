import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  InputAdornment,
  Box,
  Typography,
  IconButton,
  Grid,
} from "@material-ui/core";
import { addEditMessageAction, deleteMessageAction } from "../../services/pubnub";
import { useStyles } from "../../style/messages";
import SnackBar from "../core/SnackBar";

const EditMessage = (props) => {
  const { pubnub, channel, message } = props;
  const [text, setText] = useState("");

  /* - create/add new message feature
    change the default from true to false because we need message text box
    editable so that a new message can be entered at any time
  */
  const [disabled, setDisabled] = useState(false);
  const [displayBox, setDisplayBox] = useState(false);
  const [actionToken, setActionToken] = useState("");
  const classes = useStyles();
  const [alertMessage, setAlertMessage] = useState({
    success: { status: false, msg: "" },
    error: { status: false, msg: "" },
  });

  useEffect(() => {
    if (message.text) {
      let token =
        message.actions &&
        message.actions.updated &&
        message.actions.updated[Object.keys(message.actions.updated)[0]];
      if (token) setActionToken(token[0].actionTimetoken);
      setText(message.text);
      setDisabled(false);
      setDisplayBox(true);
    }
  }, [message]);

  /* - create/add new message feature
    added this function to determine if this is a create or edit message
    and to call the appropriate function to handle that operation
  */
  const createOrUpdateMessage = () => {
    // if actionToken then edit message, else create (send) new message
    actionToken === null || actionToken.length === 0 ? createMessage() : updateMessage();
  };

  const updateMessage = () => {
    setAlertMessage({
      ...alertMessage,
      success: { status: false, msg: "" },
      error: { status: false, msg: "" },
    });
    (async () => {
      try {
        if (actionToken) {
          await deleteMessageAction(pubnub, channel, message.timetoken, actionToken);
        }
        const response = await addEditMessageAction(pubnub, channel, message.timetoken, text);
        setText("");

        /* - create/add new message feature
          we don't want the message text box to ever be disabled because we always
          want to be able to enter a new message
        */
        // setDisabled(true);
        setDisplayBox(false);
        props.updated(message.timetoken, message.actionToken, "updated", response);
      } catch (e) {
        setAlertMessage({
          ...alertMessage,
          success: { status: false, msg: "" },
          error: { status: true, msg: "Failed to edit message" },
        });
      }
    })();
  };

  /* - create/add new message feature
    added this function to create a new message by publishing the 
    entered message on the current channel
  */
  async function createMessage() {
    setAlertMessage({
      ...alertMessage,
      success: { status: false, msg: "" },
      error: { status: false, msg: "" },
    });

    const response = await pubnub.publish({ channel, message: { text: text } });
    if (response) {
      setText("");
      return response.data;
    }

    setAlertMessage({
      ...alertMessage,
      success: { status: false, msg: "" },
      error: { status: true, msg: "Failed to send message" },
    });
  }

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const closeEditing = () => {
    setDisplayBox(false);
    /* - create/add new message feature
      we don't want the message text box to ever be disabled because we always
      want to be able to enter a new message
    */
    // setDisabled(true);
    setText("");
    props.updated(message.timetoken, message.actionToken, "updated", "");
  };
  return (
    <>
      {displayBox ? (
        <Box className={classes.messageBox}>
          <Grid justify="space-between" container>
            <Grid item>
              <Typography className={classes.editMessageHeader}>Edit Message</Typography>
              <Typography className={classes.editMessageFont}>{message.text}</Typography>
            </Grid>
            <Grid item>
              <IconButton id="close" onClick={closeEditing}>
                <img src={process.env.PUBLIC_URL + "/images/close.svg"} alt="close" />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      ) : null}
      {/* {props.messagesLength ? ( */}
      <TextField
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <Button onClick={createOrUpdateMessage}>
                <img src={process.env.PUBLIC_URL + "/images/send-button.svg"} alt="edit" />
              </Button>
            </InputAdornment>
          ),
        }}
        id="message"
        name="message"
        placeholder="Enter your message here"
        variant="outlined"
        fullWidth
        value={text}
        onChange={handleInputChange}
        autoComplete="off"
        disabled={disabled}
      />
      {/* ) : null} */}
      {alertMessage.error.status && <SnackBar msg={alertMessage.error.msg} status={"info"} />}
    </>
  );
};
export default EditMessage;
