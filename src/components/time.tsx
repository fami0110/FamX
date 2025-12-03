import { useState, useEffect } from "react";

export default function Time() {
    const [time, setTime] = useState<string>("");
    
    useEffect(() => {
        // Update time
        const updateTime = () => {
            const now = new Date()
            setTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }))
        }
        updateTime()
        const timeInterval = setInterval(updateTime, 1000)

        return () => clearInterval(timeInterval)
    }, []);

    return (
        <>
            <span className="text-sm">{time || "--:--"}</span>   
        </>
    );
}

