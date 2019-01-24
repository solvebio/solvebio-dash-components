import React, { Component } from 'react';
import PropTypes from 'prop-types';

import S3Upload from 'react-s3-uploader/s3upload';
import Dropzone from 'react-dropzone';

class DashS3Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            files: [],
            uploadedFiles: [],
            uploadComplete: false
        };
        this.handleDrop = this.handleDrop.bind(this);
        this.handleFinish = this.handleFinish.bind(this);
        this.requestS3Url = this.requestS3Url.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        // Only upload if S3 URL received
        if (nextProps.signed_files) {
            // nextProps.signed_files == [{id: obj1.id, filename: obj1.filename, upload_url: obj1.upload_url}, ...]
            const signedFiles = JSON.parse(nextProps.signed_files);
            const urls = signedFiles.map(f => f.upload_url);
            const uploadedFiles = signedFiles;

            this.setState({ uploadedFiles: uploadedFiles })
            urls.forEach((url, index) => {
                this.uploadFile([this.state.files[index]], { signedUrl: url })
            });
        }
    }

    handleDrop(event) {
        // dropzone and regular input take in files param differently
        const files = this.props.dropzone ? event : Array.from(event.target.files);
        this.setState(
            { files: files },
            // Callback function
            () => {
                if (this.props.auto_upload) {
                    this.requestS3Url()
                }
            }
        );
    }

    requestS3Url() {
        const files = this.state.files.map(f => ({
            filename: f.name,
            mimetype: f.type,
            size: f.size
        }));
        this.props.setProps({
            files: JSON.stringify(files)
        })
    }

    uploadFile(files, s3Url) {
        new S3Upload({
            files,
            onFinishS3Put: this.handleFinish,
            // https://github.com/odysseyscience/react-s3-uploader#using-custom-function-to-get-signedurl
            getSignedUrl: (file, callback) => {
                callback(s3Url)
            }
        });
    }

    handleFinish() {
        this.props.setProps({
            uploaded_files: JSON.stringify(this.state.uploadedFiles),
            signed_files: null
        });
        this.setState({
            files: [],
            uploadComplete: true
        });
    }

    render() {
        // key used to force React to re-render and clear file after upload
        let chooseFile = <input type="file" key={this.state.uploadComplete} onChange={this.handleDrop} />;
        let uploadButton = null;
        let listFiles = null;

        if (this.props.dropzone) {
            chooseFile = <Dropzone onDrop={this.handleDrop} className={this.props.className} />;
            listFiles = this.state.files.map(f => <li>{f.name} - {f.size}</li>)
        }

        if (!this.props.auto_upload) {
            uploadButton = <button onClick={this.requestS3Url}>Upload</button>;
        }

        return (
            <div>
                {chooseFile}
                {listFiles}
                {uploadButton}
                {this.props.children}
            </div>
        )
    }
}

DashS3Uploader.propTypes = {
    id: PropTypes.string,
    dropzone: PropTypes.bool,
    className: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string
    ]),
    auto_upload: PropTypes.bool,
    uploaded_files: PropTypes.string,
    files: PropTypes.string,
    signed_files: PropTypes.string,
    setProps: PropTypes.func
};

export default DashS3Uploader;
