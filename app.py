from flask import Flask, request, render_template, redirect, url_for, jsonify, abort
from db import *
import json
from werkzeug.utils import secure_filename
from azure.storage.blob import BlobServiceClient, ContentSettings, ContainerClient
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

app.config.from_pyfile('config.py')
account = app.config['ACCOUNT_NAME']   # Azure account name
key = app.config['ACCOUNT_KEY']      # Azure Storage account access key
connect_str = app.config['CONNECTION_STRING']
container = app.config['CONTAINER']  # Container name
allowed_ext = app.config['ALLOWED_EXTENSIONS']  # List of accepted extensions
# Maximum size of the uploaded file
max_length = app.config['MAX_CONTENT_LENGTH']

blob_service_client = BlobServiceClient.from_connection_string(connect_str)
blob_client_delete = ContainerClient.from_connection_string(
    conn_str=connect_str, container_name=container)


def allowed_file(filename: str) -> str:
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in allowed_ext


@app.route('/upload', methods=['POST'])
def upload() -> None:
    if request.method == 'POST':
        img = request.files['file']
        if img and allowed_file(img.filename):
            filename = secure_filename(img.filename)
            fileextension = filename.rsplit('.', 1)[1]
            img.save(filename)
            blob_client = blob_service_client.get_blob_client(
                container=container, blob=filename)
            my_content_settings = ContentSettings(
                content_type='image/'+fileextension)
            with open(filename, "rb") as data:
                try:
                    blob_client.upload_blob(
                        data, overwrite=True, content_settings=my_content_settings)
                    db = DB()
                    db.insert_one_data(filename, request.form['user_id'])
                except:
                    pass
            os.remove(filename)
    return redirect("/")


@app.route("/all_data/")
def get_data_list() -> json:
    try:
        db = DB()
        data = db.select_from_db()
    except:
        return 'error'
    return jsonify(data)


@app.route("/")
def page() -> None:
    return "Bienvenu sur la page api-python"


@app.route("/data/<int:id_user>/")
def get_data_user(id_user: int) -> json:
    try:
        db = DB()
        data = db.select_data_by_id(id_user)
    except:
        return 'error'
    return jsonify(data)


@app.route("/delete/<int:id_picture>/")
def delete_image_user(id_picture: int) -> None:
    try:
        db: DB = DB()
        filename: callable = db.select_name_by_id(id_picture)
        db.delete_data_by_id(id_picture)
        blob_client_delete.delete_blob(blob=filename)
    except:
        pass
    return redirect("/")


@app.errorhandler(404)
def data_not_found(e) -> str:
    return 'data not found'


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
