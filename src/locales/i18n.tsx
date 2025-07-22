import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translationEN from "./en/translation.json";
import translationKO from "./ko/translation.json";
import translationJP from "./ko/translation.json";
import LanguaeDetector from "i18next-browser-languagedetector";

i18n
    .use(LanguaeDetector)
    .use(initReactI18next)
    .init({
        resources : {
            en: {
                translation: translationEN
            },
            ko: {
                translation: translationKO
            },
            jp: {
                Translation: translationJP
            }
        },
        fallbackLng: "ko", // 번역 파일에서 찾을 수 없는 경우 기본 언어
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;