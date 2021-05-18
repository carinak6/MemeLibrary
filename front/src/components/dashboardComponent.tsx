import React from "react";
import axios from "axios";
import authService from "../auth.service";
import DisplayMemeUser from "./displayMemeUserComponent";

interface isState {
    file: any;
    user_id: any;
}

const session_token = authService.getCurrentUser();
class DashboardPage extends React.Component<any, isState> {
    constructor(props: any) {
        super(props);
        this.state = {
            file: null,
            user_id: null,
        };
        this.onFormSubmit = this.onFormSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
        // console.log(this.state);
    }
    onFormSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("myImage", this.state.file);
        formData.append("user_id", this.state.user_id);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };
        axios
            .post(
                `http://localhost:3500/upload/?token=${session_token["token"]}`,
                formData,
                config
            )
            .then((response) => {
                // alert("The file is successfully uploaded");
                if (response.statusText === "OK") {
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    onChange(e) {
        this.setState({
            file: e.target.files[0],
            user_id: session_token["id"],
        });
    }

    render() {
        return (
            <>
                <form onSubmit={this.onFormSubmit} className='formUser'>
                    <h2 className='title-meme-dashbord'>{`Add a new Meme ${session_token["name"]} ?`}</h2>
                    <div className='Memes-img'>
                        <input
                            className='input-picture'
                            type='file'
                            name='myImage'
                            onChange={this.onChange}
                        />
                    </div>
                    <div>
                        <button className='user-btn' type='submit'>
                            send new Meme
                        </button>
                    </div>
                </form>

                <DisplayMemeUser />
            </>
        );
    }
}

export default DashboardPage;
