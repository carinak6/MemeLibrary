import React, {useState, useEffect} from 'react';
import axios from 'axios'


type memeAPI = {
    id:string;
    title:string;
    images:{
      original:
      {url:string}}
    }

  
const DisplayMeme = () => {
  const [Memes, SetMemes] = useState<memeAPI[]>([]);

// `http://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_GIPHY_KEY}&limit=100`

  useEffect(() => {      
    fetch(`http://api.giphy.com/v1/gifs/trending?api_key=76792192255c42c3a11c58ea1acfbe27&limit=100`)
    .then(x =>
      x.json().then(response => SetMemes(response.data))
    );
  }, []);

  return (
  <div className="App">
  
<section className="Memes-container">

  <div className="Memes-img">
      
  {Memes.map(meme => {

    return <img key={meme.id} src={meme.images.original.url} alt={meme.title}/>

    })
  }

</div>
</section>
</div>)

}

export default DisplayMeme


// import React, {useState, useEffect} from 'react';
// import axios from 'axios'


// type memeAPI = {
//   id:string;
//   name:string;
//   url_image:string;
//   array?: Array<string>
//   }
  
// const DisplayMeme = () => {
//   const [Memes, SetMemes] = useState<memeAPI[]>([]);

// // `http://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_GIPHY_KEY}&limit=100`

// useEffect(() => {
//   fetch("http://localhost:3500/api/allMemes/").then(x => x.json()
//       .then(response => {
//         console.log(response)
//         SetMemes(response.results)
//       }));
// }, []);

//   return (
//   <div className="App">
  
// <section className="Memes-container">

//   <div className="Memes-img">
      
//   {Memes.map(meme => {

//     return  <img key={meme.id} src={meme.url_image} alt={meme.name}/>


//     })
//   }

// </div>
// </section>
// </div>)

// }

// export default DisplayMeme