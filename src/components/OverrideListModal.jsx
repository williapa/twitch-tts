import React, { useRef, useState, useEffect } from 'react';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Switch,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import AddIcon from "@mui/icons-material/Add";

function OverrideListModal({ initialList = [], open, handleClose }) {
  const [overrideList, setOverrideList] = useState(initialList);
  const [error, setError] = useState(null);
  const [chatName, setChatName] = useState('');
  const allowRef = useRef(null);
  const [allowList, setAllowList] = useState(initialList.filter(({ allow }) => (allow)));
  const [denyList, setDenyList] = useState(initialList.filter(({ allow }) => (!allow)));

  const addName = (chatName) => {
    const existingName = overrideList.find((value) => value.chatName === chatName);
    const allow = allowRef.current.querySelector('[name="allowSwitch"]').checked;
    if (existingName) {
      setError(true);
    } else {
      setError(false);
      setOverrideList([...overrideList, { chatName, allow }]);
      setAllowList([...overrideList, { chatName, allow }].filter(({ allow }) => (allow)));
      setDenyList([...overrideList, { chatName, allow }].filter(({ allow }) => (!allow)));
      setChatName('');
    }
  };

  const deleteEntry = (chatName) => {
    const newOverrideList = overrideList.filter((value) => value.chatName !== chatName);
    setOverrideList(newOverrideList);
    setAllowList(newOverrideList.filter(({ allow }) => (allow)));
    setDenyList(newOverrideList.filter(({ allow }) => (!allow)));
  };

  const deleteList = (allow, both) => {
    if (both) {
      setOverrideList([]);
      setAllowList([]);
      setDenyList([]);
    } else {
      const newOverrideList = overrideList.filter((value) => (allow !== value.allow));
      setOverrideList(newOverrideList);
      setAllowList(newOverrideList.filter(({ allow }) => (allow)));
      setDenyList(newOverrideList.filter(({ allow }) => (!allow)));
    }
  }

  useEffect(() => {
    setOverrideList([...initialList]);
    setAllowList(initialList.filter(({ allow }) => (allow)));
    setDenyList(initialList.filter(({ allow }) => (!allow)));
  }, [initialList]);

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
      <DialogTitle style={{ textAlign: "left" }}>{"Manage users"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid container item xs={4}>
            <Grid item xs={12}>
              <DialogContentText marginBottom style={{ textAlign: "left" }}>
                Enter a user to always, or never, read.
              </DialogContentText>
              <TextField
                autoFocus
                error={error}
                helperText={error && "User is already on the list"}
                margin="dense"
                id="chatName"
                name="chatName"
                label="Username"
                type="text"
                fullWidth
                value={chatName}
                onChange={(event) => setChatName(event.target.value)}
              />
            </Grid>
            <Grid item style={{ textAlign: "left" }} xs={12}>
              Deny
              <Switch name="allowSwitch" ref={allowRef} defaultChecked />
              Allow
            </Grid>
            <Grid item style={{ textAlign: "left" }} xs={12}>
              <Button color="success" onClick={()=> addName(chatName.toLowerCase())} endIcon={<AddIcon/>}>
                Add 
              </Button>
              {allowList.length >= 1 && denyList.length >= 1 && 
                <Button color="error" onClick={() => deleteList(1,1)} endIcon={<ClearIcon />}>
                  Clear All
                </Button>
              }
            </Grid>
          </Grid>

          <Grid container item xs={4} style={{ alignContent: "flex-start" }}>
            <DialogContentText style={{ marginBottom: ".75rem" }}>
              Deny
            </DialogContentText>
              {denyList.map(({ chatName }, index) => (
                <Grid marginTop key={index} container item xs={12}>
                  <Grid item xs={10}>
                    <TextField value={chatName}
                      disabled
                      fullWidth
                      variant="standard"
                      margin="dense"
                      name={`deny${index}`}
                    />
                  </Grid>
                  <Grid item xs={2} marginTop>
                    <DeleteIcon color="error" onClick={() => deleteEntry(chatName)} />
                  </Grid>
                </Grid>
              ))}
              {denyList.length > 1 && 
                <Button color="error" onClick={() => deleteList(false)} endIcon={<ClearIcon />}>Clear</Button>
              }
          </Grid>

          <Grid container item xs={4} style={{ alignContent: "flex-start" }}>
            <DialogContentText style={{ marginBottom: ".75rem" }} >
              Allow
            </DialogContentText>
            {allowList.map(({ chatName }, index) => (
              <Grid key={index} marginTop container item xs={12}>
                <Grid item xs={10}>
                  <TextField value={chatName}
                    disabled
                    fullWidth
                    variant="standard"
                    margin="dense"
                    name={`allow${index}`}
                  />
                </Grid>
                <Grid item xs={2} marginTop>
                  <DeleteIcon color="error" onClick={() => deleteEntry(chatName)} />
                </Grid>
              </Grid>
            ))}
            {allowList.length > 1 && 
              <Button color="error" onClick={() => deleteList(true)} endIcon={<ClearIcon />}>Clear </Button>
            }
          </Grid>

        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(overrideList)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OverrideListModal;
