/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, FormControl, Grid, InputLabel, MenuItem, Select, Typography } from "@material-ui/core"
import { useState, useEffect } from "react"
import { withStyles } from "@material-ui/core/styles";

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true

const styles = (theme) => ({
    noteContainer: {
        height: "100%",
        maxHeight: 100,
        padding: 5
    },
    langSettingContainer: {
        display: 'flex',
        justifyContent: 'space-between'
    }
});

const RecordedNote = ({ capturing, classes }) => {
    const [note, setNote] = useState(null)
    const [savedNotes, setSavedNotes] = useState([])
    const [lang, setLang] = useState('en-US')

    const handleLangChange = (e) => {
        setLang(e.target.value)
    }

    const handleListen = () => {
        mic.lang = lang;
        if (capturing) {
            mic.start()
            mic.onend = () => {
                console.log('continue..')
                mic.start()
            }
        } else {
            mic.stop()
            mic.onend = () => {
                console.log('Stopped Mic on Click')
            }
        }
        mic.onstart = () => {
            console.log('Mics on')
        }

        mic.onresult = event => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
            console.log(transcript)
            setNote(transcript)
            mic.onerror = event => {
                console.log(event.error)
            }
        }
    }
    const handleSaveNote = () => {
        setSavedNotes([...savedNotes, note])
        setNote('')
    }

    useEffect(() => {
        handleListen()
    }, [capturing])

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card className={classes.noteContainer}>
                        <Box className={classes.langSettingContainer}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Language</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={lang}
                                    label="Language"
                                    onChange={handleLangChange}
                                    disabled={capturing}
                                >
                                    <MenuItem value={'en-US'}>English</MenuItem>
                                    <MenuItem value={'de-DE'}>Deutsch</MenuItem>
                                    <MenuItem value={'ar-SA'}>Arabic</MenuItem>
                                </Select>
                            </FormControl>
                            <Button onClick={handleSaveNote} disabled={!note || capturing}>
                                Save Note
                            </Button>
                        </Box>

                        <Typography variant="body2">
                            {note ? note : "Say something ..."}
                        </Typography>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card className={classes.noteContainer}>
                        <Typography variant="h6">Notes</Typography>
                        {savedNotes.map((n) => (
                            <Typography key={n}>{n}</Typography>
                        ))}
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default withStyles(styles)(RecordedNote);