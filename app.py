from flask import Flask, render_template, send_from_directory
from bs4 import BeautifulSoup
import datetime
import requests
import json
import dateutil.relativedelta as REL
from dateutil.relativedelta import relativedelta
import datetime as DT
import ast
from threading import Thread
import time
import os
from os import listdir
from os.path import isfile, join
import random
import sys

app = Flask(__name__)
print(str(sys.argv))
host = sys.argv[1]
port = sys.argv[2]
debug = False  # keep this off


@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'images/favicon.ico', mimetype='image/vnd.microsoft.icon')


def updateuptime():
    while True:
        try:
            r = requests.get(f'http://{host}:{port}/karaup', timeout=3)
            if r.status_code == 200:
                if r.content.decode()[0:5] != "error":
                    with open('database/uptime', 'a') as file:
                        file.write(str(json.loads(r.content.decode().strip())) + "\n")
                        file.close()
        except Exception:
            pass
        time.sleep(60)


def updateusercount():
    while True:
        try:
            r = requests.get(f'http://{host}:{port}/usercount', timeout=3)
            if r.status_code == 200:
                if r.content.decode()[0:5] != "error":
                    with open('database/usercount', 'a') as file:
                        file.write(str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "," + str(
                            r.content.decode()) + '\n'))
                        file.close()
        except Exception:
            pass
        time.sleep(60 * 5)


def updatepontyfikat():
    while True:
        try:
            r = requests.get(f'http://{host}:{port}/boardinfo/b', timeout=3)
            if r.status_code == 200:
                if r.content.decode()[0:5] != "error":
                    with open('database/pontyfikatcount', 'a') as file:
                        file.write(str(datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "," + str(
                            ast.literal_eval(r.content.decode())["pontyfikat"]) + '\n'))
                        file.close()
        except Exception:
            pass
        time.sleep(60 * 5)


@app.route("/baner")
def baner():
    onlyfiles = [f for f in listdir('static/images/banery') if isfile(join('static/images/banery', f))]
    file = random.choice(onlyfiles)
    return send_from_directory(os.path.join(app.root_path, 'static'), f'images/banery/{file}')


@app.route("/usercount")
def usercount():
    try:
        r = requests.get('https://karachan.org/online.php', timeout=3, allow_redirects=False)
        return str(r.content.decode().split("'")[1]) if r.status_code == 200 else "error: bad code"
    except Exception:
        return "error: request error"


@app.route("/rangepontyfikat/<time_range>")
def rangepontyfikat(time_range):
    try:
        entries = {}
        with open("database/pontyfikatcount", 'r') as f:
            for line in f:
                try:
                    time_entry, count = line.split(',')
                    a = datetime.datetime.now()
                    b = datetime.datetime.strptime(time_entry, '%Y-%m-%d %H:%M:%S')
                    difference = (a - b).total_seconds()
                    if int(difference) < int(int(time_range) * 3600):
                        entries[time_entry] = int(str(count).strip())
                except Exception as e:
                    pass
        return entries
    except Exception:
        return "error: request error"


@app.route("/rangeusercount/<time_range>")
def rangeusercount(time_range):
    try:
        entries = {}
        with open("database/usercount", 'r') as f:
            for line in f:
                try:
                    time_entry, count = line.split(',')
                    a = datetime.datetime.now()
                    b = datetime.datetime.strptime(time_entry, '%Y-%m-%d %H:%M:%S')
                    difference = (a - b).total_seconds()
                    if int(difference) < int(int(time_range) * 3600):
                        entries[time_entry] = int(str(count).strip())
                except Exception as e:
                    pass
        return entries
    except Exception:
        return "error: request error"


@app.route("/boardinfo/<board>")
def boardinfo(board):
    if board is not None:
        try:
            r = requests.get(f'https://karachan.org/{board}', timeout=5)
            if r.status_code == 200:
                try:
                    soup = BeautifulSoup(r.content.decode(), features="html.parser")
                    pontyfikat = soup.find('span', {
                        "title": 'Liczba postów w ciągu ostatniej minuty. Odświeżane po zapostowaniu.'}).text.split(
                        ' ')[0]
                    posts = soup.find('ul', {"class": "rules"}).findAll('li')[2].text.split(' ')[1]
                    title = soup.find('div', {"class": "boardTitle"}).text
                    zero_posts = soup.find("div", {"class": "board"})
                    top_op_post = zero_posts.findAll('div', {'class': 'thread reqCaptcha'})[0]
                    postget = top_op_post['id'][1:]
                    newest_post = top_op_post.findAll('div', {'class': 'postContainer replyContainer'})[-1]
                    get = str(newest_post['id'])[2:]
                    return {"pontyfikat": pontyfikat, "posts": posts, "postget": postget, "get": get, "title": title}
                except Exception:
                    return "error: data parse error"
            else:
                return "error: bad code"
        except Exception:
            return "error: request error"
    else:
        return "error: no board specified"


@app.route("/boardsinfo")
def boardsinfo():
    with open('database/boards', 'r') as file:
        data = {}
        for board in file:
            try:
                r = requests.get(f'http://{host}:{port}/boardinfo/{board.strip()}', timeout=5)
                if r.status_code == 200:
                    data[board.strip()] = json.loads(r.content.decode().strip())
                else:
                    data[board.strip()] = "error: code error"
            except Exception:
                data[board.strip()] = "error: request error"
        file.close()
        return data


@app.route('/orgonity')
def orgonity():
    today = DT.date.today()
    rd = REL.relativedelta(days=1, weekday=REL.SA)
    saturday = today + rd
    deadline = str(saturday) + " 00:00:00"
    timenow = datetime.datetime.now()
    current_time = str(today) + " " + str(timenow.strftime("%H:%M:%S"))
    start = datetime.datetime.strptime(current_time, '%Y-%m-%d %H:%M:%S')
    ends = datetime.datetime.strptime(deadline, '%Y-%m-%d %H:%M:%S')
    diff = relativedelta(ends, start)
    return {"days": diff.days, "hours": diff.hours, "minutes": diff.minutes, "seconds": diff.seconds}


@app.route("/karainfo")
def karainfo():
    try:
        r = requests.head(f'https://karachan.org', timeout=1)
        if r.status_code == 200:
            try:
                service = r.headers['Server']
            except:
                service = "other"
            up = 0
            down = 0
            with open('database/uptime', 'r') as file:
                for line in file:
                    if ast.literal_eval(line)['status'] == 'up':
                        up += 1
                    else:
                        down += 1
            uptime = round(float((up / (down + up) * 100)), 2)
            return {"host": r.url, "service": service, "response": round(float(r.elapsed.total_seconds()), 3) * 1000,
                    "uptime": uptime}
        else:
            return "error: bad code"
    except Exception:
        return "error: request error"


@app.route("/karaup")
def karaup():
    try:
        r = requests.head(f'https://karachan.org', timeout=1)
        if r.status_code == 200:
            return {"date": str(datetime.datetime.now()), "status": "up"}
        else:
            return {"date": str(datetime.datetime.now()), "status": "down"}
    except Exception:
        return {"date": str(datetime.datetime.now()), "status": "down"}


@app.route("/")
def index():
    return render_template('index.html')


if __name__ == "__main__":
    uptime_thread = Thread(target=updateuptime)
    usercount_thread = Thread(target=updateusercount)
    pontyfikat_thread = Thread(target=updatepontyfikat)
    server_thread = Thread(target=app.run, kwargs={"host": host, "port": port, "debug": debug, "threaded": True})
    server_thread.start()
    uptime_thread.start()
    usercount_thread.start()
    pontyfikat_thread.start()
