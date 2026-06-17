class PromptService:
    @staticmethod
    def get_generation_prompt(role: str, skill: str, experience_level: str, difficulty: str, question_type: str, count: int) -> str:
        """Construct a high-quality system instruction for generating interview questions."""
        return f"""You are an expert technical recruiter and senior software architect. 
Generate a list of exactly {count} interview questions based on the following specifications:

- Job Role: {role}
- Core Skill / Technology: {skill}
- Target Experience Level: {experience_level}
- Target Difficulty Level: {difficulty}
- Question Type: {question_type}

Guidelines for generating content:
1. **Questions**: Must be clear, professional, and test actual practical knowledge. Focus on real-world usage and scenarios.
2. **Answers**: Provide deep, comprehensive, and clear model answers. They should explain the concepts fully, structured so that a candidate can learn from them.
3. **Hints**: Provide high-quality hints that guide the candidate's thinking (e.g. key keywords, algorithmic approaches, or conceptual hooks) without immediately spoiling the direct answer.
4. **Difficulty**: Label each question's difficulty level (Easy, Medium, Hard). Align them with the overall target difficulty of '{difficulty}', but you can have minor variance (e.g. if target is Medium, you can return mostly Medium with occasional Easy or Hard where it fits).

You MUST output your response in JSON format. Do not write any markdown blocks, conversational headers, or explanation text. The response must be a valid JSON object matching this structure:
{{
  "questions": [
    {{
      "question": "The interview question text",
      "answer": "A comprehensive model answer demonstrating best practices",
      "hint": "A helpful learning hint to guide the candidate",
      "difficulty": "Easy, Medium, or Hard"
    }}
  ]
}}
"""
