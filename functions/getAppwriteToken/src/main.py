from appwrite.client import Client
from appwrite.services.users import Users
from appwrite.exception import AppwriteException
import os
from dotenv import load_dotenv
load_dotenv()

# This Appwrite function will be executed every time your function is triggered
def main(context):
    # You can use the Appwrite SDK to interact with other services
    # For this example, we're using the Users service
    client = (
        Client()
        .set_endpoint(os.environ["APPWRITE_FUNCTION_API_ENDPOINT"])
        .set_project(os.environ["APPWRITE_FUNCTION_PROJECT_ID"])
        .set_key(os.environ["x-appwrite-key"])
    )
    users = Users(client)
    token = users.create_token('671b4700002a7f94b1da')
    secret = token.secret

    # try:
    #     response = users.list()
    #     # Log messages and errors to the Appwrite Console
    #     # These logs won't be seen by your end users
    #     context.log("Total users: " + str(response["total"]))
    # except AppwriteException as err:
    #     context.error("Could not list users: " + repr(err))

    # # The req object contains the request data
    # if context.req.path == "/ping":
    #     # Use res object to respond with text(), json(), or binary()
    #     # Don't forget to return a response!
    #     return context.res.text("Pong")

    return context.res.json(
        {
            "token" : "hellp"
        }
    )
