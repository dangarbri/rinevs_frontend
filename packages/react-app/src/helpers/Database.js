// This file contains an API for interacting with
// the internal database that mirrors the IPFS JSON metadata.
// The class defined is "Database" since the API serves as a
// Database for the API.
import axios from 'axios';

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

    _checkToken(token) {
        if (token === "") {
            alert("You must log in first to perform this action.");
            return false;
        }

        return true;
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
    async create(token, json) {
        if (this._checkToken(token)) {
            try {
                let response = await axios.post(API_URL + "/create", json, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                return response.data;
            } catch (error) {
                console.log(error);
                alert("Problem uploading, see console for details.");
            }

            return {};
        }
    }

    /**
     * Handles updating an existing json record. Note this shouldn't be
     * called directly. "upload" is the preferred method for creating/deleting
     * records since it handles selecting update or create.
     */
    async update(token, json) {
        if (this._checkToken(token)) {
            try {
                let id = json.id;
                // Need to remove id (the primary key) from the data otherwise the server
                // will barf saying we can't update the primary key. Make a copy so that
                // the given JSON isn't modified.
                let jsonCopy = Object.assign({}, json);
                delete jsonCopy.id;
                let result = await axios.post(API_URL + "/update", {
                    filters: {
                        id: id
                    },
                    values: jsonCopy
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
            } catch (error) {
                console.log(error);
                alert("Error updating JSON");
            }
        }
    }

    /**
     * Uploads a JSON record. If this is a new record, it will execute the create
     * API endpoint. If this is an existing record (it has an ID field) then it will
     * post to the update endpoint.
     */
    async upload(token, json) {
        if (json.hasOwnProperty("id") && json.id > 0) {
            return this.update(token, json);
        } else {
            return this.create(token, json);
        }
    }

    /**
     * Reads json from the server
     */
    async getJson(token, count, page, pageSize, filter) {
	      try {
	          // Send the query
	          let result = await axios.post(API_URL + "/read", filter, {
		      headers: {
			  'Accept': 'application/json',
			  'Authorization': 'Bearer ' + token
		      },
                      params: {
                          count: count,
                          page: page,
                          size: pageSize
                      }
		  });
	          
	          return result.data;
	      } catch (error) {
	          console.error(error);
	          return [{beep: "beep"}, {boop: "boop"}];
	      }
    }

    async deleteJson(token, id) {
	      try {
	          let result = await axios.post(API_URL + "/delete",
					                                {id: id},
					                                {
					                                    headers: {
						                                      'Accept': 'application/json',
						                                      'Authorization': 'Bearer ' + token
					                                    }
					                                });
	          console.log(result);
	          return true;
	      } catch (error) {
	          console.error(error);
	          return false;
	      }
    }
}

export default Database;
