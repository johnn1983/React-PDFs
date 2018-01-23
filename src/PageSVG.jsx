import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { callIfDefined } from './shared/utils';

import { isPage, isRotate } from './shared/propTypes';

export default class PageSVG extends Component {
  state = {
    svg: null,
  }

  componentDidMount() {
    this.renderSVG();
  }

  /**
   * Called when a page is rendered successfully.
   */
  onRenderSuccess = () => {
    this.renderer = null;

    callIfDefined(this.props.onRenderSuccess);
  }

  /**
   * Called when a page fails to render.
   */
  onRenderError = (error) => {
    if (error.name === 'RenderingCancelledException') {
      return;
    }

    callIfDefined(
      this.props.onRenderError,
      error,
    );
  }

  get viewport() {
    const { page, rotate, scale } = this.props;

    return page.getViewport(scale, rotate);
  }

  renderSVG = () => {
    const { page } = this.props;

    this.renderer = page.getOperatorList();

    return this.renderer
      .then((operatorList) => {
        const svgGfx = new PDFJS.SVGGraphics(page.commonObjs, page.objs);
        this.renderer = svgGfx.getSVG(operatorList, this.viewport)
          .then((svg) => {
            svg.style.maxWidth = '100%';
            svg.style.height = 'auto';
            this.setState({ svg }, () => this.onRenderSuccess());
          })
          .catch(this.onRenderError);
      })
      .catch(this.onRenderError);
  }

  drawPageOnContainer = (element) => {
    const { svg } = this.state;

    if (!element || !svg) {
      return;
    }

    const renderedPage = element.firstElementChild;
    if (renderedPage) {
      const { width, height } = this.viewport;
      renderedPage.setAttribute('width', width);
      renderedPage.setAttribute('height', height);
    } else {
      element.appendChild(svg);
    }
  }

  render() {
    return (
      <div
        className="react-pdf__Page__svg"
        style={{
          display: 'block',
          backgroundColor: 'white',
        }}
        // Note: This cannot be shortened, as we need this function to be called with each render.
        ref={ref => this.drawPageOnContainer(ref)}
      />
    );
  }
}

PageSVG.propTypes = {
  onRenderError: PropTypes.func,
  onRenderSuccess: PropTypes.func,
  page: isPage.isRequired,
  rotate: isRotate,
  scale: PropTypes.number,
};
