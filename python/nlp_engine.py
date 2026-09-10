"""
SkillAlign - Python AI / NLP Skill Intelligence Service
SIH 2026 Problem Statement SIH26134 (Government of Maharashtra)
"""

import sys
import json
import re
from typing import List, Dict, Any

TAXONOMY = [
    {
        "name": "Battery Management Systems",
        "category": "EV & Clean Mobility",
        "aliases": ["bms", "battery management system", "bms calibration", "cell balancing"],
        "isEmerging": True,
        "demandIndex": 94
    },
    {
        "name": "Battery Diagnostics",
        "category": "EV & Clean Mobility",
        "aliases": ["battery diagnostics", "battery health testing", "soh testing", "pack testing"],
        "isEmerging": True,
        "demandIndex": 91
    },
    {
        "name": "EV Safety Protocols",
        "category": "EV & Clean Mobility",
        "aliases": ["ev safety", "high voltage safety", "hv safety", "ais 038", "ais 156"],
        "isEmerging": True,
        "demandIndex": 88
    },
    {
        "name": "Charging Infrastructure",
        "category": "EV & Clean Mobility",
        "aliases": ["charging infrastructure", "ev charging", "dc fast charging", "ccs2", "ocpp"],
        "isEmerging": True,
        "demandIndex": 85
    },
    {
        "name": "PLC Programming",
        "category": "Industry 4.0 & Automation",
        "aliases": ["plc", "plc programming", "ladder logic", "siemens s7"],
        "isEmerging": False,
        "demandIndex": 86
    },
    {
        "name": "Industrial Robotics",
        "category": "Industry 4.0 & Automation",
        "aliases": ["industrial robotics", "kuka", "fanuc", "abb robot", "robotics"],
        "isEmerging": True,
        "demandIndex": 89
    }
]

def preprocess(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\s\.-]', ' ', text)
    return re.sub(r'\s+', ' ', text).strip()

def extract_skills(text: str) -> List[Dict[str, Any]]:
    clean = preprocess(text)
    results = []
    
    for item in TAXONOMY:
        matched = False
        matched_alias = None
        freq = 0
        
        # Check canonical
        canonical_matches = re.findall(rf'\b{re.escape(item["name"].lower())}\b', clean)
        if canonical_matches:
            matched = True
            matched_alias = item["name"]
            freq += len(canonical_matches)
            
        # Check aliases
        for alias in item["aliases"]:
            alias_matches = re.findall(rf'\b{re.escape(alias.lower())}\b', clean)
            if alias_matches:
                matched = True
                if not matched_alias or len(alias) > len(matched_alias):
                    matched_alias = alias
                freq += len(alias_matches)
                
        if matched:
            confidence = min(99, int(90 + min(9, freq * 3)))
            results.append({
                "name": item["name"],
                "category": item["category"],
                "matchedAlias": matched_alias,
                "confidence": confidence,
                "isEmerging": item["isEmerging"],
                "frequency": freq
            })
            
    return sorted(results, key=lambda x: x["frequency"], reverse=True)

if __name__ == "__main__":
    sample_text = sys.argv[1] if len(sys.argv) > 1 else (
        "Seeking EV Technician proficient in Battery Management Systems, BMS diagnostics, "
        "EV safety protocols, and DC fast charging infrastructure."
    )
    extracted = extract_skills(sample_text)
    print(json.dumps(extracted, indent=2))
