"use client";

import React from "react";
import {useTheme} from "~/context/theme-context";
import {SunIcon, MoonIcon} from "@heroicons/react/24/outline"

export default function SwitchThemeButton() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            className="fixed bottom-20 lg:bottom-5 right-5 bg-white w-[3rem] h-[3rem] bg-opacity-80 backdrop-blur-[0.5rem] border border-white border-opacity-40 shadow-2xl rounded-full flex items-center justify-center hover:scale-[1.15] active:scale-105 transition-all dark:bg-gray-950 z-50"
            onClick={toggleTheme}
        >
            {theme === "light" ? <SunIcon className={"h-6 w-6"} /> : <MoonIcon className={"h-6 w-6 stroke-0 fill-white"} />}
        </button>
    );
}
