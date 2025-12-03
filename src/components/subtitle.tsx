import { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function Subtitle() {
    const el = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const typed = new Typed(el.current, {
            strings: ['What are you <b>looking</b> for?'],
            typeSpeed: 50,
            backSpeed: 25,
            backDelay: 8000,
            cursorChar: '|',
            loop: true
        });
        
        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <h1 className="relative text-4xl font-normal tracking-tight text-balance drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            <span ref={el} />
        </h1>
    )
}