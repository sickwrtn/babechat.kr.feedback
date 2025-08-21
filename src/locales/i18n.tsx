import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguaeDetector from "i18next-browser-languagedetector";
import { env } from "../env";
import { requests } from "../function";

const ko = requests.getAfetch(env.api_url + "/ko");

i18n
    .use(LanguaeDetector)
    .use(initReactI18next)
    .init({
        resources : {
            ko: {
                translation: ko
            }
        },
        fallbackLng: "ko", // 번역 파일에서 찾을 수 없는 경우 기본 언어
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;