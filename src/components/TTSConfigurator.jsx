import React, { useState, useEffect, useRef } from 'react';
import { 
  Stack,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Select,
  Slider,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Box,
  Button
} from '@mui/material';
import { VolumeUp, VolumeDown } from "@mui/icons-material";
import OverrideListModal from './OverrideListModal';

const TTSConfigurator = ({ onSave }) => {
  const formRef = useRef(null);

  const [voices, setVoices] = useState([]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [overrideList, setOverrideList] = useState([]);

  const handleClose = (newList) => {
    setOverrideList([...newList])
    setDialogOpen(false);
  }


  useEffect(() => {
    setVoices(speechSynthesis.getVoices());
    speechSynthesis.onvoiceschanged = () => {
      setVoices(speechSynthesis.getVoices());
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const formData = new FormData(formRef.current);
    const formValues = {};
    for (let [key, value] of formData.entries()) {
      formValues[key] = value;
    }
    formValues.overrideList = overrideList;
    onSave(formValues); // Pass form values up for processing
  };

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
              <TextField name="channel" label="Channel Name" variant="outlined" fullWidth />
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
            <FormControlLabel control={<Checkbox name="newSubs" />} label="New Subscribers" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<Checkbox name="resubs" />} label="Resubscribers" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<Checkbox name="giftSubs" />} label="Gift Subs" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<Checkbox name="vips" />} label="VIPs" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<Checkbox name="mods" />} label="Mods" />
          </Grid>

          <Grid item xs={2}>
            <FormControlLabel control={<Checkbox name="followers" />} label="New Followers" />
          </Grid>

          <Grid item xs={4} marginTop >
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

          <Grid item xs={2} marginTop >
            <Button
              type="button"
              variant="contained"
              color="error"
              size="large"
            >
              Stop
            </Button>
          </Grid>

          <Grid item xs={2} marginTop >
            <Button 
              type="button"
              variant="contained"
              color="secondary"
              size="large"
              onClick={()=> setDialogOpen(true)}
            >
              Play/Pause
            </Button>
          </Grid>

          <Grid item xs={2} marginTop >
            <Button 
              type="button"
              variant="contained"
              color="primary"
              size="large"
              onClick={()=> setDialogOpen(true)}
            >
              Override
            </Button>
          </Grid>

          <Grid item xs={2} marginTop >
            <Button
              type="submit"
              variant="contained"
              color="success"
              size="large"
            >
              Save
            </Button>
          </Grid>
        </Grid>
        <OverrideListModal open={dialogOpen} handleClose={handleClose}/>
      </form>
    </Box>
  );
};

export default TTSConfigurator;
