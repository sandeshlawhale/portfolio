"use client";

import React, { useEffect, useState } from "react";
import { Quote } from "lucide-react";
import quotes from "@/constants/quotes";
import Fadeup from "../ui/fadeup";

const HeroQuote = () => {
    const [quote, setQuote] = useState<{ quote: string; character: string; anime: string } | null>(null);

    useEffect(() => {
        // Select a random quote on mount to avoid hydration mismatch
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setQuote(quotes[randomIndex]);
    }, []);

    if (!quote) return null;

    return (
        <section className="mx-4 w-full ">

            <Fadeup delay={0.4} duration={0.6}>
                <section className="relative w-full px-4 py-8 flex flex-col items-center justify-center mt-8">
                    {/* Background Icon */}
                    <div className="absolute -top-4 -left-2 opacity-5 text-primaryText">
                        <Quote size={120} className="fill-current rotate-180" />
                    </div>

                    {/* Quote Text */}
                    <div className="relative z-10 text-center">
                        <p className="text-xl md:text-2xl font-semibold text-mutedText/90 tracking-wide italic">
                            &quot;{quote.quote}&quot;
                        </p>
                    </div>

                    {/* Character */}
                    <div className="w-full flex justify-end mt-2">
                        <p className="text-sm font-semibold text-primaryText/80 tracking-wider">
                            — {quote.character}
                        </p>
                    </div>
                </section>
            </Fadeup>
        </section>
    );
};

export default HeroQuote;
