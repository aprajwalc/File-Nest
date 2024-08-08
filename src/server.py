from flask import Flask, request, jsonify
from flask_cors import CORS
import pymysql
import bcrypt

app = Flask(__name__)
CORS(app)
app.config['JSON_SORT_KEYS'] = False

@app.route('/signupserver', methods=['POST'])
def signup_server():
    try:
        data = request.get_json()
        name = data['name']
        username = data['username']
        password = data['password']

        # MySQL database connection
        connection = pymysql.connect(
            host='localhost',
            user='prajwal',
            password='Pra12345!',
            database='Project',
            port=3306
        )

        cursor = connection.cursor()

        # Create user and grant permissions
        cursor.execute("CREATE USER %s@'localhost' IDENTIFIED BY %s", (username, password))
        cursor.execute("GRANT ALL PRIVILEGES ON Project.* TO %s@'localhost'", (username,))

        # Insert user details
        cursor.execute("INSERT INTO Users (Name, username) VALUES (%s, %s)", (name, username))

        # Hash password (using bcrypt) and insert into UserSecurity table
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        cursor.execute("INSERT INTO UserSecurity (password) VALUES (%s)", (hashed_password,))

        connection.commit()
        cursor.close()
        connection.close()

        return jsonify({'status': 'ok'})

    except Exception as e:
        print("Error:", e)
        return jsonify({'status': 'error'})

if __name__ == '__main__':
    app.run(port=5000, debug=True)
