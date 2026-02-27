import re
from .normalizer import normalize_section_name

import re

def parse_sections(raw_text):
    sections = {}

    pattern = r"([A-Za-z ]+):"
    splits = re.split(pattern, raw_text)

    for i in range(1, len(splits), 2):
        raw_name = splits[i].strip()
        content = splits[i+1].strip()

        normalized = normalize_section_name(raw_name)

        if normalized:
            sections[normalized] = content

    return sections