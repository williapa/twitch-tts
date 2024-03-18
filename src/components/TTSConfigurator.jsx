import React, { useState, useEffect, useRef } from 'react';
import { 
  Stack,
  Typography,
  TextField,
  FormControlLabel,
  Select,
  Slider,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Box,
  Button,
  ButtonGroup,
} from '@mui/material';
import { 
  VolumeUp,
  VolumeDown,
  Stop,
  PlayArrow,
  Pause,
  Save,
  SkipNext,
  Settings,
  ManageAccounts
} from "@mui/icons-material";
import OverrideListModal from './OverrideListModal';

const globalProfileName = 'ttsSettings';

const TTSConfigurator = ({ addMessage, clear, onPlay, onStop }) => {
  const formRef = useRef(null);

  const [voices, setVoices] = useState([]);
  const [channel, setChannel] = useState('');
  const [currentChannel, setCurrentChannel] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [overrideList, setOverrideList] = useState([]);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);

  const getFormValues = () => {
    const formData = new FormData(formRef.current);
    const formValues = {};
    for (let [key, value] of formData.entries()) {
      formValues[key] = value;
    }
    formValues.overrideList = overrideList;
    return formValues;
  };
  
  const setFormValues = (savedFormValues) => {
    const form = formRef.current;
    console.log(savedFormValues);
    // Set values for standard input fields
    Object.entries(savedFormValues).forEach(([key, value]) => {
      if (key !== 'overrideList') { // Skip overrideList or any other non-standard fields
        const element = form.elements[key];
        if (element) {
          if (element.type === 'checkbox') {
            element.checked = value;
          } else {
            element.value = value;
          }
          if (key === 'channel') {
            setChannel(value);
          }
        }
      }
    });
    console.log(savedFormValues.overrideList);
    // Handle setting the value of 'overrideList' or other non-standard fields
    setOverrideList([...savedFormValues.overrideList]);
  };

  const handleClose = (newList) => {
    setOverrideList([...newList])
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    const formValues = getFormValues();

    if (ready) {
      addMessage({ text: 'TTS resumed.', username: 'client', readTTS: false });
      window.speechSynthesis.resume();
    } else {
      addMessage({ text: 'TTS is now playing!', username: 'client', readTTS: false });
      const startPlaying = onPlay(formValues); 
      setCurrentChannel(formValues.channel);
      setReady(startPlaying);
    }
    // ready or not it's playing now 
    setPlaying(true);
  };

  const load = (name = globalProfileName) => {
    // todo - store by name (requires more ui)
    const data = window.localStorage.getItem(name);
    if (!data) {
      window.alert('no configuration saved.');
      return;
    }
    setFormValues(JSON.parse(data));
    window.alert(`Your settings from date have been loaded!`);
  }
  // todo: save profile by name (requires more ui)
  const save = (name = globalProfileName) => {
    const formValues = getFormValues();
    window.localStorage.setItem(name, JSON.stringify(formValues));
    window.alert('settings saved to this device, which you can load in the future.')
  };

  const pauseSpeech = () => {
    setPlaying(false);
    window.speechSynthesis.pause();
    addMessage({ text: 'TTS paused.', username: 'client', readTTS: false });
  };

  const skip = () => window.speechSynthesis.cancel();

  const stop = () => {
    setPlaying(false);
    setReady(false);
    onStop();
    addMessage({ text: 'TTS stopped.', username: 'client', readTTS: false });
  }

  useEffect(() => {
    setVoices(speechSynthesis.getVoices());
    speechSynthesis.onvoiceschanged = () => {
      setVoices(speechSynthesis.getVoices());
    };
  }, []);

  useEffect(() => {
    if (currentChannel.length) {
      clear(currentChannel);
    }
  }, [currentChannel]);

  return (
    <Box sx={{ m: 4 }}>
      <Typography variant="h3" style={{ color: "#adbdcd" }} gutterBottom>
        TWITCH TTS 🔑💸
      </Typography>

      <form id="ttsForm" ref={formRef} onSubmit={handleSubmit}>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid item xs={4}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Typography variant="body1">twitch.tv/</Typography>
              <TextField value={channel}
                onChange={(evt) => setChannel(evt.target.value)}
                name="channel"
                label="Channel Name"
                variant="outlined"
                fullWidth
              />
            </div>
          </Grid>

          <Grid item xs={4}>
            <FormControl fullWidth>
              <InputLabel id="voice-select-label">TTS Voice</InputLabel>
              <Select defaultValue="Samantha" name="ttsVoice" labelId="voice-select-label" label="TTS Voice">
                {voices.map((v, index) => (
                  <MenuItem key={index} value={v.name}>
                    {v.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={4}>
            <TextField
              type="number"
              label="Bit Min"
              variant="outlined"
              name="bitMin"
              defaultValue={0}
              fullWidth
              InputProps={{ inputProps: { min: 0, max: 99999, step: 1 } }}
            />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<input type="checkbox" name="newSubs" />} label="New subs" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<input type="checkbox" name="resubs" />} label="Resubs" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<input type="checkbox" name="giftSubs" />} label="Gift subs" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<input type="checkbox" name="vips" />} label="VIPs" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<input type="checkbox" name="mods" />} label="Mods" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<input type="checkbox" name="followers" />} label="Follows" />
          </Grid>

          <Grid item xs={2} marginTop >
            <Stack spacing={2} direction="row" sx={{ mb: 1, mt: 1 }} alignItems="center">
              <VolumeDown />
              <Slider step={1}
                marks
                min={0}
                max={100}
                color="success"
                valueLabelDisplay="auto"
                label="Volume"
                name="volume"
                defaultValue={100}
              />
              <VolumeUp />
            </Stack>
          </Grid>

          <Grid item xs={4} marginTop >
            <ButtonGroup>
              <Button
                endIcon={<Stop />}
                type="button"
                variant="contained"
                color="warning"
                size="large"
                onClick={stop}
                disabled={!ready}
              >
                Stop
              </Button>

              <Button 
                id="playPause"
                endIcon={playing ? <Pause /> : <PlayArrow />}
                type="button"
                variant="contained"
                color="secondary"
                size="large"
                onClick={playing ? pauseSpeech : handleSubmit}
              >
                {playing? 'Pause' : 'Play'}
              </Button>
              
              <Button
                disabled={!ready}
                endIcon={<SkipNext />}
                type="button"
                variant="contained"
                color="info"
                size="large"
                onClick={skip}
              >
                skip
              </Button>
            </ButtonGroup>
          </Grid>

          <Grid item xs={2} marginTop >
            <ButtonGroup>
              <Button 
                endIcon={<ManageAccounts />}
                type="button"
                variant="contained"
                color="error"
                size="large"
                onClick={()=> setDialogOpen(true)}
              >
                Users
              </Button>
            </ButtonGroup>
          </Grid>

          <Grid item xs={4} marginTop >
            <ButtonGroup>
              <Button
                onClick={load}
                endIcon={<Settings />}
                type="button"
                variant="contained"
                color="primary"
                size="large"
              >
                Load
              </Button>

              <Button
                onClick={save}
                endIcon={<Save />}
                type="button"
                variant="contained"
                color="success"
                size="large"
              >
                Save
              </Button>
            </ButtonGroup>
          </Grid>

        </Grid>
        <OverrideListModal initialList={overrideList}
          open={dialogOpen}
          handleClose={handleClose}
        />
      </form>
    </Box>
  );
};

export default TTSConfigurator;
