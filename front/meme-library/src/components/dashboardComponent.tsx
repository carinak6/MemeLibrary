import { useState } from 'react';
import uploadFileToBlob, { isStorageConfigured } from '../azure-storage-blob';
import Path from 'path';

const storageConfigured = isStorageConfigured();

const DashboardPage = (): JSX.Element => {
  // all blobs in container
  const [blobList, setBlobList] = useState<string[]>([]);

  // current file to upload into container
  const [fileSelected, setFileSelected] = useState(null);

  // UI/form management
  const [uploading, setUploading] = useState(false);
  const [inputKey, setInputKey] = useState(Math.random().toString(36));

  const onFileChange = (event: any) => {
    // capture file into state
    setFileSelected(event.target.files[0]);
  };

  const onFileUpload = async () => {
    // prepare UI
    setUploading(true);

    // *** UPLOAD TO AZURE STORAGE ***
    const blobsInContainer: string[] = await uploadFileToBlob(fileSelected);

    // prepare UI for results
    setBlobList(blobsInContainer);

    // reset state/form
    setFileSelected(null);
    setUploading(false);
    setInputKey(Math.random().toString(36));
  };

  // display form
  const DisplayForm = () => (
    <form action="" className='formUser'> 
       <h2 className='title-meme-dashbord'>Choose a Meme</h2>
       <div>
       <input className='input-picture' type="file" name='picture' onChange={onFileChange} key={inputKey || ''}/>
       </div>
       <div>
       <button className="user-btn" type="submit" onClick={onFileUpload} >Submit</button>
       </div>
   </form>
  )

  // display file name and image
  const DisplayImagesFromContainer = () => (
    <div className="App">
      <section className="Memes-container">
      <div className="Memes-img">
        {blobList.map(item => {
          return ( 
                
            <img key={item} src={item} alt={item}/>
              
            
          );
        })}
        </div>
      </section>
    </div>
  );
 
      
  return (
    <div>
      
      {storageConfigured && !uploading && DisplayForm()}
      {storageConfigured && uploading && <div id="uploading">Uploading</div>}
      {storageConfigured && blobList.length > 0 && DisplayImagesFromContainer()}
      {!storageConfigured && <div>Storage is not configured.</div>}
    </div>
  );
};

export default DashboardPage;