import React, {FunctionComponent, useState, useEffect, HtmlHTMLAttributes } from 'react';
import { Map, setOriginalNode } from 'typescript';
import { map } from 'rxjs/operators';
import LoginPage from './loginComponent'


type memeAPI = {
    id:string;
    name:string;
    url:string;
    array?: Array<string>
    }
type tokenAuth = {
  token:string,
  setToken:string,
}
  
  const DisplayMeme = () => {
    const [Memes, SetMemes] = useState<memeAPI[]>([]);
    const [token, setToken] = useState<tokenAuth>();

  
    
    // useEffect(()=> {
  
    //   const asynFuncAPI = async() => {
        
        
    //     const res = await axios.get("https://api.imgflip.com/get_memes");
    //     SetMemes(res.data.memes)
   
    //    } 
    // }, [])
  
    useEffect(() => {
      fetch("https://api.imgflip.com/get_memes").then(x =>
        x.json().then(response => SetMemes(response.data.memes))
      );
    }, []);
  
   return (
    <div className="App">
   
  <section id="Memes-container">

   <div className="Memes-img">
        
    {Memes.map(meme => {
  
      return <img key={meme.id} src={meme.url} alt={meme.name}/>
  
      })
    }
  
  </div>
  </section>
  </div>)
  
  }

export default DisplayMeme