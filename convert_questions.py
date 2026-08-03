import json
import os

def normalize_questions():
    input_file = 'FINAL_QUESTIONS.json'
    output_json = 'questions.json'
    output_js = 'questions.js'
    
    if not os.path.exists(input_file):
        print(f"Error: {input_file} not found.")
        return
        
    with open(input_file, 'r', encoding='utf-8') as f:
        raw_data = json.load(f)
        
    normalized = []
    
    for idx, item in enumerate(raw_data, 1):
        q_id = item.get("S/N", idx)
        question_text = str(item.get("QUESTION", "") or "").strip()
        answers_str = str(item.get("ANSWERS", "") or "").strip()
        
        option_letters = ['A', 'B', 'C', 'D', 'E']
        options = []
        
        for i, letter in enumerate(option_letters):
            opt_key = f"OPTION {letter}"
            exp_key1 = f"EXPLATION {letter}"
            exp_key2 = f"EXPLANATION {letter}"
            
            opt_text = str(item.get(opt_key, "") or "").strip()
            exp_text = str(item.get(exp_key1) or item.get(exp_key2) or "").strip()
            
            # Answer mapping: T or F
            ans_char = answers_str[i].upper() if i < len(answers_str) else "F"
            if ans_char not in ["T", "F"]:
                ans_char = "F" # fallback if invalid char like '-'
                
            if opt_text: # only add if option exists
                options.append({
                    "id": letter,
                    "text": opt_text,
                    "answer": ans_char,
                    "explanation": exp_text
                })
                
        normalized.append({
            "id": int(q_id) if isinstance(q_id, (int, float)) or (isinstance(q_id, str) and q_id.isdigit()) else idx,
            "type": "MTF", # Multiple True/False
            "question": question_text,
            "options": options
        })
        
    # Write questions.json
    with open(output_json, 'w', encoding='utf-8') as f:
        json.dump(normalized, f, indent=2, ensure_ascii=False)
        
    # Write questions.js for file:// fallback (allows opening index.html directly without server)
    with open(output_js, 'w', encoding='utf-8') as f:
        f.write("window.QUESTIONS_DATA = " + json.dumps(normalized, indent=2, ensure_ascii=False) + ";\n")
        
    print(f"Successfully processed {len(normalized)} questions into {output_json} and {output_js}.")

if __name__ == '__main__':
    normalize_questions()
