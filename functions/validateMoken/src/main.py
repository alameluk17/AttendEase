from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.exception import AppwriteException
import os
from moodle import Moodle
from dotenv import load_dotenv
load_dotenv()
import requests

# This Appwrite function will be executed every time your function is triggered
def main(context):
    # You can use the Appwrite SDK to interact with other services
    # For this example, we're using the Users service
    client = (
        Client()
        .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(context.req.headers["x-appwrite-key"])
    )
    users = Users(client)
    print(context.req.body)
    try:
        jsonobj = context.req.body_json
        if "moken" not in jsonobj:
            raise Exception("`moken` must be provided in the JSON Request Body.")
        moodle = Moodle("https://lms.ssn.edu.in/webservice/rest/server.php", jsonobj["moken"])
        site_info = moodle.core.webservice.get_site_info()
        return context.res.json({"info":site_info})
    except Exception as e:
        print(e)
        return context.res.json(
            {"Error":str(e)},500
        )

    

    
