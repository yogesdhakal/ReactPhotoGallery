import React from 'react';
import GalleryItem from './GalleryItem';
import NoResults from './NoResults';

const Gallery = ({ data, title }) => {
  let images;
  
  if (data.length > 0) {
    images = data.map(image =>
      <GalleryItem 
        key={image.id}
        url={`https://farm${image.farm}.staticflickr.com/${image.server}/${image.id}_${image.secret}.jpg`}
        title={image.title}
      />
    )
  }
  else {
    title = '';
    images = <NoResults />;
  }

  return (
    <div className="photo-container">
      <h2>{title}</h2>
      <ul>
        { images }
      </ul>
    </div>
  )
}

export default Gallery;