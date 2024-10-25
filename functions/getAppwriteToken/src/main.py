from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.exception import AppwriteException
import os
from dotenv import load_dotenv
import requests
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
        if ("moken" not in context.req.body_json):
            raise Exception("moken must be provided.")
        
        request_url = "https://lms.ssn.edu.in/webservice/rest/server.php"
        response = requests.post(request_url,
                      data={"wsfunction":"core_webservice_get_site_info",
                            "wstoken":context.req.body_json["moken"],
                            "moodlewsrestformat":"json"})
        site_info = response.json()
        response = requests.post(request_url,
                    data={"wsfunction":"core_enrol_get_users_courses",
                            "wstoken":context.req.body_json["moken"],
                            "moodlewsrestformat":"json",
                            "userid":site_info['userid']})
        return context.res.json(response.json(),200)
        response.raise_for_status()
        
        users = Users(client)
        token = users.create_token('671b4700002a7f94b1da')
        secret = token['secret']
        responsebody["token"] = secret
        return context.res.json(responsebody)
    except Exception as e:
        responsebody["error"] = str(e)
        return context.res.json(responsebody,500)
