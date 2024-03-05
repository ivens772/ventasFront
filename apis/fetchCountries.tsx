import axios from "axios";

let token: string = '';

const customHeader = {
    "Accept": "application/json",
    "api-token": "VA10Vg0jDqz6DBsAiLzYJsfOxJdP_qVWQH3H37prMczVCgyYZTop_o6KJRAXLkZDABE",
    "user-email": "ivenscom08@gmail.com"
};

export async function fetchToken() {
    try {
        const response = await axios("https://www.universal-tutorial.com/api/getaccesstoken", {
            method: "GET",
            headers: customHeader
        });
        token = response.data.auth_token;
        return token;
    } catch (error) {
        console.log("verifica tu conexion a internet antes de el error: " + error);
        throw error;
    }
}

export async function fetchGetCountries() {
    try {
        const accessToken = await fetchToken();
        const response = await axios("https://www.universal-tutorial.com/api/states/El Salvador", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log("verifica tu conexion a internet antes de el error: " + error);
        throw error;
    }
}

export async function fetchGetState(city: string) {
    try {
        const accessToken = await fetchToken();
        const response = await axios(`https://www.universal-tutorial.com/api/cities/${city}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Accept": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        console.log("verifica tu conexion a internet antes de el error: " + error);
        throw error;
    }
}
