from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.services.databases import Databases
from pymoodle import MoodleWebServiceAPIClient, MoodleError,MoodleException
from appwrite.exception import AppwriteException
import os

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

        if "moken" not in context.req.body_json:
            raise ValueError("`moken` must be provided in the JSON Request Body.")

        moodle = MoodleWebServiceAPIClient(token=context.req.body_json["moken"],api_base="https://lms.ssn.edu.in")
        moodleUserId = moodle.site_info["userid"]
        print(moodleUserId)
        courses = moodle.get_user_courses(userid=moodleUserId)
        
        print(courses)
        return context.res.json(
            {"Courses" : courses}
        )
    except Exception as e:
        print(e)
        return context.res.json(
            {"Error":str(e)},500
        )
