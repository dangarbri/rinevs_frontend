import 'dotenv/config';
import { Component } from 'react';
import { Database } from "../helpers";
import { Card, Button } from 'antd';
import { Link } from "react-router-dom";
import beautify from 'json-beautify';

const db = new Database();

const CARD_STYLE = {
    textAlign: "left",
    maxWidth: "800px",
    margin: "0 auto",
    marginTop: "5px"
};

// Maximum number of images to display in the upload history
const HISTORY_LIMIT = 3;

/**
 * This components provides options for interacting with individual JSON
 * objects. Provides the edit & delete buttons.
 */
class JsonOptions extends Component {
    constructor(props) {
	super(props);
    }

    render() {
	return <div>
		   <p style={{float: "left", marginRight: "10px", paddingTop: "4px", marginBottom: "0"}}>
		       ID: {this.props.json.id}
		   </p>
		   <Button>
                       <Link to={{
                                 pathname: "/ipfsup",
                                 state: {
                                     json: this.props.json
                                 }
                             }}>Edit</Link>
                   </Button>
		   &nbsp;&nbsp;
		   <Button danger onClick={this.props.onDelete}>Delete</Button>
	       </div>
    }
}

/**
 * This component is used for rendering an individual chunk of JSON
 */
class JsonBlob extends Component {
    constructor(props) {
	super(props);
    }

    render() {
	let rawjson = beautify(this.props.json, null, 2, 80);

	return <Card title={<JsonOptions onDelete={this.props.deleteJson} json={this.props.json}/>} style={CARD_STYLE}>
		   <pre>{rawjson}</pre>
	       </Card>;
    }
}

/**
 * This class manages viewing chunks of JSON retrieved from a given endpoint
 */
export default class JsonViewer extends Component {
    /**
     * Required props:
     *   - token: for accessing the database
     */
    constructor(props) {
	super(props);
	this.state = {
	    json: []
	}

        this.deleteJson = this.deleteJson.bind(this);
        this.removeJsonFromState = this.removeJsonFromState.bind(this);
    }

    async componentDidMount() {
	console.log(process.env);
	// TODO: Paginate and track the page
	let token = await db.getToken(process.env.REACT_APP_ADMIN, process.env.REACT_APP_PASSWORD);
	let data = await db.getJson(token, 5, {});
	console.log(data);
	this.setState({json: data.items, token: token});
    }

    /**
     * Removes the deleted JSON from the array.
     */
    deleteJson(id) {
	if (window.confirm("Are you sure you want to delete JSON ID " + id + "?")) {
	    let success = db.deleteJson(this.state.token, id);
            if (success) {
                this.removeJsonFromState(id);
            } else {
                alert("Failed to delete the JSON Object, check the console for details");
            }
	}
    }

    removeJsonFromState(id) {
        // Filter out the given id
        this.setState({
            json: this.state.json.filter((item) => item.id != id)
        });
    }

    render() {
        let token = this.state.token;
	let data = this.state.json.map(json => <JsonBlob key={json.id} deleteJson={() => this.deleteJson(json.id)} token={token} json={json} />);
	
	if (data.length > 0) {
	    return <div>
		       {data}
	           </div>;
	} else {
	    return <h1>Loading JSON...</h1>;
	}
    }
}
