from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.services.users import Users
from appwrite.query import Query
from appwrite.id import ID
from appwrite.exception import AppwriteException
import os
from uuid import uuid5, NAMESPACE_URL
from pymoodle import MoodleWebServiceAPIClient, MoodleError,MoodleException


def genUUID(email):
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

        authusers = users.get(genUUID(emailAddress))
        # if authusers["total"] < 1:
        #     userid = ID.unique(),
        #     result = users.create(
        #         user_id = userid,
        #         email = emailAddress,
        #         name = name
        #     )
        #     databases.create_document("attendease","users",userid,{"email":emailAddress,"rollnum":rollnum})
        # authuser = users.list([Query.equal("email",emailAddress)])[0]
        # datauser = databases.get_document("attendease","users",authuser.)

        return context.res.json({"user":"hi"})
    except Exception as e:
        print(e)
        return context.res.json(
            {"Error":str(e)},500
        )

    

    
