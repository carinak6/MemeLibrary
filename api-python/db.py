import mysql.connector
import os
from dotenv import load_dotenv


class DB:

    def __init__(self):
        load_dotenv()
        self.myconn: object = mysql.connector.connect(
            host=os.environ.get('MYSQL_HOST'),
            user=os.environ.get('MYSQL_USER'),
            password=os.environ.get('MYSQL_PASSWORD'),
            database=os.environ.get('MYSQL_DBNAME')
        )

    def select_from_db(self) -> dict:
        query: str = 'select * from memes;'
        try:
            self.mycursor: str = self.myconn.cursor(dictionary=True)
            self.mycursor.execute(query)
            result: dict = self.mycursor.fetchall()
            print('disconnect from database')
            self.myconn.commit()
        except:
            print('error for get all elements in page welcome')
            exit()
        finally:
            self.mycursor.close()
            self.myconn.close()
        return result

    def select_data_by_id(self, id_user: int):
        query: str = f'select * from memes where user_id = {id_user};'
        try:
            self.mycursor: str = self.myconn.cursor(dictionary=True)
            self.mycursor.execute(query)
            result: dict = self.mycursor.fetchall()
            print('disconnect from databse')
            self.myconn.commit()
        except:
            print('error for get data from user')
            exit()
        finally:
            self.mycursor.close()
            self.myconn.close()
        return result

    def select_name_by_id(self, id_picture: int):
        query: str = f'select name from memes where id = {id_picture};'
        try:
            self.mycursor: str = self.myconn.cursor(dictionary=True)
            self.mycursor.execute(query)
            result: dict = self.mycursor.fetchall()
            print('disconnect from databse')
            self.myconn.commit()
        except:
            print('error for get data from user')
            exit()
        finally:
            self.mycursor.close()
        return result[0]['name']

    def insert_one_data(self, filename: str, id_user: int = 0):
        query: str = "INSERT INTO memes(name, url_image, user_id) VALUES(%s, %s, %s)"
        values: tuple = (
            filename, f'https://mmmstorageaccount.blob.core.windows.net/memes/{filename}', id_user)
        try:
            self.mycursor: object = self.myconn.cursor()
            self.mycursor.execute(query, values)
            self.myconn.commit()
        except:
            print('error for query insert element from user')
            exit()
        finally:
            self.mycursor.close()
            self.myconn.close()

    def delete_data_by_id(self, id_picture: int):
        query = f'delete from memes where id = {id_picture}'
        try:
            self.mycursor: str = self.myconn.cursor()
            print(type(self.mycursor))
            self.mycursor.execute(query)
            self.myconn.commit()
        except:
            print('error for query delete element from user')
            exit()
        finally:
            self.mycursor.close()
            self.myconn.close()
