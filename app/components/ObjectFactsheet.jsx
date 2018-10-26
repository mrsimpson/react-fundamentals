import React from 'react';
import { PropTypes } from 'prop-types';

export function ObjectFactsheetList({ o }) {
  return (
    <ul className="factsheet">
      {Object.keys(o).filter(k => !!o[k]).map((k) => {
        const value = o[k];
        const isLink = value && typeof value === 'string' && value.match('http.*');

        return (
          <li
            key={k}
          >
            {
                isLink
                  ? <a href={value}>{k}</a>
                  : (
                    <div>
                      <span className="key">{`${k}: `}</span>
                      <span className="value">{value}</span>
                    </div>
                  )
              }
          </li>
        );
      })}
    </ul>
  );
}

ObjectFactsheetList.propTypes = {
  // the purpose of this method is to be generic
  // eslint-disable-next-line react/forbid-prop-types
  o: PropTypes.object.isRequired,
};
