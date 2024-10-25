import json
from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.exception import AppwriteException
import os
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
        jsonobj = json.loads(context.req.body)
        moken = jsonobj["moken"]
        print("mok: ", moken)

        # moken = context.req.bodyJson["moken"]
        # print("moken bodyJson oh gawd: ", moken)
        request_url = "https://lms.ssn.edu.in/webservice/rest/server.php"
        response = requests.post(request_url,
                      data={"wsfunction":"core_webservice_get_site_info",
                            "wstoken":moken,
                            "moodlewsrestformat":"json"})
        if "exception" in response.json():
            raise Exception
        else:
            return context.res.json(
                response.json()
            )

    except Exception as e:
        print(e)
        return context.res.json(
            {"Error":str(e)},500
        )

    

    
