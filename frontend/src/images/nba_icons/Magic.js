import React from 'react';
import PropTypes from 'prop-types';

const ORL = (props) => {
  const { size } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={size}
      height={size}
      viewBox="0 0 150 150"
      fill="none"
      fillRule="evenodd"
      role="img"
      aria-describedby='title'
    >
      <title id="title">Orlando Magic</title>
      <defs>
        <path id="A_ORL" d="M129.784 75.68V.01H.001v75.67h129.783z" />
      </defs>
      <g fill="none" fillRule="evenodd">
        <g transform="translate(10 37.027)">
          <mask id="B_ORL" fill="#fff">
            <use xlinkHref="#A_ORL" />
          </mask>
          <path
            d="M112.497 18.568l3.106-1.334 3.334-1.396-10.928-3.545L105.382.01l-6.61 9.884L87.57 7.04l3.765 4.893c-14.11-1.793-29.78-.47-43.854 3.722l.93-2.92-2.405.69C26.84 18.92 10.066 33.846 2.226 52.373L.001 57.636l4.33-3.724c9.367-8.046 19.034-16.352 33.065-20.8l-3.9 9.094 3.41-1.868c3.08-1.688 6.555-2.985 10.264-3.88l5.007 1.72c7.84 2.687 14.645 5.016 21.33 9.292-.05 7.293 2.908 14.528 8.186 19.96 5.182 5.33 11.943 8.253 19.06 8.253h.212c16.34-.123 25.974-12.156 28.275-24.02 2.067-10.667-1.213-25.368-16.73-33.093"
            fill="#fefefe"
            mask="url(#B_ORL)"
          />
        </g>
        <path
          d="M60.512 73.223c9.287-1.425 18.554-1.007 26.668 2.42l.988-2.176C75.042 69.24 58.54 69.456 46.25 76.19l3.5-8.14c-15.448 4.177-25.843 12.896-36.292 21.875C21.076 71.916 37.64 57.112 56.375 51.74l-.953 2.988c16.404-5.356 34.41-6.372 48.987-3.963l-3.414-4.445 8.363 2.133 5.38-8.038 2.126 9.94 8.223 2.67s-6 2.51-5.704 2.628c31.145 12.837 21.176 55.5-8.44 55.718-14.98.123-26.6-13.42-26.095-27.6-7.616-5.016-15.258-7.43-24.336-10.557"
          fill="#c4cdd3"
        />
        <path
          d="M116.302 55.664l5.152-2.248-.25-.083-6.253-2.052-.98-6.765-.037-.27-1.872 3.046-1.652 2.67-6.818-1.736.177.228c.005.005 2.166 2.79 3.476 4.483-5.353-1.163-11.528-1.814-18.608-1.814-2.324 0-4.745.07-7.262.214-9.653.552-19.146 2.353-28.256 5.645l1.042-3.1-.185.056C39.72 58.394 24.13 71.767 17.238 85l.155.118C27.138 75.963 40.326 68.66 52.148 66l-3.106 7.242.24-.115c5.5-2.658 12.722-3.834 20.01-3.834 7.455 0 14.98 1.233 20.796 3.352l-2.23 4.863c-5.302-2.433-12.97-4.073-19.334-4.073-1.133 0-2.225.05-3.256.16l-.016.196c7.514 2.122 15.295 4.52 21.462 9.466a22.1 22.1 0 0 0-.056 1.573c.003 13.016 11.233 24.798 24.41 24.8l.268-.003c14.524-.17 25.286-13.496 25.29-27.39.003-10.233-5.85-20.78-20.324-26.577"
          fill="#120c0d"
        />
        <g fill="#c4cdd3">
          <path d="M108.38 79.506c-5.364 0-10.73-1.967-16.12-3.95-1.42 3.006-2.142 6.157-2.142 9.362 0 1.704.204 3.427.62 5.147l1.34.016c10.406 0 21.45-2.894 30.37-8.186-1.028-1.913-2.303-3.7-3.626-5.42-3.473 2.197-6.954 3.03-10.438 3.03M91.7 92.104h-.35c3.254 8.42 10.716 14.002 19.818 14.128 2.913-7.18 6.146-15.026 13.533-18.694-.386-1.294-.86-2.553-1.382-3.794-9.514 5.562-20.622 8.36-31.62 8.36m22.493-26.428c-3.235-1.235-5.297-1.618-5.5-1.653l-3.128.442c5.5 2.192 9.56 4.85 13.64 9.402 2.097-1.66 3.94-3.537 5.216-5.844-3.74-3.64-10.786-8.102-28.358-9.485 7.42 1.766 14.243 4.148 18.2 6.964l-.1.174zm-49.266-2.44l3.5-.038c12.484.005 31.75 1.474 39.22 10.35l-.126.15c-2.584-1.442-7.755-3.83-10.98-3.826a6.05 6.05 0 0 0-.305.008c-1.1 1.224-2.1 2.58-2.967 3.984 4.994 1.84 10.05 3.67 15.06 3.668 3.146 0 6.274-.718 9.372-2.607-8.66-9.442-23.315-13.56-37.14-13.56-5.5 0-10.85.648-15.646 1.87M124 80.9c2.415-1.645 4.5-3.363 6.395-5.57-1.192-2.267-3.25-4.812-4.73-6.122-1.376 2.428-3.138 4.432-5.28 6.195 1.26 1.683 2.595 3.647 3.615 5.498m-10.715 25.234c4.386-.536 8.42-2.034 11.8-4.914.522-1.943.744-3.952.744-5.967 0-1.924-.204-3.856-.55-5.734-6.617 3.18-9.364 10.166-12.004 16.615m14.505-9.587l-.048 1.993c2.573-3.483 3.952-6.508 4.716-10.96-1.877.166-3.738.482-5.508 1.07.578 2.623.84 5.25.84 7.896M124.9 82.75l1.545 4.057c2.062-.673 4.054-1.018 6.204-1.15l.003-.455c0-2.848-.42-5.04-1.347-7.765-1.974 2.02-4.057 3.74-6.405 5.313" />
          <path d="M132.66 85.66c-2.15.13-4.14.477-6.204 1.15a44.38 44.38 0 0 0-1.545-4.057 39.71 39.71 0 0 0 6.405-5.316c.927 2.728 1.347 4.92 1.347 7.768l-.003.455m-6.995-16.444c1.478 1.3 3.54 3.858 4.732 6.122-1.896 2.208-3.982 3.928-6.397 5.57-1.02-1.85-2.354-3.815-3.615-5.498 2.142-1.763 3.904-3.767 5.28-6.195M96.073 58.537c17.572 1.385 24.617 5.846 28.36 9.485-1.28 2.307-3.122 4.185-5.216 5.844-4.08-4.55-8.143-7.2-13.64-9.402 1-.196 2.22-.32 3.125-.442.193.035 2.255.418 5.5 1.653l.094-.174c-3.968-2.816-10.8-5.195-18.212-6.964m-4 31.546a55.6 55.6 0 0 1-1.339-.016 21.94 21.94 0 0 1-.62-5.147c0-3.207.723-6.358 2.145-9.362 5.388 1.98 10.754 3.95 16.118 3.95a18.98 18.98 0 0 0 10.438-3.033c1.323 1.723 2.597 3.5 3.626 5.423-8.92 5.292-19.963 8.186-30.37 8.186m19.096 16.148c-9.102-.126-16.565-5.707-19.818-14.128h.35c10.998 0 22.105-2.797 31.62-8.36.522 1.243.996 2.5 1.382 3.794-7.388 3.668-10.62 11.513-13.533 18.694m16.574-7.68l.048-1.993c0-2.647-.262-5.276-.84-7.9 1.77-.587 3.63-.9 5.508-1.07-.763 4.453-2.142 7.478-4.716 10.96m-10.03-23.623c-3.098 1.9-6.223 2.6-9.372 2.6-5 0-10.066-1.827-15.06-3.67.878-1.404 1.858-2.757 2.967-3.984l.305-.008c3.224-.003 8.395 2.387 10.98 3.83l.126-.153c-7.468-8.877-26.738-10.345-39.22-10.35l-3.5.038c4.8-1.22 10.157-1.868 15.65-1.868 13.825-.003 28.48 4.116 37.138 13.558m7.377 26.31c-3.4 2.88-7.423 4.38-11.8 4.914 2.64-6.45 5.388-13.432 12.004-16.615.345 1.878.55 3.8.55 5.734 0 2.015-.222 4.024-.744 5.967m-17.36-43.686l3.82-1.337 2.9 3.293-.337-4.298 3.7-1.616-4.027-1.32-.624-4.292-2.15 3.486-4.078-1.042 2.705 3.478z" />
        </g>
        <path
          d="M87.376 60.64l2.654-1.3 2.212 1.967-.43-2.926 2.555-1.487-2.916-.498-.63-2.886-1.368 2.623-2.948-.3 2.07 2.114zm-29.84 5.873l1.75-.863 1.45 1.294-.284-1.924 1.68-.98-1.917-.33-.415-1.897-.902 1.717-1.936-.2 1.36 1.4z"
          fill="#fefefe"
        />
        <path
          d="M123.602 92.92l-.003-.356-2.464 4.13.707-3.636-.174-.083c-3.6 4.38-5 7.53-6.1 11.4l-.054.185.182-.062c4.05-1.407 6.143-3.033 7-3.714l.02-.016.01-.02c.603-1.308.886-3.957.9-7.205l-.003-.63m-8.237-9.563c-3.942.8-8.542 1.273-12.757 1.273a53.32 53.32 0 0 1-1.869-.032l9.043-2.677-.024-.196c-5.97-.28-10.58-.394-16.415-3.13l-.083-.04-.046.08c-.868 1.56-1.363 3.743-1.363 5.956 0 1.257.16 2.524.503 3.687l.02.07.07.003c.005 0 .212.005.594.005 2.608 0 13.322-.287 22.4-4.812l-.064-.188zm1.994 7.34c-4.56 3.4-7.993 6.13-14.717 7.398 6.226-3.237 10.403-5.463 14.33-9.442l-.12-.155c-6.962 4.057-16.03 5.793-22.426 6.034l-.174.005.094.147c5.267 8.338 11.93 9.086 14.096 9.086h.013c.45 0 .702-.03.707-.03l.046-.008.024-.038c2.828-4.472 4.625-8.778 8.264-12.85l-.134-.147z"
          fill="#0077c0"
        />
        <path
          d="M112.69 62.912l-1.018-.496c5.385 1.6 9.016 3.68 11.046 5.26-.313.464-.66.91-1.018 1.345-2.493-2.586-5.538-4.692-9.01-6.11m16.59 30.173l-.02-.35a26.81 26.81 0 0 0 .506-4.341c.38-.102.77-.18 1.162-.252-.418 1.782-.937 3.403-1.65 4.943m2.25-9.453a24.95 24.95 0 0 0-1.995.335c-.145-1.042-.353-2.074-.62-3.09.7-.587 1.368-1.184 2.046-1.822.388 1.498.552 2.904.568 4.576m-2.402-8.847c-.597.643-1.176 1.214-1.762 1.747a27.07 27.07 0 0 0-2.3-4.024c.46-.555.905-1.128 1.323-1.728 1.125 1.246 2.102 2.703 2.74 4.006"
          fill="#fefefe"
        />
      </g>
    </svg>
  );
};

ORL.propTypes = {
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ORL;
