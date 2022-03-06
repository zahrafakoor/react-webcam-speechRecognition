/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Card, Grid, Typography } from "@material-ui/core"
import { useState, useEffect } from "react"
import { withStyles } from "@material-ui/core/styles";

const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition
const mic = new SpeechRecognition()

mic.continuous = true
mic.interimResults = true
mic.lang = 'en-US'

const styles = (theme) => ({
noteContainer: {
    height: "100%",
    maxHeight: 100,
    padding:5
}
});

const RecordedNote = ({ capturing, classes }) => {
    const [note, setNote] = useState(null)
    const [savedNotes, setSavedNotes] = useState([])

    const handleListen = () => {
        if (capturing) {
            mic.start()
            mic.onend = () => {
                mic.start()
            }
        } else {
            mic.stop()
        }


        mic.onresult = event => {
            const transcript = Array.from(event.results)
                .map(result => result[0])
                .map(result => result.transcript)
                .join('')
            setNote(transcript)
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
                    <Typography variant="body2">
                        {note ? note : "Say something ..."}
                    </Typography>
                    <Button onClick={handleSaveNote} disabled={!note || capturing}>
                        Save Note
                    </Button>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <Card className={classes.noteContainer}>
                    <Typography variant="h6">Notes</Typography>
                    {savedNotes.map((n,index) => (
                        <Typography key={index}>{n}</Typography>
                    ))}
                    </Card>
                </Grid>
            </Grid>
        </>
    )
}

export default withStyles(styles)(RecordedNote);