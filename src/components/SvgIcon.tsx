// src/components/SvgIcon.tsx

import React from 'react';

const SvgIcon = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    xmlSpace="preserve"
    width="297mm"
    height="210mm"
    fillRule="evenodd"
    clipRule="evenodd"
    imageRendering="optimizeQuality"
    shapeRendering="geometricPrecision"
    textRendering="geometricPrecision"
    viewBox="0 0 29700 21000"
    {...props}  // Isso permite passar props personalizadas (como 'className' e 'style')
  >
    <defs>
      <linearGradient
        id="id0"
        x1="8630.01"
        x2="12022.31"
        y1="12445.15"
        y2="8402.38"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#0061BF" />
        <stop offset="0.035" stopColor="#004495" />
        <stop offset="0.149" stopColor="#00276A" />
        <stop offset="0.302" stopColor="#0067BF" />
        <stop offset="0.502" stopColor="#00367F" />
        <stop offset="0.671" stopColor="#005AD4" />
        <stop offset="0.82" stopColor="#00327F" />
        <stop offset="0.98" stopColor="#0056AA" />
        <stop offset="1" stopColor="#0056AA" />
      </linearGradient>
    </defs>
    <g id="Camada_x0020_1">
      <path
        fill="url(#id0)"
        d="M8943.96 8497.93v-1069.9H4561.63c-890.18 0-1609.16 727.53-1609.16 1617.7v4373.77h1061.35v-2747.52h3860.24v-1069.9H4022.38v-556.35c0-299.58 248.22-547.8 547.79-547.8z"
      />
      {/* Outros paths do SVG */}
    </g>
  </svg>
);

export default SvgIcon;
