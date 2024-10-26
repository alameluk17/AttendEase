from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.users import Users
from appwrite.query import Query
from appwrite.id import ID
from appwrite.exception import AppwriteException
import os
from uuid import uuid5, NAMESPACE_URL
from pymoodle import MoodleWebServiceAPIClient, MoodleError,MoodleException


def genUUID(email:str):
    return str(uuid5(NAMESPACE_URL, email))

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
        databases = Databases(client)

        if "moken" not in context.req.body_json:
            raise ValueError("`moken` must be provided in the JSON Request Body.")

        moodle = MoodleWebServiceAPIClient(token=context.req.body_json["moken"],api_base="https://lms.ssn.edu.in")
        moodleUserId = moodle.site_info["userid"]
        user_data = moodle.core_user_get_users_by_field("id",[moodleUserId])

        emailAddress= user_data[0]["email"]
        rollnum = user_data[0]["idnumber"]
        name = user_data[0]["fullname"]

        user_id = genUUID(emailAddress)
        try:
            user_authdata = users.get(user_id)
        except AppwriteException as e:
            if e.type == "user_not_found":
                user_authdata = users.create(
                    user_id = user_id,
                    email = emailAddress,
                    name = name
                )
            else:
                raise e
        try:
            user_dbdata = databases.get_document("attendease","users",user_id)
        except AppwriteException as e:
            if e.type == "document_not_found":
                user_dbdata = databases.create_document("attendease","users",user_id,{"email":emailAddress,"rollnum":rollnum})
            else:
                raise e

        return context.res.json({"user_authdata":user_authdata,"user_dbdata":user_dbdata})
    except Exception as e:
        print(e)
        return context.res.json(
            {"Error":str(e)},500
        )

    

    
