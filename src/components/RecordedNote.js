/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@material-ui/core"
import { useState, useEffect } from "react"
import { withStyles } from "@material-ui/core/styles";

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true

const styles = (theme) => ({
    container: {
        marginTop: 10
    },
    noteContainer: {
        height: 200,
        padding: 5,
    },
    headerBox: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5
    },
    textField: {
        width: "100%"
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
        <Box className={classes.container}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Card className={classes.noteContainer}>
                        <Box className={classes.headerBox}>
                            <FormControl >
                                <InputLabel color="primary">Language</InputLabel>
                                <Select
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
                            <Button color="primary" onClick={handleSaveNote} disabled={!note || capturing}>
                                Save Note
                            </Button>
                        </Box>
                        <TextField
                            id="outlined-multiline-static"
                            multiline
                            rows="5"
                            className={classes.textField}
                            margin="normal"
                            variant="outlined"
                            value={note ? note : "Say something ..."}
                        />
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Card className={classes.noteContainer}>
                        <Typography color="primary" variant="h6">Notes</Typography>
                        <Box>
                            {savedNotes.map((n) => (
                                <Typography key={n}>{n}</Typography>
                            ))}
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    )
}

export default withStyles(styles)(RecordedNote);