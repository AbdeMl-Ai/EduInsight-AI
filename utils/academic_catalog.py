ACADEMIC_LEVELS = ("1AC", "2AC", "3AC", "TRC", "1BAC", "2BAC")
SUBJECTS = ("Math", "PC", "SVT", "English", "French")


def normalize_academic_level(value: str) -> str:
    if not isinstance(value, str):
        raise ValueError("Academic level must be a string.")
    normalized = value.strip().upper().replace("_", "").replace(" ", "")
    if normalized not in ACADEMIC_LEVELS:
        raise ValueError(f"Invalid academic level. Allowed values: {', '.join(ACADEMIC_LEVELS)}.")
    return normalized


def normalize_subject(value: str) -> str:
    if not isinstance(value, str):
        raise ValueError("Subject must be a string.")
    normalized = " ".join(value.strip().casefold().replace("_", " ").split())
    aliases = {
        "math": "Math",
        "maths": "Math",
        "mathematics": "Math",
        "mathematiques": "Math",
        "pc": "PC",
        "physique": "PC",
        "svt": "SVT",
        "english": "English",
        "anglais": "English",
        "french": "French",
        "francais": "French",
    }
    if normalized in aliases:
        return aliases[normalized]

    words = normalized.split()
    for boundary in range(1, len(words)):
        level_prefix = " ".join(words[:boundary])
        try:
            normalize_academic_level(level_prefix)
        except ValueError:
            continue
        subject_suffix = " ".join(words[boundary:])
        if subject_suffix in aliases:
            return aliases[subject_suffix]
    raise ValueError(f"Invalid subject. Allowed values: {', '.join(SUBJECTS)}.")