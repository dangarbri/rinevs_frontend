import 'dotenv/config';
import { Component } from 'react';
import { Database } from "../helpers";
import { Card, Button, Pagination } from 'antd';
import { Link } from "react-router-dom";
import ReactJson from "react-json-view";
import beautify from 'json-beautify';

const db = new Database();

const CARD_STYLE = {
    textAlign: "left",
    maxWidth: "800px",
    margin: "0 auto",
    marginTop: "5px"
};

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

class JsonSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            json: {}
        }
        this.updateJson = this.updateJson.bind(this);
    }

    updateJson(newJson) {
        this.setState({json: newJson});
        this.props.search(newJson);
    }

    render() {
        return <ReactJson
                   style={{ padding: 8 }}
                   src={this.state.json}
                   theme="pop"
                   enableClipboard={false}
                   onEdit={(edit, a) => {
                       this.updateJson(edit.updated_src);
                   }}
                   onAdd={(add, a) => {
                       this.updateJson(add.updated_src);
                   }}
                   onDelete={(del, a) => {
                       this.updateJson(del.updated_src);
                   }}
               />
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
	    json: [],     // Current items to display
            page: 1,      // current page
            pageSize: 10,
            token: null,
            total: 0,
            query: {}
	}

        this.deleteJson = this.deleteJson.bind(this);
        this.removeJsonFromState = this.removeJsonFromState.bind(this);
        this.loadPage = this.loadPage.bind(this);
        this.updateSearchQuery = this.updateSearchQuery.bind(this);
    }

    async componentDidMount() {
	console.log(process.env);
	// TODO: Paginate and track the page
	let token = await db.getToken(process.env.REACT_APP_ADMIN, process.env.REACT_APP_PASSWORD);
	let data = await db.getJson(token, 100, 1, 10, {});
	this.setState({json: data.items, token: token, total: data.total});
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

    async loadPage(page, pageSize) {
        let data = await db.getJson(this.state.token, this.state.total, page, pageSize, this.state.query);
        let originalTotal = this.state.total;
        this.setState({json: data.items, page: page, pageSize: pageSize, total: data.total}, () => {
            // After performing a search, the total search size is set to 1. Then the server will return
            // the number of records that match the search. We should reload the search in that case.
            if (this.state.total > originalTotal) {
                this.loadPage(page, pageSize);
            }
        });
    }

    updateSearchQuery(query) {
        this.setState({query: query, total: 1}, () => {
            this.loadPage(this.state.page, this.state.pageSize);
        });
    }

    render() {
        let token = this.state.token;
	let data = this.state.json.map(json => <JsonBlob key={json.id} deleteJson={() => this.deleteJson(json.id)} token={token} json={json} />);
	if (data.length > 0) {
	    return <div>
                       <JsonSearch search={this.updateSearchQuery} />
                       <Pagination style={{marginTop: 10}} defaultCurrent={1} onChange={this.loadPage} total={this.state.total} />
		       {data}
                       <Pagination style={{marginTop: 10}} defaultCurrent={1} onChange={this.loadPage} total={this.state.total} />
                   </div>;
	} else {
	    return <h1>Loading JSON...</h1>;
	}
    }
}
