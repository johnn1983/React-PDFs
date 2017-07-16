import React, { Component } from 'react';
import { render } from 'react-dom';
import { Document, Page } from 'react-pdf/build/entry.webpack';

import './Sample.less';

class Example extends Component {
  state = {
    file: './sample.pdf',
    pageNumber: 1,
    numPages: null,
  }

  onFileChange = (event) => {
    this.setState({
      file: event.target.files[0],
    });
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  changePage(by) {
    this.setState(prevState => ({
      pageNumber: prevState.pageNumber + by,
    }));
  }

  render() {
    const { file, pageNumber, numPages } = this.state;

    return (
      <div className="Example">
        <header>
          <h1>react-pdf sample page</h1>
        </header>
        <div className="Example__container">
          <div className="Example__container__load">
            <label htmlFor="file">Load from file:</label>&nbsp;
            <input
              type="file"
              onChange={this.onFileChange}
            />
          </div>
          <div className="Example__container__document">
            <Document
              file={file}
              onLoadSuccess={this.onDocumentLoadSuccess}
            >
              {
                Array.from(
                  new Array(numPages),
                  (el, index) => (
                    <Page
                      key={`page_${index + 1}`}
                      pageNumber={index + 1}
                      onRenderSuccess={this.onPageRenderSuccess}
                    />
                  ),
                )
              }
            </Document>
          </div>
        </div>
      </div>
    );
  }
}

render(<Example />, document.getElementById('react-container'));
