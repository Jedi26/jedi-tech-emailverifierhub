import React from 'react';

function Image({
  src,
  alt = "Jedi Tech ",
  className = "",
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.src = "/assets/images/android-chrome-192x192.png"
      }}
      {...props}
    />
  );
}

export default Image;
