import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
client = MongoClient(os.getenv("MONGODB_URI"))
db = client["eduinsight"]

db.users.drop()
db.admins.drop()
db.teachers.drop()
db.students.drop()
db.classes.drop()

print("Database cleared successfully!")