#!/usr/bin/env python

from flask import Flask, render_template

app = Flask(__name__)
app.config['SECRET_KEY'] = 'Shh!'
app.config['WTF_CSRF_ENABLED'] = False

@app.route('/', methods=['get', 'post'])
def home():
    return render_template('example.html')

from flask import request

if __name__ == '__main__':
    #shutdown_server()
    app.run(debug=True, host='0.0.0.0')
