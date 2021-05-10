const DashboardPage = (): JSX.Element => {

  return(

    <form action="http://localhost:3500/upload" className='formUser' method="post" encType="multipart/form-data"> 
      <h2 className='title-meme-dashbord'>Choose a Meme</h2>
      <div className="Memes-img">
      <input className='input-picture' type="file" name='keyform'/>
      <input type="hidden" name="user_id" value="1" />
      </div>
      <div>
      <button className="user-btn" type="submit">Submit</button>
      </div>
    </form>
  )
}

export default DashboardPage;
