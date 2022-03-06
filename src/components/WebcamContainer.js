import { useRef } from "react";
import { Card } from "@material-ui/core";
import Webcam from "react-webcam";

const WebcamContainer = () => {
    const webcamRef = useRef(null);

    return (
        <>
            <Card>
                <Webcam audio ref={webcamRef} />
            </Card>
        </>
    )
}

export default WebcamContainer;