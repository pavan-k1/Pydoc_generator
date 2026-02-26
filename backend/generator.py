import google.generativeai as genai


def generate_docstring(code_segment, style,node_type,existing_docstring=None):
    genai.configure(api_key="AIzaSyBVGnCZOmpXQ7idtwB0O3YkUiX07PuZqck")
    model = genai.GenerativeModel("gemini-2.5-flash")

    Styles = {
        "google": "Follow Google Python docstring style.",
        "numpy": "Follow NumPy docstring style.",
        "rest": "Follow reStructuredText docstring style."
    }

    if style not in Styles:   # dealing with the edge case when the style provided by the user is not from the Styles
        style = "google"
    
    if node_type=="function":
     if existing_docstring:
      prompt = f'''
           
           You are an expert Python developer.
           Ensure that the following existing docstring fully follows {Styles[style]} style and PEP 257 conventions.
           If it does not match the requested style or is incomplete, rewrite and complete it properly.
           Return only the corrected docstring (no code, no extra quotes)
           Include a summary, parameters with types, return type, and description.
           Do NOT include the function code, code fences, or extra quotes.
          --> first word should not end with s.
       {Styles[style]}

       Function:
       {code_segment}
     Existing docstring:
  \"\"\"{existing_docstring}\"\"\" 
''' 
     else:
       prompt = f'''
           You are an expert Python developer.
           Generate Python docstring (triple-quoted) PEP257 validated for the following function.
           Include a summary, parameters with types, return type, and description.
           Do NOT include the function code, code fences, or extra quotes.
           -->first word should not end with s.

       {Styles[style]}

       Function:
       {code_segment}
      '''
    elif node_type=="class":
     if existing_docstring:
      prompt = f'''
           
           You are an expert Python developer.
           Ensure that the following existing docstring fully follows {Styles[style]} style and PEP 257 conventions.
           If it does not match the requested style or is incomplete, rewrite and complete it properly.
           Return only the corrected docstring (no code, no extra quotes)
           Do NOT include the function code, code fences, or extra quotes.
           -->first word should not end with s.
       {Styles[style]}

       Class
       {code_segment}
     Existing docstring:
  \"\"\"{existing_docstring}\"\"\" 
''' 
     else:
       prompt = f'''
           You are an expert Python developer.
           Generate Python docstring (triple-quoted) PEP257 validated for the following Class in just 2-3 lines.
           Do NOT include the function code, code fences, or extra quotes.
          --> first word should not end with s.

       {Styles[style]}

       Class:
       {code_segment}
      '''
    elif node_type=="module":
       prompt = f'''
           You are an expert Python developer.
           Generate Python docstring (triple-quoted) PEP257 validated for the following Module in just two lines.
           Do NOT include the function code, code fences, or extra quotes.
           -->first word should not end with s.

       {Styles[style]}

       Module:
       {code_segment}
      '''     

     
    try:
        import requests

        headers = {
            "Authorization": f"Bearer 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"
        }

        API_URL = "https://router.huggingface.co/v1/chat/completions"

        def query(payload):
            response = requests.post(API_URL, headers=headers, json=payload)
            return response

        response = query({
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "model": "zai-org/GLM-4.7:cerebras"
        })

        if response.status_code == 200:
            result = response.json()
            if "choices" in result and result["choices"]:
                return result["choices"][0]["message"]["content"].strip()
            else:
                print("Unexpected HF response:", result)
        else:
            print("HF API Error:", response.text)

    except Exception as hf_error:
        print("HuggingFace fallback failed:", hf_error)
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print("Gemini has some problem:", e)
        return "There is some problem Hence,Docstring generation failed."

