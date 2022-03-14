import { Component } from 'react';
import { Upload, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import '../styles/ipfs_uploader.css';
import { create } from "ipfs-http-client";

const ipfs = create({ host: "ipfs.infura.io", port: "5001", protocol: "https" });

// Maximum number of images to display in the upload history
const HISTORY_LIMIT = 3;

export default class IpfsUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            sending: false,
            previewImage: "",
            fileToUpload: null,
            history: []
        }

        this.beforeUpload = this.beforeUpload.bind(this);
        this.uploadToIpfs = this.uploadToIpfs.bind(this);
        this.saveState = this.saveState.bind(this);
        this.loadState = this.loadState.bind(this);
        this.addToHistory = this.addToHistory.bind(this);
    }

    // Saves the history to local storage
    saveState() {
        let json = JSON.stringify(this.state.history);
        localStorage.setItem("upload_history", json);
    }

    // Restores the user's upload history from local storage
    loadState() {
        let json = localStorage.getItem("upload_history");
        if (json != null) {
            let localHistory = JSON.parse(json);
            this.setState({history: localHistory});
        }
    }

    // Add an uploaded image to the history
    addToHistory(hash, preview) {
        let newHistory = this.state.history;
        newHistory.unshift({
            hash: hash,
            preview: preview
        });

        if (newHistory.length > HISTORY_LIMIT) {
            newHistory = newHistory.slice(0, HISTORY_LIMIT);
        }
        this.setState({history: newHistory}, this.saveState);
    }

    // Get base64 data of the given file for previewing.
    async getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
    }

    // Get the file when the user stages it in the uploader
    async beforeUpload(file) {
        let preview = await this.getBase64(file);
        this.setState({
          previewImage: preview,
          fileToUpload: file
        });
        return false;
    }

    // Uploads the currently staged file to ipfs.
    async uploadToIpfs () {
        this.setState({sending: true});

        const result = await ipfs.add(this.state.fileToUpload);
        if (result && result.path) {
            this.addToHistory(result.path, this.state.previewImage);
            this.setState({
                previewImage: "",
                fileToUpload: null
            })
        }
        this.setState({sending: false});
    }

    // On loading, load the user's upload history
    componentDidMount() {
        this.loadState();
    }

    render() {
        const uploadButton = (
            <div>
              {this.state.loading ? <LoadingOutlined /> : <PlusOutlined />}
              <div style={{ marginTop: 8 }}>Upload</div>
            </div>
          );

        return (<div className="ipfs-container">
            <Upload 
                className="ipfs-uploader"
                name="file"
                beforeUpload={this.beforeUpload}
                listType="picture-card"
                showUploadList={false}
                accept="image/*">
                
                {this.state.previewImage ? <img src={this.state.previewImage} alt="uploaded image" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : uploadButton}
            </Upload>
            {this.state.previewImage && 
                <Button
                    style={{ margin: 8 }}
                    loading={this.state.sending}
                    size="large"
                    shape="round"
                    type="primary"
                    onClick={this.uploadToIpfs}>
                    Upload to IPFS
                </Button>}
            
            {this.state.history.length > 0 && <div className="ipfs-history">
                <h2>Your Upload History</h2>
                {this.state.history.map((item) => <div className="ipfs-image" key={item.hash}>
                    <img src={item.preview} alt="uploaded image" />
                    <p>{item.hash}</p>
                </div>)}
            </div>}
        </div>)
    }
}
