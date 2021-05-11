import React, {useState, useEffect} from 'react';
import authService from '../auth.service'


type memeAPI = {
    id:string;
    name:string;
    url_image:string;
    array?: Array<string>
    }

  
const DisplayMemeUser = () => {

    const session_token = authService.getCurrentUser()
    console.log(session_token);

  const [Memes, SetMemes] = useState<memeAPI[]>([]);


  useEffect(() => {
      fetch(`http://localhost:3500/api/allMeme/${session_token['id']}}`).then(x => x.json()
          .then(response => {
            SetMemes(response.results)
          }));
    }, []);

    const deleteImage = (user_id) => {
        const newListMemes = Memes.filter((meme) => meme.id !== user_id)
        SetMemes(newListMemes);
        fetch(`http://localhost:3500/api/deleteMeme/${user_id}`).then(() => {
            console.log('remove image');
        }).catch(error => {
            console.log(error);
        })
        
    }

  return (
  <div className="App">
  
<section className="Memes-container">
    <h2 className="title-meme-dashbord">{`Voici la liste de vos memes ${session_token['name']}`}</h2>
  <div className="Memes-img">
      
  {Memes.map(meme => {

    return (
        <div className="img-single">
            <img key={meme.id} src={meme.url_image} alt={meme.name}/>
            <button onClick={() => deleteImage(meme.id)} className="user-btn">{`Delete ${meme.name.split('.')[0]}`}</button>
        </div>
    )

    })
  }

</div>
</section>
</div>)

}

export default DisplayMemeUser
