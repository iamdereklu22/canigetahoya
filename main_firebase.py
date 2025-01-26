import firebase_admin
import vertexai
import pathlib
import base64


from google.cloud import aiplatform
from firebase_functions import storage_fn
from firebase_admin import initialize_app, storage as admin_storage, firestore
from vertexai.generative_models import GenerativeModel, Part, SafetySetting

# Initialize Firebase Admin
initialize_app()

# Initialize Vertex AI
vertexai.init(project="hoyahacks-54bf3", location="us-central1")
model = GenerativeModel(
    "gemini-1.5-pro-002",
)
generation_config = {
    "max_output_tokens": 8192,
    "temperature": 1,
    "top_p": 0.95,
}


# Cloud Function to trigger on file upload (on_object_finalized)
@storage_fn.on_object_finalized(bucket="audio_files_recording")
def text_summarization(event: storage_fn.CloudEvent) -> None:
    try:
        # Retrieve bucket and file information from the event
        bucket_name = event.data.bucket
        file_path = pathlib.PurePath(event.data.name)
        file_name = file_path.name

        # Ensure the file is a text file
        if not file_name.startswith("audio_files_transcription/") and not file_name.endswith(".txt"):
            print(f"Skipping file outside target folder: {file_name}")
            return

        print(f"Processing file: {file_name} from bucket: {bucket_name}")

        # Access the bucket and the blob
        bucket = admin_storage.bucket(bucket_name)
        blob = bucket.blob(str(file_path))

        # Download blob content
        #           download_as_string
        text = blob.download_as_text()

        print(f"Downloaded text: {text}")

        # Generate summary using Vertex AI
        responses = model.generate_content(
            [f"""
            You are a trained medical professional who's duty is to pay close attention to patients.
            You will be given a conversation regarding a patient's health or state.
            Your job is to analyze this conversation and pinpoint important details regarding the patient's well-being.
            There will be several components of your analysis and response.
            First, give a 3 sentence summary of what happened to the patient.
            Next, detail facts about the patient. For example, allergies, medication, food consumption, overall health.
            
            Use the following example output to model your responses:
            'Summary: Thomas fell while walking to the bathroom and hit his head on the sink. He lost consciousness and 
            woke up with blooding coming out of a gash in his head. When medics arrived, he stated he felt cold and light-headed.
            Medical Conditions: High Blood Pressure. Medications: None. Food Intake: Pasta. 
            Allergies: Peanuts. Recent Illnesses: None. Current Symptoms: Dizziness, lightheadedness.'

            Make sure model your response exactly as I told you.
            Now do the assigned tasks given the following conversation: {text}"""],
            generation_config=generation_config,
            stream=True,
        )

        final_response = ""
        for response in responses:
            final_response += response.text
            
        # Save the summary to Firestore
        db = firestore.client()
        doc_name = file_name.replace("/", "-")  # Ensure valid Firestore document ID
        #print(f"Raw response: {response.text}")
        
        underscore_index = file_name.find("_")
        dot_index = file_name.find(".")

        doc_name = file_name[underscore_index + 1:dot_index]

        db.collection('summary_txt').document(doc_name).set({"text": final_response})

        print(f"Successfully processed and summarized: {file_name}")

    except Exception as e:
        print(f"Error processing file {file_name}: {e}")


# Cloud Function to trigger on file upload (on_object_finalized)
@storage_fn.on_object_finalized(bucket="audio_files_recording")
def doctor_summarization(event: storage_fn.CloudEvent) -> None:
    try:
        # Retrieve bucket and file information from the event
        bucket_name = event.data.bucket
        file_path = pathlib.PurePath(event.data.name)
        file_name = file_path.name

        # Ensure the file is a text file
        if not file_name.startswith("doctor_info_transcription/") and not file_name.endswith(".txt"):
            print(f"Skipping file outside target folder: {file_name}")
            return

        print(f"Processing file: {file_name} from bucket: {bucket_name}")

        # Access the bucket and the blob
        bucket = admin_storage.bucket(bucket_name)
        blob = bucket.blob(str(file_path))

        # Download blob content
        #           download_as_string
        text = blob.download_as_text()

        print(f"Downloaded text: {text}")

        # Generate summary using Vertex AI
        responses = model.generate_content(
            [f"""
            You are a trained medical doctor who's duty is to analyze patients and diagnose health issues.
            You will be given documentation that details all of the tests, medications, and overall health of a patient.
            Your job is to analyze this documentation and pinpoint important details regarding the patient.
            There will be several components of your analysis and response.

            First, give a succinct sentence of the primary concern of the patient.
            Next, detail the tests that were ran and the respective results.
            Next, detail the medication that the doctor suggested to the patient and locations where they can find this.
            Lastly, detail what the doctor recommends for how the patient go about in the coming weeks.

            Use the following example output to model your responses:
            'Primary Concern: Thomas suffered trauma to the head and had a moderate concussion.
            Tests Ran: A CT Scan was performed and we discovered light damage to the frontal part of the brain. We also ran basic cognitive tests and Thomas performed relatively well.
            Medication Prescribed: None.
            Doctor's Recommendation: Stay home from work for 2 weeks and don't move too much. Rest and eat nutritious food.

            Make sure model your response exactly as I told you. Use medical terminology where appropriate but describe what they are if the average person 
            wouldn't know what the term is.

            Now do the assigned tasks given the following conversation: {text}"""],
            generation_config=generation_config,
            stream=True,
        )

        final_response = ""
        for response in responses:
            final_response += response.text
            
        # Save the summary to Firestore
        db = firestore.client()
        doc_name = file_name.replace("/", "-")  # Ensure valid Firestore document ID
        #print(f"Raw response: {response.text}")
        
        underscore_index = file_name.find("_")
        dot_index = file_name.find(".")

        doc_name = file_name[underscore_index + 1:dot_index]

        db.collection('doctor_info').document(doc_name).set({"text": final_response})

        print(f"Successfully processed and summarized: {file_name}")

    except Exception as e:
        print(f"Error processing file {file_name}: {e}")
