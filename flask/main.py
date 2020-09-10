import sqlite3
import json
from functools import wraps

from flask import Flask, request
from flask_restful import Resource, Api
from flask_cors import CORS, cross_origin
from flask import jsonify
conn = sqlite3.connect('ploud_app.db')
import jwt

#deneme db connection
c = conn.cursor()

c.execute('SELECT * FROM customer')
data = c.fetchall()
names = list(map(lambda x: x[0], c.description))

last_obj = []
for el in data:
    last_obj.append({names[0]:el[0],names[1]:el[1] })


json_obj = json.dumps(last_obj)
print(json.dumps(last_obj))

conn.commit()
conn.close()


app = Flask(__name__, instance_relative_config=True)
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string'
api = Api(app)
CORS(app)



loginResponse = ""
token = ""
table_id = 0

class HelloWorld(Resource):

    #search the user in the database
    def post(self):
        global loginResponse, token, table_id
        conn = sqlite3.connect('ploud_app.db')
        c = conn.cursor()

        print("recvd: ", request.get_json())
        user_info = request.get_json()
        som = user_info

        print(f"USERNAME IS : {user_info['username']}")
        c.execute("SELECT * FROM users WHERE username =? AND password =?", (user_info['username'], user_info['password'],))
        data1 = c.fetchall()
        table_id = data1[0][3]
        if data1:
            print("AUTHENTICATION IS SUCCESSFULL!")
            loginResponse = True
            token_encoded = jwt.encode({'username': user_info['username']}, app.config['JWT_SECRET_KEY'], algorithm='HS256')
            print(f"OLUSTUTURLAN TOKEN : {token_encoded}")
            token = token_encoded.decode("utf-8")
        else:
            print("LOGIN FAILED")
            loginResponse = False
        conn.commit()
        conn.close()
        return {"you sent": user_info}

#send the database response to the login page
class LoggedIn(Resource):
    def get(self):
        global loginResponse, token
        if (loginResponse == False):
            token = ""
        print(token)
        print(f"INSIDE LOGIN RESP : {loginResponse}")
        return {'response': loginResponse,
                'token':  token}


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        rcv_token = None

        if 'access-token' in request.headers:
            rcv_token = request.headers['access-token']
            print(f">>TOKEN IS: {str.encode(rcv_token)}")

        if not rcv_token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(str.encode(rcv_token), app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            print(f">>>USERNAME IS: {data['username']}")

        except:
            return jsonify({'Message': 'token is missing'}), 401

        return f(*args, **kwargs)
    return decorated


class Datatable(Resource):
    global table_id
    #get user_info data
    @token_required
    def get(self):

        conn = sqlite3.connect('ploud_app.db')
        c = conn.cursor()
        c.execute("SELECT * FROM user_info WHERE table_id=?", (int(table_id),))
        data_table = c.fetchall()
        datas = list(map(lambda x: x[0], c.description))

        json_table = []
        for el in data_table:
            json_table.append({datas[0]: el[0], datas[1]: el[1], datas[2]: el[2], datas[3]: el[3]})

        json_obj = json.dumps(json_table)
        jsonify(json_table)
        print(json_obj)

        conn.commit()
        c.close()

        return jsonify(json_table)

    #post data to the user_info table
    @token_required
    def post(self):
        data_info = request.get_json()
        print("recvd: ", request.get_json())

        conn = sqlite3.connect('ploud_app.db')
        c = conn.cursor()
        print("POSTTA")
        c.execute("INSERT INTO user_info values (?,?,?,?,?)",(data_info['id'], data_info['name'], data_info['birthdate'], data_info['mail'], table_id))
        conn.commit()
        conn.close()



cors = CORS(app, resources={r"/.*": {"origins": "*"}})
app.config['CORS_HEADERS'] = 'Content-Type'

api.add_resource(HelloWorld, '/')
api.add_resource(LoggedIn, '/loggedIn/')
api.add_resource(Datatable, '/datatable/')



if __name__ == '__main__':
    app.run(debug=True)
