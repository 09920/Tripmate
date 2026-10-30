#!/usr/bin/env python3
"""
TripMeta Academic Project Report Generator
Builds both TripMeta_Final_Project_Report.pdf and TripMeta_Final_Project_Report.docx
Academic Year 2026-27 | Department of Computer Engineering, SPIT, Mumbai
Authors: Omkar Malode (2024300130) & Yash Bhandare (2024300020)
Guide: Prof. Rohan Shinde
"""

import os
import sys
import datetime
from PIL import Image as PILImage

# ReportLab imports
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

# Docx imports
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

ASSETS_DIR = os.path.abspath("report_assets")
OUTPUT_PDF = os.path.abspath("TripMeta_Final_Project_Report.pdf")
OUTPUT_DOCX = os.path.abspath("TripMeta_Final_Project_Report.docx")

print("Starting generation of TripMeta Academic Project Report...")
print(f"Assets Directory: {ASSETS_DIR}")
print(f"Target PDF: {OUTPUT_PDF}")
print(f"Target DOCX: {OUTPUT_DOCX}")
