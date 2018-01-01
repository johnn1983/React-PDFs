import PropTypes from 'prop-types';
import once from 'lodash.once';

import { isDefined } from './util';
import { mouseEvents, touchEvents } from './events';

import LinkService from '../LinkService';

export const eventsProps = once(() => {
  const eventProps = {};

  [].concat(mouseEvents, touchEvents).forEach((eventName) => {
    eventProps[eventName] = PropTypes.func;
  });

  return eventProps;
});

const fileTypes = [
  PropTypes.string,
  PropTypes.instanceOf(ArrayBuffer),
  PropTypes.shape({
    data: PropTypes.object,
    httpHeaders: PropTypes.object,
    range: PropTypes.object,
    url: PropTypes.string,
    withCredentials: PropTypes.bool,
  }),
];
if (typeof File !== 'undefined') {
  fileTypes.push(PropTypes.instanceOf(File));
}
if (typeof Blob !== 'undefined') {
  fileTypes.push(PropTypes.instanceOf(Blob));
}

export const isClassName = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.arrayOf(PropTypes.string),
]);

export const isFile = PropTypes.oneOfType(fileTypes);

export const isLinkService = PropTypes.instanceOf(LinkService);

export const isPage = PropTypes.shape({
  commonObjs: PropTypes.shape({
    objs: PropTypes.object.isRequired,
  }).isRequired,
  getAnnotations: PropTypes.func.isRequired,
  getTextContent: PropTypes.func.isRequired,
  getViewport: PropTypes.func.isRequired,
  render: PropTypes.func.isRequired,
  transport: PropTypes.shape({
    fontLoader: PropTypes.object.isRequired,
  }).isRequired,
});

export const isPageIndex = (props, propName, componentName) => {
  const pageIndex = props[propName];
  const { pageNumber, pdf } = props;

  if (!isDefined(pdf)) {
    return null;
  }

  if (isDefined(pageIndex)) {
    if (typeof pageIndex !== 'number') {
      return new Error(`Warning: Failed prop type: \`${propName}\` of type \`${typeof pageIndex}\` supplied to \`${componentName}\`, expected instance of \`Number\`.`);
    }

    if (pageIndex < 0) {
      return new Error(`Warning: Failed prop type: expected \`${propName}\` to be greater or equal to 0.`);
    }

    const { numPages } = pdf.pdfInfo;

    if (pageIndex + 1 > numPages) {
      return new Error(`Warning: Failed prop type: expected \`${propName}\` to be less or equal to ${numPages - 1}.`);
    }
  } else if (!isDefined(pageNumber)) {
    return new Error(`Warning: Failed prop type: \`${propName}\` not supplied. Either pageIndex or pageNumber must be supplied to \`${componentName}\`.`);
  }

  // Everything is fine
  return null;
};

export const isPageNumber = (props, propName, componentName) => {
  const pageNumber = props[propName];
  const { pageIndex, pdf } = props;

  if (!isDefined(pdf)) {
    return null;
  }

  if (isDefined(pageNumber)) {
    if (typeof pageNumber !== 'number') {
      return new Error(`Warning: Failed prop type: \`${propName}\` of type \`${typeof pageNumber}\` supplied to \`${componentName}\`, expected instance of \`Number\`.`);
    }

    if (pageNumber < 1) {
      return new Error(`Warning: Failed prop type: expected \`${propName}\` to be greater or equal to 1.`);
    }

    const { numPages } = pdf.pdfInfo;

    if (pageNumber > numPages) {
      return new Error(`Warning: Failed prop type: expected \`${propName}\` to be less or equal to ${numPages}.`);
    }
  } else if (!isDefined(pageIndex)) {
    return new Error(`Warning: Failed prop type: \`${propName}\` not supplied. Either pageIndex or pageNumber must be supplied to \`${componentName}\`.`);
  }

  // Everything is fine
  return null;
};

export const isPdf = PropTypes.shape({
  getDestination: PropTypes.func.isRequired,
  getOutline: PropTypes.func.isRequired,
  getPage: PropTypes.func.isRequired,
  numPages: PropTypes.number.isRequired,
});

export const isRotate = PropTypes.oneOf([0, 90, 180, 270]);
