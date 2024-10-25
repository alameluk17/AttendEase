from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.exception import AppwriteException
import os
from dotenv import load_dotenv
load_dotenv()

# This Appwrite function will be executed every time your function is triggered
def main(context):
    responsebody = {
        "error":None,
        "token":None,
    }
    try:
        client = (
            Client()
            .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
            .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
            .set_key(context.req.headers["x-appwrite-key"])
        )
        users = Users(client)
        token = users.create_hhhtoken('671b4700002a7f94b1da')
        secret = token['secret']
        responsebody["token"] = secret
        return context.res.json(responsebody)
    except Exception as e:
        responsebody["error"] = e
        return context.res.json(responsebody,500)
