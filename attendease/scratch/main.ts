import { Joodle } from "joodle";
import got, { Got } from "got";
import { ClientOptions, HttpOptions } from "joodle/dist/client";


async function getMoodleToken(moodleBaseURL: string, username: string, password: string): Promise<string> {
    try {
        // Check for missing parameters
        if (!moodleBaseURL || !username || !password) {
            throw new Error("Missing required parameters: moodleBaseURL, username, or password.");
        }

        // Setup headers
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "AttendEase (https://github.com/alameluk17/AttendEase)"
        };
        
        // Create the form data
        let bodyContent = new FormData();
        bodyContent.append("username", username);
        bodyContent.append("password", password);
        bodyContent.append("service", "moodle_mobile_app");

        // Make the POST request
        let response = await fetch(`${moodleBaseURL}/login/token.php`, {
            method: "POST",
            body: bodyContent,
            headers: headersList
        });

        // Handle non-2xx HTTP status codes
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status} - ${response.statusText}`);
        }

        // Parse response as JSON
        let data = await response.json();

        // Handle cases where token is not provided
        if (!data.token) {
            if (data.error) {
                throw new Error(`Moodle error: ${data.error}`);
            }
            throw new Error("Unexpected response: Token not found.");
        }

        // Return the token if all is well
        return data.token;

    } catch (error) {
        // Log the error and rethrow it for higher-level handling
        console.error("Error in getMoodleToken:", error);
        throw error;  // This can be handled by the caller
    }
}
let a = await getMoodleToken("https://lms.aathish.us.kg","user","bitnami")
console.log(a)

// const joodle = new Joodle();

// (async () => {
//   try {
//     const data = await joodle.modules.core.webservice.getSiteInfo()
//     console.log(data);
//   } catch (error) {
//     //=> Moodle threw an error!
//     console.error(error);
//   }
// })();