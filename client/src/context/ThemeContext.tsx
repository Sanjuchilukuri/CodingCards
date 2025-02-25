import { createContext, ReactNode, useState } from "react";

export interface IThemeContext{
    currentTheme : string,
    changeTheme : Function;
}

export const ThemeContext = createContext({} as IThemeContext);

function ThemeContextProvider({ children }: { children: ReactNode }) {

    const [currentTheme, SetTheme] = useState(localStorage.getItem("theme") || "light");

    const changeTheme = () => {
         SetTheme(prevTheme => {
            const newTheme = prevTheme === "light" ? "dark" : "light";
            localStorage.setItem("theme", newTheme);
            return newTheme;
        });
    }

    return(
        <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export default ThemeContextProvider;