import React from 'react';

export function ObjectFactsheetList({ o }) {
  return (
    <ul className="factsheet">
      {Object.keys(o).filter(k => !!o[k]).map((k) => {
        const value = o[k];
        console.log(value);
        const isLink = value && typeof value === 'string' && value.match('http.*');

        return (
          <li>
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
