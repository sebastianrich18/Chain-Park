import React, { useEffect, useState } from "react"
import { Alert } from "react-bootstrap";

export default function useAlert() {

    const [show, setShow] = useState(false);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState("");

    const TIME_TO_CLOSE = 5000;

    useEffect(() => {
        async function alert() {
            if (show) {
                setTimeout(() => {
                    setShow(false)
                }, TIME_TO_CLOSE)
            }

        }
        alert()
    }, [show])

    let renderAlert = () => {
        if (show) {
            return (
                <Alert variant={isError ? "danger" : "success"} onClose={() => setShow(false)} dismissible>
                    <Alert.Heading>{isError ? "Error!" : "Success!"}</Alert.Heading>
                    <p>
                        {message}
                    </p>
                </Alert>
            )
        }
    }
    
    return [renderAlert, setShow, setIsError, setMessage]
}