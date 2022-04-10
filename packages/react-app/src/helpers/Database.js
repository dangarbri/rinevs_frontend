// This file contains an API for interacting with
// the internal database that mirrors the IPFS JSON metadata.
// The class defined is "Database" since the API serves as a
// Database for the API.

// The API URL to use for API requests. Defined in .env file
const API_URL = process.env.REACT_APP_API;

// These headers are required for the API to accept JSON data and
// unfortunately are not set by default when using fetch.
const POST_HEADERS = {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
};

// The API for receiving a token using form encoded data rather than
// JSON, so these headers are defined here.
const LOGIN_HEADERS = {
    'Content-Type': 'application/x-www-form-urlencoded'
}

class Database {
    // This is a helper function for translating a username and password
    // into form encoded data to receive a token.
    _getLoginPayload(username, password) {
        // TODO: Remove this once login feature is implemented and
        // the password is passed directly from a form.
        return "username=" + username + "&password=" + password;
    }

    // Registers an account on the API.
    async createAccount(email, password) {
        let response = await fetch(API_URL + "/auth/register", {
            method: 'POST',
            headers: POST_HEADERS,
            body: JSON.stringify({email: email, password: password})
        });
        
        if (response.ok) {
            let result = await response.json();
            return result;
        } else {
            console.log("Failed to get create account");
            console.log(await response.json());
            return {};
        }
    }

    // Retrieves an access token using the given credentials.
    async getToken(username, password) {
        let payload = this._getLoginPayload(username, password);
        let response = await fetch(API_URL + "/auth/jwt/login", {
            method: 'POST',
            headers: LOGIN_HEADERS,
            body: payload
        });

        if (response.ok) {
            let data = await response.json();
            return data.access_token;
        } else {
            console.log("Failed to get client token");
            console.log(await response.json());
            return {}
        }
    }

    /**
     * Uploads json to the server
     * @param token Access Token retrieved from getToken command
     * @param json The JSON object to upload
     */
    async upload(token, json) {
        if (token === "") {
            alert("You need to login first before you can upload.");
        } else {
            let response = await fetch(API_URL + "/create", {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
            'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(json)
            });

            let result = await response.json();
            return result;
        }
    }
}

export default Database;
