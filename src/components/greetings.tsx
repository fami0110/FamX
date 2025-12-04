const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12)	return "Good Morning";
    if (hour < 18)	return "Good Afternoon";
                    return "Good Evening";
};

export default function Greetings() {
    const greetingText = getGreeting();

    return (
        <h2 className="relative text-[4rem] font-bold text-muted-foreground">
            <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                [ {greetingText} ]
            </span>
        </h2>
    )
}