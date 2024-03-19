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
  FastForward,
  VolumeUp,
  VolumeDown,
  Stop,
  PlayArrow,
  Pause,
  Save,
  SkipNext,
  ManageAccounts
} from "@mui/icons-material";
import OverrideListModal from './OverrideListModal';

const globalProfileName = 'ttsSettings';
const checkBoxes = [
  ['newSubs', 'New subs'],
  ['resubs', 'Resubs'],
  ['giftSubs', 'Gift subs'],
  ['vips', 'VIPs'],
  ['mods', 'Mods'],
  ['followers', 'Follows']
];

const TTSConfigurator = ({ addMessage, clear, error, onPlay, onSkipOne, onStop, playing, setPlaying}) => {
  const formRef = useRef(null);

  const [voices, setVoices] = useState([]);
  const [channel, setChannel] = useState('');
  const [currentChannel, setCurrentChannel] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [overrideList, setOverrideList] = useState([]);
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

  const handleClose = (newOverrideList) => {
    setOverrideList(newOverrideList);
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    const formValues = getFormValues();

    if (ready) {
      addMessage({ text: 'TTS resumed.', username: 'client', readTTS: false });
    } else {
      addMessage({ text: 'TTS is now playing!', username: 'client', readTTS: false });
      const startPlaying = onPlay(formValues); 
      setCurrentChannel(formValues.channel);
      setReady(startPlaying);
    }
    setPlaying(true);
    window.speechSynthesis.resume();
  };

  const load = (name = globalProfileName) => {
    // todo - store by name (requires more ui)
    const data = window.localStorage.getItem(name);
    if (!data) {
      console.log('No settings saved.');
      return;
    }
    setFormValues(JSON.parse(data));
  }
  // todo: save profile by name (requires more ui)
  const save = () => {
    const formValues = getFormValues();
    window.localStorage.setItem(globalProfileName, JSON.stringify(formValues));
    window.alert('settings saved to this device will automatically load in the future.')
  };

  const pauseSpeech = () => {
    setPlaying(false);
    window.speechSynthesis.pause();
    addMessage({ text: 'TTS paused.', username: 'client', readTTS: false });
  };

  const skipOne = () => {
    window.speechSynthesis.cancel();
    // todo: re-enqueue everything after the skipped message 
  }

  const skipAll = () => window.speechSynthesis.cancel();

  const stop = () => {
    setReady(false);
    onStop();
    addMessage({ text: 'TTS stopped.', username: 'client', readTTS: false });
  }

  useEffect(() => {
    setVoices(speechSynthesis.getVoices());
    speechSynthesis.onvoiceschanged = () => {
      setVoices(speechSynthesis.getVoices());
    };
    load();
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
          <Grid item xs={12} sm={6} md={4}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Typography variant="body1">twitch.tv/</Typography>
              <TextField value={channel}
                onChange={(evt) => setChannel(evt.target.value)}
                name="channel"
                label="Channel Name"
                variant="outlined"
                error={!!error}
                helperText={error}
                fullWidth
              />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
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

          <Grid item xs={12} sm={6} md={4}>
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
          
          {checkBoxes.map(([name, label]) => (
            <Grid key={name} item xs={4} sm={3} md={2} marginTop>
              <FormControlLabel control={<input type="checkbox" name={name} />} label={label} />
            </Grid>
          ))}

          <Grid item xs={4} sm={4} md={2} marginTop >
            <Button 
              endIcon={<ManageAccounts />}
              type="button"
              variant="contained"
              color="warning"
              size="medium"
              onClick={()=> setDialogOpen(true)}
            >
              Users
            </Button>
          </Grid>

          <Grid item xs={4} sm={4} md={2} marginTop >
            <Button
              onClick={save}
              endIcon={<Save />}
              type="button"
              variant="contained"
              color="success"
              size="medium"
            >
              Save
            </Button>
          </Grid>

          <Grid item xs={4} sm={4} md={2} marginTop >
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

          <Grid item xs={12} sm={12} md={6} marginTop>
            <ButtonGroup>
              <Button
                endIcon={<Stop />}
                type="button"
                variant="contained"
                color="error"
                size="medium"
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
                color="primary"
                size="medium"
                onClick={playing ? pauseSpeech : handleSubmit}
              >
                {playing ? 'Pause' : 'Play'}
              </Button>

              <Button
                disabled={!ready}
                endIcon={<FastForward />}
                type="button"
                variant="contained"
                color="secondary"
                size="medium"
                onClick={onSkipOne}
              >
                Skip
              </Button>
              
              <Button
                disabled={!ready}
                endIcon={<SkipNext />}
                type="button"
                variant="contained"
                color="inherit"
                size="medium"
                onClick={skipAll}
              >
                Clear
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
