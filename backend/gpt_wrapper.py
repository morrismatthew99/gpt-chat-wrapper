import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# DEBUG: Print all environment variables to confirm key is loaded
print("=== DEBUG: Environment Variables ===")
for key, value in os.environ.items():
    print(f"{key} = {value}")
print("====================================")

class GPTWrapper:
    def __init__(self, model="gpt-3.5-turbo"):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        self.client = OpenAI(api_key=api_key)
        self.model = model

    def ask(self, prompt):
        response = self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
