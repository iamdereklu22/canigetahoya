# Suggested code may be subject to a license. Learn more: ~LicenseLog:2139999072.
# Suggested code may be subject to a license. Learn more: ~LicenseLog:342849522.

import vertexai
from vertexai.preview.language_models import TextGenerationModel

def summarize_text(text: str, project_id: str, location: str) -> str:
    vertexai.init(project=project_id, location=location)
    parameters = {
        "max_output_tokens": 256,
        "temperature": 0.2,
        "top_p": 0.8,
        "top_k": 40,
    }
    model = TextGenerationModel.from_pretrained("text-bison@001")
    response = model.predict(
        """
        Your task is to summarize conversations regarding a patient's health or state.
        This summarization must be accurate and concise so that healthcare professionals can use this information 
        to decide how to proceed with treating the patient. 
        Be sure to highlight the most important pieces of information and include that as bullet points in your summary.
        For example, if the text describes a patient who is bleeding from the head and is coming in and out of conciousness, 
        you should highlight these features as bullet points.
        Text: {text}
        Summary:
        """,
        **parameters
    )
    return response.text
