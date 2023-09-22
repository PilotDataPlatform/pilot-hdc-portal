/*
 * Copyright (C) 2022-2023 Indoc Systems
 *
 * Licensed under the GNU AFFERO GENERAL PUBLIC LICENSE, Version 3.0 (the "License") available at https://www.gnu.org/licenses/agpl-3.0.en.html.
 * You may not use this file except in compliance with the License.
 */
import Icon from '@ant-design/icons';
import React from 'react';

export default function CollectionIcon(props) {
  return (
    <Icon
      component={() => (
        <svg
          viewBox="0 0 21 21"
          width={props.width}
          height={props.width}
          fill={props.color}
        >
          <g
            id="Style"
            stroke="none"
            strokeWidth="1"
            fill="none"
            fillRule="evenodd"
          >
            <g id="UI-icons" transform="translate(-245.000000, -687.000000)">
              <rect
                id="Rectangle-48-Copy-11"
                x="244"
                y="686"
                width="24"
                height="24"
              ></rect>
              <g
                id="paperclip"
                opacity="0.65"
                transform="translate(245.000000, 687.000000)"
                fill="currentColor"
                fillRule="nonzero"
              >
                <path
                  d="M19.2117188,4.7390625 C18.1078125,3.64921875 16.640625,3.04453125 15.075,3.0421875 L15.0585938,3.0421875 C14.30625,3.0421875 13.5726563,3.1828125 12.8742188,3.459375 C12.15,3.74765625 11.4984375,4.171875 10.940625,4.72265625 L5.48203125,10.1179687 C4.8515625,10.7414062 4.50703125,11.5734375 4.509375,12.4617188 C4.51171875,13.3476562 4.8609375,14.1796875 5.49375,14.8054688 C6.1265625,15.43125 6.965625,15.7757813 7.8609375,15.778125 L7.86796875,15.778125 C8.7609375,15.778125 9.59765625,15.4359375 10.2257813,14.8171875 L15.0164063,10.0828125 C15.1757812,9.92578125 15.2625,9.7171875 15.2625,9.496875 C15.2625,9.27421875 15.1757812,9.065625 15.0164063,8.9109375 C14.859375,8.75390625 14.6484375,8.66953125 14.4257812,8.66953125 C14.203125,8.66953125 13.9921875,8.75625 13.8351562,8.9109375 L9.04453125,13.6453125 C8.7328125,13.9546875 8.31328125,14.1234375 7.865625,14.1234375 L7.86328125,14.1234375 C7.4109375,14.1210938 6.98671875,13.9476562 6.67265625,13.6359375 C6.35625,13.321875 6.18046875,12.9046875 6.18046875,12.459375 C6.178125,12.0164063 6.34921875,11.6015625 6.66328125,11.2921875 L12.121875,5.89453125 C12.9,5.1234375 13.9453125,4.69921875 15.0609375,4.69921875 L15.0726562,4.69921875 C16.1929687,4.7015625 17.2453125,5.1328125 18.0351562,5.9109375 C18.8226562,6.69140625 19.2585937,7.7296875 19.2609375,8.8359375 C19.2632812,9.9421875 18.834375,10.978125 18.0539062,11.7492188 L12.2625,17.4796875 C11.1046875,18.61875 9.5578125,19.246875 7.9078125,19.246875 L7.89140625,19.246875 C6.234375,19.2421875 4.678125,18.6046875 3.5109375,17.4515625 C2.34375,16.2984375 1.69921875,14.7609375 1.696875,13.1226562 C1.6921875,11.484375 2.3296875,9.9515625 3.4875,8.8078125 L10.9640625,1.415625 C11.1234375,1.25859375 11.2101563,1.05 11.2101563,0.8296875 C11.2101563,0.60703125 11.1234375,0.3984375 10.9640625,0.24375 C10.8046875,0.08671875 10.59375,0 10.3710938,0 C10.1484375,0 9.9375,0.08671875 9.78046875,0.24140625 L2.30390625,7.6359375 C1.55859375,8.371875 0.98203125,9.23671875 0.58828125,10.2023437 C0.2109375,11.1351563 0.02109375,12.1195313 0.0234160622,13.1273437 C0.02578125,14.1375 0.2203125,15.121875 0.6046875,16.0523437 C1.00078125,17.0179688 1.5796875,17.8828125 2.3296875,18.6234375 C3.075,19.3617188 3.9515625,19.9359375 4.92890625,20.3296875 C5.86640625,20.7070312 6.8625,20.8992187 7.88671875,20.9039062 L7.9078125,20.9039062 C8.925,20.9039062 9.91171875,20.7164062 10.8445313,20.34375 C11.8195313,19.9570312 12.69375,19.3875 13.4390625,18.6492188 L19.2304688,12.9210938 C19.7859375,12.3703125 20.2171875,11.728125 20.5078125,11.0085938 C20.7890625,10.3125 20.9320313,9.58125 20.9297159,8.82890625 C20.9226563,7.28203125 20.3132813,5.82890625 19.2117188,4.7390625 Z"
                  id="Shape"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      )}
      {...props}
    />
  );
}
