"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export default function ThemeToggle() {

  const { theme, setTheme } =
    useTheme()

  return (

    <button
      onClick={() =>
        setTheme(
          theme === "dark"
            ? "light"
            : "dark"
        )
      }

      className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border border-blue-100 dark:border-slate-700 flex items-center justify-center transition hover:scale-110"
    >

      {theme === "dark" ? (

        <Sun className="w-5 h-5 text-yellow-400" />

      ) : (

        <Moon className="w-5 h-5 text-blue-700" />

      )}

    </button>

  )

}