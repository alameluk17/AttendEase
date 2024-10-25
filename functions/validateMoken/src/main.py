from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.query import Query
from appwrite.exception import AppwriteException
import os
from pymoodle import MoodleWebServiceAPIClient, MoodleError,MoodleException
import requests


# This Appwrite function will be executed every time your function is triggered
def main(context):
    # You can use the Appwrite SDK to interact with other services
    # For this example, we're using the Users service
    try:
        client = (
            Client()
            .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
            .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
            .set_key(context.req.headers["x-appwrite-key"])
        )
        users = Users(client)
        jsonobj = context.req.body_json
        if "moken" not in jsonobj:
            raise Exception("`moken` must be provided in the JSON Request Body.")
        moodle = MoodleWebServiceAPIClient(token=jsonobj["moken"],api_base="https://lms.ssn.edu.in")
        moodleUserId = moodle.CLIENT_USER_DATA["userid"]
        user_data = moodle.get_users_by_field("id",[moodleUserId])
        emailAddress= user_data[0]["email"]
        rollNo = user_data[0]["idnumber"]
        
        result = users.list(Query.equal("email",emailAddress))
        print(result)
        # if not(result):
        #     #new user

        moodle.get_user_courses(userid=moodle.CLIENT_USER_DATA["userid"])       
        return context.res.json(user_data)
    except Exception as e:
        print(e)
        return context.res.json(
            {"Error":str(e)},500
        )

    

    
