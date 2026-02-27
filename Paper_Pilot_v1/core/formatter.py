import os
import subprocess
from latex_engine.injector import inject_content

TEMPLATE_DIR = "templates"

def get_available_formats():
    return [
        name for name in os.listdir(TEMPLATE_DIR)
        if os.path.isdir(os.path.join(TEMPLATE_DIR, name))
    ]

def compile_pdf(tex_path):
    directory = os.path.dirname(tex_path)
    filename = os.path.basename(tex_path)

    command = [
        "pdflatex",
        "-interaction=nonstopmode",
        filename
    ]

    result = subprocess.run(
        command,
        cwd=directory,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )

    if result.returncode != 0:
        raise Exception("PDF compilation failed")

    return tex_path.replace(".tex", ".pdf")

def generate_formats(content_dict, formats, output_type="pdf"):
    generated_paths = {}

    for format_name in formats:
        template_path = os.path.join(TEMPLATE_DIR, format_name, "main.tex")

        if not os.path.exists(template_path):
            continue

        filled_tex = inject_content(template_path, content_dict)

        output_dir = os.path.join("outputs", format_name)
        os.makedirs(output_dir, exist_ok=True)

        tex_path = os.path.join(output_dir, "output.tex")

        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(filled_tex)

        result_files = {"tex": tex_path}

        if output_type == "pdf":
            pdf_path = compile_pdf(tex_path)
            result_files["pdf"] = pdf_path

        generated_paths[format_name] = result_files

    return generated_paths