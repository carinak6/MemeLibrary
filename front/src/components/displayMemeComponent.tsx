import React, { useState, useEffect } from "react";

type memeAPI = {
    id: string;
    name: string;
    url_image: string;
    array?: Array<string>;
};

const DisplayMeme = () => {
    const [Memes, SetMemes] = useState<memeAPI[]>([]);

    useEffect(() => {
        fetch("http://localhost:3500/api/allMemes/").then((x) =>
            x.json().then((response) => {
                SetMemes(response.results);
            })
        );
    }, []);

    return (
        <div className='App'>
            <section className='Memes-container'>
                <div className='Memes-img'>
                    {!Memes.length
                        ? null
                        : Memes.map((meme) => {
                              return (
                                  <img
                                      key={meme.id}
                                      src={meme.url_image}
                                      alt={meme.name}
                                  />
                              );
                          })}
                </div>
            </section>
        </div>
    );
};

export default DisplayMeme;
