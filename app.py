from flask import Flask, render_template, request, redirect, url_for, session
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your_secret_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///account.db'
db = SQLAlchemy(app)

# Database model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(42), unique=True, nullable=False)
    password = db.Column(db.String(120), nullable=False)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        wallet_address = request.form['wallet_address']
        password = request.form['password']
        user = User.query.filter_by(wallet_address=wallet_address, password=password).first()
        if user:
            session['user_id'] = user.id
            session['wallet_address'] = user.wallet_address
            return redirect(url_for('dashboard'))
        else:
            return "Invalid credentials. \nPlease check your address and password. \nPlease also make sure you have registered."
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        wallet_address = request.form['wallet_address']
        password = request.form['password']
        new_user = User(wallet_address=wallet_address, password=password)
        try:
            db.session.add(new_user)
            db.session.commit()
        except:
            msg = "User already exists! Try another username!"
            return render_template('register.html',message=msg)
        return redirect(url_for('login'))
    return render_template('register.html')

@app.route('/dashboard', methods=["GET", "POST"])
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('dashboard.html')


@app.route('/transfer_money', methods=["GET", "POST"])
def transfer_money():
    return render_template('transfer_money.html')

@app.route('/p2p_lending', methods=["GET", "POST"])
def p2p_lending():
    return render_template('p2p_lending.html')

@app.route('/request_a_loan', methods=["GET", "POST"])
def request_a_loan():
    return render_template('request_a_loan.html')

@app.route('/fund_a_loan', methods=["GET", "POST"])
def fund_a_loan():
    return render_template('fund_a_loan.html')

@app.route('/repay_a_loan', methods=["GET", "POST"])
def repay_a_loan():
    return render_template('repay_a_loan.html')


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)
