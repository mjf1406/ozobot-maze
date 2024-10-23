import { Poppins, Pixelify_Sans, Comfortaa } from "next/font/google"
 
export const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const pixelifySans = Pixelify_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"]
})

export const comfortaa = Comfortaa({
    subsets: ["latin"],
    weight: ["300", "400", "500", "600", "700"]
})